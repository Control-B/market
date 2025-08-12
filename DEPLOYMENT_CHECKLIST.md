# 🚀 Quick Deployment Checklist

## Before You Start

- [ ] **DigitalOcean Account**: Sign up at [digitalocean.com](https://digitalocean.com)
- [ ] **GitHub Repository**: Push your code to GitHub
- [ ] **API Keys Ready**:
  - [ ] OpenAI API Key
  - [ ] Stripe Keys (test keys are fine for now)
  - [ ] Generate a secure JWT secret: `openssl rand -hex 32`

## Step-by-Step Deployment

### 1. Local Setup

```bash
# Clone your repo (if not already done)
git clone https://github.com/your-username/ai-marketplace.git
cd ai-marketplace

# Setup environment
cp env.example .env
# Edit .env with your API keys
```

### 2. Install DigitalOcean CLI

```bash
# macOS
brew install doctl

# Linux
snap install doctl

# Authenticate
doctl auth init
```

### 3. Deploy

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh

# Follow prompts:
# - Enter GitHub username
# - Enter repository name
```

### 4. Verify

- [ ] App is created successfully
- [ ] Environment variables are set
- [ ] Deployment completes without errors
- [ ] Frontend loads at: `https://YOUR_APP_ID.ondigitalocean.app`
- [ ] API responds at: `https://YOUR_APP_ID.ondigitalocean.app/api/health`

## Quick Commands

```bash
# Check app status
doctl apps list

# View logs
doctl apps logs YOUR_APP_ID

# Get app details
doctl apps get YOUR_APP_ID

# Update environment variables
doctl apps update YOUR_APP_ID --set-env-vars KEY="value"
```

## Troubleshooting

### If deployment fails:

1. Check logs: `doctl apps logs YOUR_APP_ID`
2. Verify environment variables are set
3. Ensure GitHub repo is accessible
4. Check that all API keys are valid

### If app doesn't load:

1. Check health endpoint: `curl https://YOUR_APP_ID.ondigitalocean.app/api/health`
2. Verify database connection
3. Check frontend build logs

## Expected URLs

After successful deployment:

- **Frontend**: `https://YOUR_APP_ID.ondigitalocean.app`
- **API**: `https://YOUR_APP_ID.ondigitalocean.app/api`
- **API Docs**: `https://YOUR_APP_ID.ondigitalocean.app/api/docs`

## Cost Estimate

- **Small instance**: ~$20-25/month
- **Includes**: App Platform + Database

---

🎉 **Ready to deploy?** Run `./deploy.sh` and follow the prompts!
