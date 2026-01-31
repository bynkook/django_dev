"""
Image Inspector - 이미지/PDF 비교 처리 모듈
image_inspector.py의 핵심 로직을 FastAPI용으로 포팅
"""

import cv2
import numpy as np
import fitz  # PyMuPDF
from PIL import Image
import base64
import io
from typing import Tuple, Optional
import logging

logger = logging.getLogger(__name__)


def pdf_to_image(pdf_bytes: bytes, page_num: int = 0, dpi: int = 300) -> Tuple[np.ndarray, int]:
    """
    PDF를 이미지로 변환
    
    Args:
        pdf_bytes: PDF 파일의 바이트 데이터
        page_num: 변환할 페이지 번호 (0-based)
        dpi: 해상도 (기본 300)
    
    Returns:
        (이미지 BGR 배열, 전체 페이지 수)
    """
    try:
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        if page_num >= pdf_document.page_count:
            page_num = 0
        
        page = pdf_document[page_num]
        zoom = dpi / 72
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        img_array = np.array(img)
        img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        
        total_pages = pdf_document.page_count
        pdf_document.close()
        
        return img_bgr, total_pages
    except Exception as e:
        logger.error(f"PDF 변환 실패: {str(e)}")
        raise ValueError(f"PDF 변환 실패: {str(e)}")


def load_file(file_bytes: bytes, content_type: str, page_num: int = 0) -> Tuple[np.ndarray, int, str]:
    """
    파일 로드 (이미지 또는 PDF)
    
    Args:
        file_bytes: 파일 바이트 데이터
        content_type: MIME 타입
        page_num: PDF 페이지 번호
    
    Returns:
        (이미지 BGR 배열, 총 페이지 수, 파일 타입)
    """
    try:
        if "pdf" in content_type.lower():
            img_bgr, total_pages = pdf_to_image(file_bytes, page_num=page_num)
            return img_bgr, total_pages, "pdf"
        else:
            arr = np.frombuffer(file_bytes, np.uint8)
            img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise ValueError("이미지 디코딩 실패")
            
            return img, 1, "image"
    except Exception as e:
        logger.error(f"파일 로드 실패: {str(e)}")
        raise ValueError(f"파일 로드 실패: {str(e)}")


def downsample_if_needed(img: np.ndarray, max_dimension: int = 4000) -> np.ndarray:
    """
    이미지가 너무 크면 다운샘플링
    
    Args:
        img: 입력 이미지
        max_dimension: 최대 크기 (픽셀)
    
    Returns:
        다운샘플링된 이미지
    """
    h, w = img.shape[:2]
    max_size = max(h, w)
    
    if max_size > max_dimension:
        scale = max_dimension / max_size
        new_w = int(w * scale)
        new_h = int(h * scale)
        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
        logger.info(f"이미지 다운샘플링: {w}x{h} -> {new_w}x{new_h}")
    
    return img


def align_images(A_bgr: np.ndarray, B_bgr: np.ndarray, nfeatures: int = 4000) -> Tuple[np.ndarray, Optional[np.ndarray], Optional[np.ndarray], float]:
    """
    ORB 특징점 매칭을 이용한 이미지 정렬
    
    Args:
        A_bgr: 기준 이미지
        B_bgr: 정렬할 이미지
        nfeatures: ORB 특징점 개수
    
    Returns:
        (기준 이미지, 정렬된 이미지, 호모그래피 행렬, 매칭 품질)
    """
    A_gray = cv2.cvtColor(A_bgr, cv2.COLOR_BGR2GRAY)
    B_gray = cv2.cvtColor(B_bgr, cv2.COLOR_BGR2GRAY)

    orb = cv2.ORB_create(nfeatures=nfeatures)
    kp1, des1 = orb.detectAndCompute(A_gray, None)
    kp2, des2 = orb.detectAndCompute(B_gray, None)

    if des1 is None or des2 is None or len(kp1) < 4 or len(kp2) < 4:
        logger.warning("특징점 부족, 정렬 실패")
        return A_bgr, None, None, 0

    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=False)
    try:
        matches = bf.knnMatch(des1, des2, k=2)
    except Exception:
        logger.warning("특징점 매칭 실패")
        return A_bgr, None, None, 0

    good_matches = []
    for match_pair in matches:
        if len(match_pair) == 2:
            m, n = match_pair
            if m.distance < 0.75 * n.distance:
                good_matches.append(m)

    min_matches = 10
    if len(good_matches) < min_matches:
        logger.warning(f"충분한 매칭 부족: {len(good_matches)}/{min_matches}")
        return A_bgr, None, None, len(good_matches) / min_matches

    src_pts = np.float32([kp1[m.queryIdx].pt for m in good_matches]).reshape(-1, 1, 2)
    dst_pts = np.float32([kp2[m.trainIdx].pt for m in good_matches]).reshape(-1, 1, 2)

    H, mask = cv2.findHomography(dst_pts, src_pts, cv2.RANSAC, 5.0)
    
    if H is None:
        logger.warning("호모그래피 계산 실패")
        return A_bgr, None, None, 0

    inliers = np.sum(mask)
    match_quality = inliers / len(good_matches) if len(good_matches) > 0 else 0

    hA, wA = A_bgr.shape[:2]
    warped_B = cv2.warpPerspective(B_bgr, H, (wA, hA),
                                   flags=cv2.INTER_LINEAR,
                                   borderMode=cv2.BORDER_CONSTANT,
                                   borderValue=(255, 255, 255))

    logger.info(f"정렬 성공: 매칭 품질 {match_quality:.2f}")
    return A_bgr, warped_B, H, match_quality


def fallback_align(A_bgr: np.ndarray, B_bgr: np.ndarray) -> np.ndarray:
    """
    간단한 리사이즈 기반 정렬 (폴백)
    
    Args:
        A_bgr: 기준 이미지
        B_bgr: 정렬할 이미지
    
    Returns:
        정렬된 이미지
    """
    hA, wA = A_bgr.shape[:2]
    hB, wB = B_bgr.shape[:2]

    scale = min(wA / wB, hA / hB)
    new_w = int(wB * scale)
    new_h = int(hB * scale)
    B_resized = cv2.resize(B_bgr, (new_w, new_h), interpolation=cv2.INTER_AREA)

    canvas = np.full((hA, wA, 3), 255, dtype=np.uint8)
    x_off = (wA - new_w) // 2
    y_off = (hA - new_h) // 2
    canvas[y_off:y_off+new_h, x_off:x_off+new_w] = B_resized
    
    logger.info("폴백 정렬 사용 (리사이즈 기반)")
    return canvas


def compare_images(A_bgr: np.ndarray, B_aligned_bgr: np.ndarray, diff_thresh: int = 30) -> np.ndarray:
    """
    두 이미지 비교 (차이점 강조)
    
    - A에만 있는 부분 -> 파랑
    - B에만 있는 부분 -> 빨강
    - 공통 부분 -> 검정
    - 배경 -> 흰색
    
    Args:
        A_bgr: 첫 번째 이미지
        B_aligned_bgr: 정렬된 두 번째 이미지
        diff_thresh: 차이 임계값
    
    Returns:
        비교 결과 이미지
    """
    h, w = A_bgr.shape[:2]
    
    A_gray = cv2.cvtColor(A_bgr, cv2.COLOR_BGR2GRAY)
    B_gray = cv2.cvtColor(B_aligned_bgr, cv2.COLOR_BGR2GRAY)
    
    _, A_bin = cv2.threshold(A_gray, 200, 255, cv2.THRESH_BINARY_INV)
    _, B_bin = cv2.threshold(B_gray, 200, 255, cv2.THRESH_BINARY_INV)
    
    diff = cv2.absdiff(A_gray, B_gray)
    _, diff_mask = cv2.threshold(diff, diff_thresh, 255, cv2.THRESH_BINARY)
    
    only_A = np.logical_and(A_bin > 0, B_bin == 0).astype(np.uint8) * 255
    only_B = np.logical_and(B_bin > 0, A_bin == 0).astype(np.uint8) * 255
    both = np.logical_and(A_bin > 0, B_bin > 0).astype(np.uint8) * 255
    
    diff_common = np.logical_and(diff_mask > 0, both > 0)
    darker_in_A = np.logical_and(diff_common, A_gray < B_gray)
    darker_in_B = np.logical_and(diff_common, B_gray < A_gray)
    
    only_A = np.logical_or(only_A > 0, darker_in_A)
    only_B = np.logical_or(only_B > 0, darker_in_B)
    both = np.logical_and(both > 0, ~diff_mask.astype(bool))
    
    result = np.full((h, w, 3), 255, dtype=np.uint8)
    result[both] = [0, 0, 0]
    result[only_A] = [255, 0, 0]
    result[only_B] = [0, 0, 255]
    
    return result


def compare_images_overlay(A_bgr: np.ndarray, B_aligned_bgr: np.ndarray) -> np.ndarray:
    """
    두 이미지 오버레이 (겹치기)
    
    - A (1번 도면) -> 주황색
    - B (2번 도면) -> 초록색
    
    Args:
        A_bgr: 첫 번째 이미지
        B_aligned_bgr: 정렬된 두 번째 이미지
    
    Returns:
        오버레이 결과 이미지
    """
    h, w = A_bgr.shape[:2]
    
    A_gray = cv2.cvtColor(A_bgr, cv2.COLOR_BGR2GRAY)
    B_gray = cv2.cvtColor(B_aligned_bgr, cv2.COLOR_BGR2GRAY)
    
    _, A_bin = cv2.threshold(A_gray, 200, 255, cv2.THRESH_BINARY_INV)
    _, B_bin = cv2.threshold(B_gray, 200, 255, cv2.THRESH_BINARY_INV)
    
    result = np.full((h, w, 3), 255, dtype=np.uint8)
    
    # A: 주황색 (BGR: 0, 165, 255)
    result[A_bin > 0] = [0, 165, 255]
    
    # B: 초록색 (BGR: 0, 255, 0)
    result[B_bin > 0] = [0, 255, 0]
    
    return result


def encode_image_to_base64(img: np.ndarray, format: str = 'JPEG', quality: int = 85) -> str:
    """
    이미지를 base64 문자열로 인코딩
    
    Args:
        img: 입력 이미지 (BGR)
        format: 'JPEG' 또는 'PNG'
        quality: JPEG 품질 (1-100)
    
    Returns:
        base64 인코딩된 data URI
    """
    if format.upper() == 'JPEG':
        encode_param = [cv2.IMWRITE_JPEG_QUALITY, quality]
        _, buffer = cv2.imencode('.jpg', img, encode_param)
        mime_type = 'image/jpeg'
    else:  # PNG
        _, buffer = cv2.imencode('.png', img)
        mime_type = 'image/png'
    
    base64_str = base64.b64encode(buffer).decode('utf-8')
    return f"data:{mime_type};base64,{base64_str}"


def generate_highlighted_images(A_bgr: np.ndarray, B_aligned_bgr: np.ndarray, diff_thresh: int = 30) -> Tuple[np.ndarray, np.ndarray]:
    """
    각 이미지에 차이점 강조 (Side-by-Side 뷰용)
    A에는 A만의 특징(삭제됨)을, B에는 B만의 특징(추가됨)을 강조
    """
    h, w = A_bgr.shape[:2]
    
    A_gray = cv2.cvtColor(A_bgr, cv2.COLOR_BGR2GRAY)
    B_gray = cv2.cvtColor(B_aligned_bgr, cv2.COLOR_BGR2GRAY)
    
    _, A_bin = cv2.threshold(A_gray, 200, 255, cv2.THRESH_BINARY_INV)
    _, B_bin = cv2.threshold(B_gray, 200, 255, cv2.THRESH_BINARY_INV)
    
    diff = cv2.absdiff(A_gray, B_gray)
    _, diff_mask = cv2.threshold(diff, diff_thresh, 255, cv2.THRESH_BINARY)
    
    # Masks
    only_A = np.logical_and(A_bin > 0, B_bin == 0).astype(np.uint8) * 255
    only_B = np.logical_and(B_bin > 0, A_bin == 0).astype(np.uint8) * 255
    both = np.logical_and(A_bin > 0, B_bin > 0).astype(np.uint8) * 255
    
    # 엣지 노이즈 보정 (Common diff)
    diff_common = np.logical_and(diff_mask > 0, both > 0)
    darker_in_A = np.logical_and(diff_common, A_gray < B_gray)
    darker_in_B = np.logical_and(diff_common, B_gray < A_gray)
    
    only_A = np.logical_or(only_A > 0, darker_in_A)
    only_B = np.logical_or(only_B > 0, darker_in_B)

    # Image A Highlighted (Blue for missing/changed)
    # 원본 이미지를 흐리게 하고 차이 부분만 강조
    imgA_out = A_bgr.copy()
    # 배경 흐리게
    # imgA_out = cv2.addWeighted(imgA_out, 0.7, np.full_like(imgA_out, 255), 0.3, 0)
    # 강조 (Blue)
    imgA_out[only_A] = [255, 0, 0] # Blue
    
    # Image B Highlighted (Red for added/changed)
    imgB_out = B_aligned_bgr.copy()
    # imgB_out = cv2.addWeighted(imgB_out, 0.7, np.full_like(imgB_out, 255), 0.3, 0)
    imgB_out[only_B] = [0, 0, 255] # Red
    
    return imgA_out, imgB_out

def process_comparison(
    file1_bytes: bytes,
    file1_type: str,
    file2_bytes: bytes,
    file2_type: str,
    mode: str = "difference",
    diff_threshold: int = 30,
    feature_count: int = 4000,
    page1: int = 0,
    page2: int = 0
) -> dict:
    """
    이미지 비교 전체 파이프라인
    
    Args:
        file1_bytes: 첫 번째 파일 바이트
        file1_type: 첫 번째 파일 MIME 타입
        file2_bytes: 두 번째 파일 바이트
        file2_type: 두 번째 파일 MIME 타입
        mode: 'difference' 또는 'overlay'
        diff_threshold: 차이 임계값
        feature_count: ORB 특징점 개수
        page1: PDF 페이지 번호 (file1)
        page2: PDF 페이지 번호 (file2)
    
    Returns:
        {
            "result_base64": str (JPEG 압축, 화면 표시용),
            "file1_base64": str,
            "file2_base64": str,
            "download_base64": str (PNG 고품질, 다운로드용),
            "metadata": dict
        }
    """
    try:
        # 1. 파일 로드
        logger.info("파일 로드 중...")
        img1, pages1, type1 = load_file(file1_bytes, file1_type, page1)
        img2, pages2, type2 = load_file(file2_bytes, file2_type, page2)
        
        # 2. 다운샘플링
        img1 = downsample_if_needed(img1, max_dimension=4000)
        img2 = downsample_if_needed(img2, max_dimension=4000)
        
        # 3. 이미지 정렬
        logger.info("이미지 정렬 중...")
        _, aligned_img2, H, quality = align_images(img1, img2, nfeatures=feature_count)
        
        # 폴백: 정렬 실패 시
        if aligned_img2 is None or quality < 0.3:
            logger.warning("ORB 정렬 실패, 폴백 정렬 사용")
            aligned_img2 = fallback_align(img1, img2)
        
        # 4. 비교
        logger.info(f"비교 모드: {mode}")
        
        file1_result = img1
        file2_result = aligned_img2

        if mode == "overlay":
            result = compare_images_overlay(img1, aligned_img2)
            # Overlay 모드에서는 원본(정렬된) 그냥 반환
        else:  # difference
            result = compare_images(img1, aligned_img2, diff_thresh=diff_threshold)
            # Difference 모드에서는 하이라이트된 개별 이미지 생성
            file1_result, file2_result = generate_highlighted_images(img1, aligned_img2, diff_thresh=diff_threshold)
        
        # 5. 인코딩
        logger.info("이미지 인코딩 중...")
        result_base64 = encode_image_to_base64(result, format='JPEG', quality=85)
        file1_base64 = encode_image_to_base64(file1_result, format='JPEG', quality=85)
        file2_base64 = encode_image_to_base64(file2_result, format='JPEG', quality=85)
        
        download_base64 = encode_image_to_base64(result, format='PNG')
        
        return {
            "result_base64": result_base64,
            "file1_base64": file1_base64,
            "file2_base64": file2_base64,
            "download_base64": download_base64,
            "metadata": {
                "mode": mode,
                "file1_pages": pages1,
                "file2_pages": pages2,
                "match_quality": quality,
                "result_size": f"{result.shape[1]}x{result.shape[0]}"
            }
        }
    
    except Exception as e:
        logger.error(f"비교 처리 실패: {str(e)}")
        raise