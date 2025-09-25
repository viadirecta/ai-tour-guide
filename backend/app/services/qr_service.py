import qrcode
from io import BytesIO
from google.cloud import storage
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

def generate_poi_qr_code(tour_id: str, poi_id: str, base_url: str = "https://your-app.com") -> str:
    """
    Generate QR code for a POI and upload to Google Cloud Storage.
    Returns the public URL of the uploaded QR code image.
    """
    try:
        # Create the URL that the QR code will point to
        poi_url = f"{base_url}/tours/{tour_id}/poi/{poi_id}"

        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(poi_url)
        qr.make(fit=True)

        # Create QR code image
        qr_image = qr.make_image(fill_color="black", back_color="white")

        # Convert to bytes
        img_buffer = BytesIO()
        qr_image.save(img_buffer, format='PNG')
        img_buffer.seek(0)

        # Upload to Google Cloud Storage
        client = storage.Client(project=settings.google_cloud_project)
        bucket = client.bucket(settings.google_cloud_storage_bucket)

        # Create blob name
        blob_name = f"qr_codes/{tour_id}/{poi_id}.png"
        blob = bucket.blob(blob_name)

        # Upload the file
        blob.upload_from_file(img_buffer, content_type='image/png')

        # Make the blob publicly readable
        blob.make_public()

        # Return the public URL
        return blob.public_url

    except Exception as e:
        logger.error(f"Error generating QR code for POI {poi_id}: {str(e)}")
        return None