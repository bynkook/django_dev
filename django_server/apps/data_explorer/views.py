import os
# PyGWalker가 서버를 띄우거나 브라우저를 여는 것을 방지 (임포트 전 설정)
os.environ["PYGWALKER_NO_BROWSER"] = "1"
os.environ["PYGWALKER_USE_KERNEL"] = "0"

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
import pandas as pd
import pygwalker as pyg

import logging

logger = logging.getLogger(__name__)

class PygWalkerHTMLView(APIView):
    """
    PygWalker HTML을 생성하여 반환하는 API View
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        """
        업로드된 CSV 파일을 읽어 PyGWalker HTML을 반환
        """
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response(
                {"error": "No file uploaded."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # CSV 파일 읽기
            # pandas는 파일 객체를 직접 읽을 수 있음
            df = pd.read_csv(file_obj)
            
            # PyGWalker HTML 생성 (커널 서버 실행 방지 및 순수 HTML 출력)
            # appearance='light'와 함께 theme_key='vega'를 사용하여 밝은 테마 시각화를 강제합니다.
            # dark='light'와 theme='light'는 다양한 라이브러리 버전 호환성을 위해 추가되었습니다.
            walker_html = pyg.to_html(
                df, 
                use_kernel=False, 
                env='gradio', 
                appearance='light', 
                theme_key='vega',
                dark='light',
                theme='light'
            )
            
            return Response({
                "html": walker_html,
                "total_rows": len(df),
                "filename": file_obj.name
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception(f"Error processing uploaded file: {e}")
            return Response(
                {"error": f"Failed to process file: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request, *args, **kwargs):
        """
        기본 샘플 데이터(daily_resource.csv)로 HTML 반환 (테스트용)
        """
        try:
            project_root = settings.BASE_DIR.parent
            csv_path = project_root / "doc" / "daily_resource.csv"

            if not os.path.exists(csv_path):
                return Response(
                    {"error": "Default sample data not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            df = pd.read_csv(csv_path)
            # 샘플 데이터도 동일하게 순수 HTML만 생성하도록 수정
            # appearance='light', theme_key='vega', dark='light' 옵션을 사용하여 밝은 테마를 강제합니다.
            walker_html = pyg.to_html(
                df, 
                use_kernel=False, 
                env='gradio', 
                appearance='light', 
                theme_key='vega',
                dark='light',
                theme='light'
            )
            
            return Response({
                "html": walker_html,
                "total_rows": len(df),
                "filename": "daily_resource.csv (Sample)"
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception(f"Error generating sample view: {e}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )