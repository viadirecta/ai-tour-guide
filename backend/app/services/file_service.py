from fastapi import UploadFile, HTTPException
from google.cloud import storage
from app.core.config import settings
import uuid
import logging
from typing import Optional

logger = logging.getLogger(__name__)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/avi", "video/mov", "video/wmv"}
ALLOWED_KML_TYPES = {"application/vnd.google-earth.kml+xml", "application/xml", "text/xml"}

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB

def validate_file_type_and_size(file: UploadFile, file_category: str) -> None:
    """Validate file type and size based on category"""

    if file_category == "image":
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_IMAGE_TYPES)}"
            )
        max_size = MAX_FILE_SIZE
    elif file_category == "video":
        if file.content_type not in ALLOWED_VIDEO_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_VIDEO_TYPES)}"
            )
        max_size = MAX_VIDEO_SIZE
    elif file_category == "kml":
        if file.content_type not in ALLOWED_KML_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_KML_TYPES)}"
            )
        max_size = MAX_FILE_SIZE
    else:
        raise HTTPException(status_code=400, detail="Invalid file category")

    # Note: file.size might not be available in all cases
    # For production, you might want to read the file in chunks to check size

def upload_file_to_gcs(
    file: UploadFile,
    folder_path: str,
    filename: Optional[str] = None
) -> str:
    """
    Upload file to Google Cloud Storage and return public URL
    """
    try:
        client = storage.Client(project=settings.google_cloud_project)
        bucket = client.bucket(settings.google_cloud_storage_bucket)

        # Generate unique filename if not provided
        if not filename:
            file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
            filename = f"{uuid.uuid4()}.{file_extension}"

        # Create blob path
        blob_path = f"{folder_path}/{filename}"
        blob = bucket.blob(blob_path)

        # Upload file
        file.file.seek(0)  # Reset file pointer
        blob.upload_from_file(file.file, content_type=file.content_type)

        # Make publicly readable
        blob.make_public()

        return blob.public_url

    except Exception as e:
        logger.error(f"Error uploading file to GCS: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to upload file"
        )

def upload_kml_file(file: UploadFile, tour_id: str) -> str:
    """Upload KML file for a tour"""
    validate_file_type_and_size(file, "kml")
    return upload_file_to_gcs(file, f"kml/{tour_id}")

def upload_multimedia_file(file: UploadFile, tour_id: str, poi_id: str, file_type: str) -> str:
    """Upload multimedia file for a POI"""
    validate_file_type_and_size(file, file_type)
    return upload_file_to_gcs(file, f"multimedia/{tour_id}/{poi_id}")

def delete_file_from_gcs(file_url: str) -> None:
    """Delete file from Google Cloud Storage given its public URL"""
    try:
        # Extract blob name from public URL
        # URL format: https://storage.googleapis.com/bucket-name/path/to/file
        if "storage.googleapis.com" in file_url:
            bucket_name = file_url.split("/")[3]
            blob_name = "/".join(file_url.split("/")[4:])

            client = storage.Client(project=settings.google_cloud_project)
            bucket = client.bucket(bucket_name)
            blob = bucket.blob(blob_name)

            blob.delete()

    except Exception as e:
        logger.error(f"Error deleting file from GCS: {str(e)}")
        # Don't raise exception for deletion failures to avoid blocking other operations