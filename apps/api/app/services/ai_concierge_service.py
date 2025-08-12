import openai
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.core.config import settings

# Initialize OpenAI client
openai.api_key = settings.OPENAI_API_KEY

class AIConciergeService:
    def __init__(self):
        self.conversation_history = {}
    
    async def process_message(
        self, 
        user_id: str, 
        message: str, 
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Process a user message and return AI response with suggestions"""
        
        # Get conversation history
        history = self.conversation_history.get(user_id, [])
        
        # Build context for AI
        system_prompt = self._build_system_prompt(context)
        user_prompt = self._build_user_prompt(message, history)
        
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    *history,
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            ai_response = response.choices[0].message.content
            
            # Generate suggestions based on the response
            suggestions = await self._generate_suggestions(message, ai_response, context)
            
            # Update conversation history
            history.append({"role": "user", "content": message})
            history.append({"role": "assistant", "content": ai_response})
            
            # Keep only last 10 messages to manage context length
            if len(history) > 10:
                history = history[-10:]
            
            self.conversation_history[user_id] = history
            
            return {
                "content": ai_response,
                "type": "text",
                "suggestions": suggestions,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {
                "content": "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
                "type": "text",
                "suggestions": ["Try again", "Contact support"],
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def _build_system_prompt(self, context: Optional[Dict[str, Any]] = None) -> str:
        """Build the system prompt for the AI concierge"""
        
        base_prompt = """You are an AI Concierge for an AI-powered marketplace platform. Your role is to help users with:

1. **RFP Creation**: Help buyers write clear, detailed RFPs (Request for Proposals)
2. **Offer Analysis**: Analyze and compare offers from sellers
3. **Market Research**: Provide insights about market trends and pricing
4. **Negotiation**: Offer advice for both buyers and sellers
5. **Platform Guidance**: Help users navigate the marketplace features

Key capabilities:
- You can access user's RFPs, offers, and order history
- You provide actionable advice with specific examples
- You suggest relevant marketplace features
- You maintain a helpful, professional tone

Always provide practical, actionable advice and suggest next steps."""
        
        if context:
            if context.get("user_role"):
                base_prompt += f"\n\nCurrent user is a {context['user_role']}."
            if context.get("active_rfp"):
                base_prompt += f"\n\nUser is currently working on RFP: {context['active_rfp']['title']}"
            if context.get("recent_orders"):
                base_prompt += f"\n\nUser has {len(context['recent_orders'])} recent orders."
        
        return base_prompt
    
    def _build_user_prompt(self, message: str, history: List[Dict[str, str]]) -> str:
        """Build the user prompt with context"""
        
        # Add context about the user's intent
        intent_context = self._analyze_intent(message)
        
        prompt = f"""
User message: "{message}"

User intent: {intent_context}

Please provide a helpful response with:
1. Direct answer to their question
2. Specific examples or templates if relevant
3. Suggested next actions
4. Relevant marketplace features they might want to use

Keep the response conversational and actionable."""
        
        return prompt
    
    def _analyze_intent(self, message: str) -> str:
        """Analyze user intent from message"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["rfp", "request", "proposal", "write", "create"]):
            return "RFP creation or improvement"
        elif any(word in message_lower for word in ["offer", "analyze", "compare", "price", "quote"]):
            return "Offer analysis or comparison"
        elif any(word in message_lower for word in ["market", "research", "trend", "price", "benchmark"]):
            return "Market research or insights"
        elif any(word in message_lower for word in ["negotiate", "negotiation", "deal", "counteroffer"]):
            return "Negotiation advice"
        elif any(word in message_lower for word in ["help", "how", "what", "guide"]):
            return "General platform guidance"
        else:
            return "General inquiry"
    
    async def _generate_suggestions(
        self, 
        user_message: str, 
        ai_response: str, 
        context: Optional[Dict[str, Any]] = None
    ) -> List[str]:
        """Generate contextual suggestions based on the conversation"""
        
        message_lower = user_message.lower()
        suggestions = []
        
        # RFP-related suggestions
        if any(word in message_lower for word in ["rfp", "request", "proposal"]):
            suggestions.extend([
                "Help me write the description",
                "What should I include in requirements?",
                "How do I set a good budget?",
                "Show me an RFP template"
            ])
        
        # Offer-related suggestions
        elif any(word in message_lower for word in ["offer", "analyze", "compare"]):
            suggestions.extend([
                "Analyze this specific offer",
                "Compare multiple offers",
                "Negotiation tips",
                "Red flags to watch for"
            ])
        
        # Market research suggestions
        elif any(word in message_lower for word in ["market", "research", "trend"]):
            suggestions.extend([
                "Industry-specific data",
                "Competitor analysis",
                "Pricing benchmarks",
                "Regional insights"
            ])
        
        # Negotiation suggestions
        elif any(word in message_lower for word in ["negotiate", "deal", "price"]):
            suggestions.extend([
                "Buyer negotiation tips",
                "Seller negotiation tips",
                "Contract terms advice",
                "Payment negotiation"
            ])
        
        # Default suggestions
        else:
            suggestions.extend([
                "Help me write an RFP",
                "Analyze an offer",
                "Market research",
                "Negotiation advice"
            ])
        
        # Add context-specific suggestions
        if context:
            if context.get("user_role") == "buyer":
                suggestions.extend([
                    "Browse seller profiles",
                    "Create a new RFP",
                    "View my active RFPs"
                ])
            elif context.get("user_role") == "seller":
                suggestions.extend([
                    "Browse active RFPs",
                    "Update my profile",
                    "View my offers"
                ])
        
        return suggestions[:4]  # Limit to 4 suggestions
    
    async def get_rfp_template(self, category: str) -> Dict[str, Any]:
        """Get a template RFP for a specific category"""
        
        templates = {
            "software": {
                "title": "Software Development Project",
                "description": "We are seeking a software development team to build a custom web application...",
                "requirements": [
                    "Frontend development (React/Next.js)",
                    "Backend API development (Node.js/Python)",
                    "Database design and implementation",
                    "Testing and quality assurance",
                    "Deployment and hosting setup"
                ],
                "budget_range": "$10,000 - $50,000",
                "timeline": "3-6 months"
            },
            "consulting": {
                "title": "Business Consulting Services",
                "description": "We need expert consulting services to help optimize our business processes...",
                "requirements": [
                    "Business process analysis",
                    "Strategy development",
                    "Implementation planning",
                    "Change management support",
                    "Performance monitoring"
                ],
                "budget_range": "$5,000 - $25,000",
                "timeline": "2-4 months"
            },
            "marketing": {
                "title": "Digital Marketing Campaign",
                "description": "We're looking for a digital marketing agency to launch a comprehensive campaign...",
                "requirements": [
                    "Social media marketing",
                    "Content creation",
                    "SEO optimization",
                    "Paid advertising (Google Ads, Facebook)",
                    "Analytics and reporting"
                ],
                "budget_range": "$3,000 - $15,000",
                "timeline": "3-6 months"
            }
        }
        
        return templates.get(category, templates["consulting"])
    
    async def analyze_offer(self, offer_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze an offer and provide insights"""
        
        analysis = {
            "price_analysis": {
                "market_position": "competitive",  # competitive, high, low
                "value_score": 75,  # 0-100
                "price_breakdown": "reasonable"
            },
            "seller_analysis": {
                "reputation_score": offer_data.get("seller_rating", 0),
                "response_time": "24 hours",
                "completion_rate": "95%"
            },
            "risk_assessment": {
                "overall_risk": "low",
                "concerns": [],
                "recommendations": []
            },
            "recommendations": [
                "Consider requesting a detailed project timeline",
                "Ask for references from similar projects",
                "Negotiate payment terms (e.g., milestone payments)"
            ]
        }
        
        return analysis
    
    def clear_conversation_history(self, user_id: str):
        """Clear conversation history for a user"""
        if user_id in self.conversation_history:
            del self.conversation_history[user_id]

# Global instance
ai_concierge = AIConciergeService()
