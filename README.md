# AI Marketplace + Reverse Lead Generation

A modern marketplace platform that reverses the traditional buying process. Buyers post their needs (RFPs), and AI matches them with verified sellers who respond with offers. Features include escrow protection, group buying, AI concierge, and privacy-first design.

## 🚀 Features

### Core Functionality

- **Reverse Lead Generation**: Buyers post RFPs, sellers get AI-matched leads
- **AI Concierge**: Chat-based assistance for needs analysis and comparison
- **Escrow Protection**: Secure payment handling with dispute resolution
- **Group Buying**: Create buying pools to unlock bulk discounts
- **Privacy Mode**: Toggle for anonymous interactions until escrow

### AI-Powered Features

- **RFP Normalization**: AI converts free-text needs into structured specifications
- **Smart Matching**: AI ranks sellers by fit, price, SLA, and proximity
- **Negotiation Assistant**: AI suggests fair counteroffers and bundles
- **Content Generation**: AI creates product titles, descriptions, and SEO content
- **Risk Assessment**: AI scans for policy violations and authenticity issues

### Trust & Safety

- **Authenticity Checks**: AI + policy rules for quality verification
- **Reputation System**: Seller scoring with delivery and ETA accuracy
- **Dispute Center**: Built-in conflict resolution with SLA timers
- **Price Intelligence**: Market insights and price drop alerts

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + ShadCN
- **Backend**: FastAPI + Python + PostgreSQL + Redis
- **Real-time**: Phoenix Channels (WebSocket)
- **AI**: OpenAI GPT-4 + Custom prompts
- **Payments**: Stripe (cards + ACH + escrow)
- **Storage**: DigitalOcean Spaces
- **Hosting**: DigitalOcean App Platform

### Monorepo Structure

```
Market/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # FastAPI backend
│   └── phoenix/      # Phoenix Channels (WebSocket)
├── packages/
│   ├── ui/           # Shared UI components
│   └── types/        # Shared TypeScript types
├── assets/           # Images, icons, favicons
└── docs/             # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- OpenAI API key

### Local Development

1. **Clone and setup**

```bash
git clone <your-repo>
cd Market
cp env.example .env
# Edit .env with your API keys, especially OPENAI_API_KEY
```

2. **Install dependencies**

```bash
npm install
cd apps/api && pip install -r requirements.txt
```

3. **Start with Docker (Recommended)**

```bash
# Build and start all services
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

4. **Or start individually**

```bash
# Terminal 1: Database & Redis
docker-compose up postgres redis

# Terminal 2: Backend API
cd apps/api && python main.py

# Terminal 3: Frontend
cd apps/web && npm run dev
```

5. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### DigitalOcean Deployment

1. **Create App Platform app**

```bash
# Using DigitalOcean CLI
doctl apps create --spec .do/app.yaml
```

2. **Set environment variables**

```bash
# In DigitalOcean dashboard or CLI
doctl apps update <app-id> --set-env-vars JWT_SECRET=your-secret
doctl apps update <app-id> --set-env-vars OPENAI_API_KEY=your-key
# ... set other required env vars
```

3. **Deploy**

```bash
git push origin main
# App Platform will auto-deploy
```

## 📊 Data Model

### Core Entities

- **Users**: Buyers, sellers, admins with RBAC
- **Organizations**: Multi-tenant support
- **RFPs**: Buyer requests with AI-normalized specs
- **Offers**: Seller responses with pricing
- **Products**: Seller catalog items
- **Orders**: Transactions with escrow
- **Pools**: Group buying campaigns
- **Reputation**: Trust metrics and scores

### Key Relationships

```
User (buyer) → RFP → Offer (seller) → Order
User (seller) → Product → Order
Pool → Product → PoolMembers
User → ReputationMetric
```

## 🔌 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/me` - Current user info

### RFPs

