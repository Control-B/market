import openai
import json
from typing import Dict, Any, List
from app.core.config import settings

# Initialize OpenAI client
openai.api_key = settings.OPENAI_API_KEY

async def normalize_rfp_requirements(description: str) -> Dict[str, Any]:
    """Use AI to normalize RFP requirements into structured format"""
    
    prompt = f"""
    Convert this buyer request into structured specifications:
    "{description}"

    Output JSON with fields:
    - category: The main category (e.g., "software", "consulting", "hardware")
    - specifications: List of specific requirements
    - constraints: Any constraints or limitations
    - budget_range: Estimated budget range
    - timeline: Expected timeline
    - location_preferences: Geographic preferences
    - technical_requirements: Technical specifications if applicable
    - quality_standards: Quality or certification requirements
    """
    
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert at analyzing business requirements and converting them into structured specifications."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )
        
        # Parse the JSON response
        content = response.choices[0].message.content
        # Extract JSON from the response (in case it's wrapped in markdown)
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1]
        
        return json.loads(content.strip())
    
    except Exception as e:
        # Fallback to basic structure if AI fails
        return {
            "category": "general",
            "specifications": [description],
            "constraints": [],
            "budget_range": "not_specified",
            "timeline": "not_specified",
            "location_preferences": [],
            "technical_requirements": [],
            "quality_standards": []
        }

async def match_sellers_to_rfp(rfp_data: Dict[str, Any], sellers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Rank sellers based on RFP requirements"""
    
    seller_list = "\n".join([
        f"- {seller['name']}: {seller['specialties']} | Rating: {seller['rating']} | Location: {seller['location']}"
        for seller in sellers
    ])
    
    prompt = f"""
    Rank these sellers for RFP "{rfp_data['title']}":
    {seller_list}

    Consider:
    - Specification match (0-100%)
    - Price competitiveness
    - Delivery SLA
    - Geographic proximity
    - Reputation score

    Output JSON array with seller IDs and match scores:
    [{{"seller_id": "id", "match_score": 85, "reasoning": "explanation"}}]
    """
    
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert at matching buyers with the best suppliers based on requirements and capabilities."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=800
        )
        
        content = response.choices[0].message.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1]
        
        return json.loads(content.strip())
    
    except Exception as e:
        # Fallback to simple ranking
        return [
            {"seller_id": seller["id"], "match_score": 50, "reasoning": "Default ranking"}
            for seller in sellers
        ]

async def generate_rfp_summary(rfp_data: Dict[str, Any]) -> str:
    """Generate a concise summary of the RFP"""
    
    prompt = f"""
    Create a concise summary of this RFP:
    Title: {rfp_data['title']}
    Description: {rfp_data['description']}
    Category: {rfp_data['category']}
    Budget: ${rfp_data.get('budget_min', 'N/A')} - ${rfp_data.get('budget_max', 'N/A')}
    Deadline: {rfp_data['deadline']}
    
    Generate a 2-3 sentence summary that highlights the key requirements and constraints.
    """
    
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert at summarizing business requirements concisely."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=200
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        return f"RFP for {rfp_data['category']} services with budget range ${rfp_data.get('budget_min', 'N/A')} - ${rfp_data.get('budget_max', 'N/A')}"

async def suggest_counteroffer(buyer_offer: float, seller_original: float, market_average: float) -> Dict[str, Any]:
    """Generate a fair counteroffer suggestion"""
    
    prompt = f"""
    Generate a fair counteroffer for:
    Buyer offer: ${buyer_offer}
    Seller original: ${seller_original}
    Market average: ${market_average}

    Consider:
    - Quality differences
    - Volume discounts
    - Payment terms
    - Delivery timeline

    Output JSON with:
    - suggested_price: Recommended counteroffer
    - reasoning: Explanation for the suggestion
    - negotiation_tips: Tips for the negotiation
    """
    
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert negotiator who helps create fair and mutually beneficial deals."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=400
        )
        
        content = response.choices[0].message.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1]
        
        return json.loads(content.strip())
    
    except Exception as e:
        # Fallback calculation
        suggested_price = (buyer_offer + seller_original) / 2
        return {
            "suggested_price": suggested_price,
            "reasoning": "Midpoint between buyer offer and seller original",
            "negotiation_tips": ["Focus on value proposition", "Consider payment terms", "Discuss delivery timeline"]
        }
