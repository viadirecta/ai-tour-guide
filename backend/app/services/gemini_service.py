import google.generativeai as genai
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Configure Gemini API
genai.configure(api_key=settings.gemini_api_key)

def enhance_poi_description(
    title: str,
    raw_description: str,
    city: str,
    country: str,
    category: str
) -> str:
    """
    Use Gemini to enhance a Point of Interest description for tourists.
    """
    try:
        model = genai.GenerativeModel('gemini-pro')

        prompt = f"""
        You are a knowledgeable tour guide creating engaging content for tourists.

        Please enhance this Point of Interest (POI) description:

        POI Title: {title}
        Location: {city}, {country}
        Category: {category}

        Original Description:
        {raw_description}

        Please provide an enhanced, engaging description that:
        1. Is informative and tourist-friendly
        2. Includes historical context if relevant
        3. Highlights what makes this place special
        4. Maintains accuracy (don't add false information)
        5. Is between 150-300 words
        6. Uses engaging language suitable for tourists

        Enhanced Description:
        """

        response = model.generate_content(prompt)

        if response and response.text:
            return response.text.strip()
        else:
            logger.warning(f"Gemini returned empty response for POI: {title}")
            return raw_description

    except Exception as e:
        logger.error(f"Error calling Gemini API for POI {title}: {str(e)}")
        # Return original description if AI enhancement fails
        return raw_description