- `GET /api/v1/rfps` - List RFPs with filters
- `POST /api/v1/rfps` - Create new RFP
- `GET /api/v1/rfps/{id}` - Get RFP details
- `PUT /api/v1/rfps/{id}` - Update RFP
- `POST /api/v1/rfps/{id}/offers` - Submit offer

### Marketplace

- `GET /api/v1/products` - Search products
- `POST /api/v1/products` - Create product
- `GET /api/v1/products/{id}` - Product details

### Orders & Payments

- `POST /api/v1/checkout` - Create payment intent
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/{id}` - Order status

### Group Buying

- `GET /api/v1/pools` - List active pools
- `POST /api/v1/pools` - Create pool
- `POST /api/v1/pools/{id}/join` - Join pool

## 🤖 AI Prompts

### RFP Normalization

```
Convert this buyer request into structured specifications:
"{buyer_request}"

Output JSON with fields:
- category
- specifications
- constraints
- budget_range
- timeline
- location_preferences
```

### Seller Matching

```
Rank these sellers for RFP "{rfp_title}":
{seller_list}

Consider:
- Specification match (0-100%)
- Price competitiveness
- Delivery SLA
- Geographic proximity
- Reputation score
```

### Negotiation Assistant

```
Generate a fair counteroffer for:
Buyer offer: ${price}
Seller original: ${original_price}
Market average: ${market_price}

Consider:
- Quality differences
- Volume discounts
- Payment terms
- Delivery timeline
```

## 🔒 Security & Privacy

### Authentication

- JWT tokens with refresh
- Role-based access control
- Multi-factor authentication (optional)

### Data Protection

- End-to-end encryption for sensitive data
- Privacy mode for anonymous interactions
- GDPR-compliant data handling
- Regular security audits

### Payment Security

- Stripe PCI compliance
- Escrow protection
- Dispute resolution system
- Fraud detection

## 📈 Analytics & Monitoring

### Key Metrics

- **Conversion Rate**: RFP → Offer → Order
- **GMV**: Gross Merchandise Value
- **Seller Win Rate**: Offers accepted
- **Delivery Performance**: On-time delivery %
- **Customer Satisfaction**: Ratings and reviews

### Monitoring

- Application performance (APM)
- Database query optimization
- AI model accuracy tracking
- Payment success rates
- User engagement metrics

## 🧪 Testing

### Test Coverage

```bash
# Frontend tests
cd apps/web && npm run test

# Backend tests
cd apps/api && npm run test

# E2E tests
npm run test:e2e
```

### Test Data

```bash
# Seed database with demo data
npm run seed

# Creates:
# - 3 buyers, 10 sellers
# - 25 RFPs, 60 offers
# - 100 products
# - Sample orders and reviews
```

## 🚀 Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] CDN configured for assets
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented
- [ ] Security audit completed

### Scaling Considerations

- **Horizontal scaling**: Multiple API instances
- **Database**: Read replicas for queries
- **Caching**: Redis for session and data
- **CDN**: DigitalOcean Spaces for assets
- **Load balancing**: App Platform handles

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use conventional commits
- Write tests for new features
- Update documentation
- Follow code style guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **API Reference**: `/docs` (Swagger UI)
- **Issues**: [GitHub Issues](https://github.com/your-username/ai-marketplace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/ai-marketplace/discussions)

## 🎯 Roadmap

### Phase 1 (MVP) ✅

- [x] Basic RFP/Offer flow
- [x] User authentication
- [x] Simple marketplace
- [x] Escrow payments

### Phase 2 (Q2 2024)

- [ ] AI Concierge enhancement
- [ ] Advanced matching algorithms
- [ ] Mobile app
- [ ] Multi-language support

### Phase 3 (Q3 2024)

- [ ] AR try-on features
- [ ] Voice interface (Whisper + TTS)
- [ ] Social commerce integration
- [ ] Advanced analytics dashboard

---

Built with ❤️ using modern web technologies and AI
