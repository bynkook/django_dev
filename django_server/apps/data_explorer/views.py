from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
import pandas as pd
import json

import logging

logger = logging.getLogger(__name__)

# Configuration variables for file size limits
MAX_FILE_SIZE_MB = 500  # Maximum file upload size in MB
MAX_MEMORY_SIZE_MB = 2000  # Maximum memory size for data processing in MB


def get_field_metadata(df):
    """
    Generate field metadata for Graphic Walker from DataFrame columns
    
    Args:
        df: pandas DataFrame
        
    Returns:
        list: Field metadata objects with fid, name, semanticType, and analyticType
    """
    fields = []
    for col in df.columns:
        dtype = str(df[col].dtype)
        if dtype in ['int64', 'float64', 'int32', 'float32']:
            field_type = 'quantitative'
        elif dtype == 'object':
            field_type = 'nominal'
        elif 'datetime' in dtype:
            field_type = 'temporal'
        else:
            field_type = 'nominal'
        
        fields.append({
            'fid': col,
            'name': col,
            'semanticType': field_type,
            'analyticType': 'dimension' if field_type == 'nominal' else 'measure'
        })
    return fields


class GraphicWalkerDataView(APIView):
    """
    Graphic Walker data API View
    Returns CSV data as JSON for Graphic Walker visualization
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        """
        Upload CSV file and return data as JSON for Graphic Walker
        """
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response(
                {"error": "No file uploaded."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check file size limit
        file_size_mb = file_obj.size / (1024 * 1024)
        if file_size_mb > MAX_FILE_SIZE_MB:
            return Response(
                {"error": f"File size exceeds maximum limit of {MAX_FILE_SIZE_MB}MB"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Read CSV file with error handling for malformed rows
            df = pd.read_csv(file_obj, on_bad_lines='skip')
            
            # Check memory usage
            memory_usage_mb = df.memory_usage(deep=True).sum() / (1024 * 1024)
            if memory_usage_mb > MAX_MEMORY_SIZE_MB:
                return Response(
                    {"error": f"Data size exceeds maximum memory limit of {MAX_MEMORY_SIZE_MB}MB"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get field metadata for Graphic Walker (before NaN replacement)
            fields = get_field_metadata(df)
            
            # Convert DataFrame to JSON using pandas to_json()
            # This properly handles NaN -> null conversion
            # orient='records' produces array of objects format for Graphic Walker
            data_json = json.loads(df.to_json(orient='records'))
            
            return Response({
                "data": data_json,
                "fields": fields,
                "total_rows": len(df),
                "filename": file_obj.name
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception(f"Error processing uploaded file: {e}")
            return Response(
                {"error": f"Failed to process file: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )