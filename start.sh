#!/bin/bash

# AI Marketplace Startup Script
echo "🚀 Starting AI Marketplace..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your API keys before continuing"
    echo "   Required keys: OPENAI_API_KEY, JWT_SECRET, DATABASE_URL"
    read -p "Press Enter after updating .env file..."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
cd apps/api
pip install -r requirements.txt
cd ../..

# Create database tables
echo "🗄️  Setting up database..."
cd apps/api
python -c "
from app.core.database import engine, Base
from app.models import user, organization, rfp, offer, order, product, pool, reputation, rfp_file, rfp_thread, dispute
Base.metadata.create_all(bind=engine)
print('Database tables created successfully!')
"
cd ../..

# Start services
echo "🔄 Starting services..."

# Start database and Redis
echo "📊 Starting PostgreSQL and Redis..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Start backend API
echo "🔧 Starting FastAPI backend..."
cd apps/api
python main.py &
API_PID=$!
cd ../..

# Start frontend
echo "🎨 Starting Next.js frontend..."
cd apps/web
npm run dev &
WEB_PID=$!
cd ../..

echo "✅ AI Marketplace is starting up!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "🤖 AI Features:"
echo "   - AI Concierge: Chat-based assistance"
echo "   - RFP Normalization: AI-powered requirement analysis"
echo "   - Smart Matching: AI seller recommendations"
echo "   - Offer Analysis: AI-powered insights"
echo ""
echo "💡 Quick Start:"
echo "   1. Open http://localhost:3000"
echo "   2. Click 'AI Concierge' for assistance"
echo "   3. Create your first RFP"
echo "   4. Browse and respond to RFPs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait $API_PID $WEB_PID

# Cleanup
echo "🧹 Cleaning up..."
kill $API_PID $WEB_PID 2>/dev/null
docker-compose down
echo "👋 AI Marketplace stopped"
