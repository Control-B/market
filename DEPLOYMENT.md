# 🚀 AI Marketplace Deployment Guide

This guide will help you deploy your AI Marketplace to DigitalOcean App Platform.

## Prerequisites

1. **DigitalOcean Account**: Sign up at [digitalocean.com](https://digitalocean.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **API Keys**: You'll need the following API keys:
   - OpenAI API Key: [Get one here](https://platform.openai.com/api-keys)
   - Stripe Keys: [Get them here](https://dashboard.stripe.com/apikeys)

## Step 1: Prepare Your Environment

1. **Clone and setup your repository**:

   ```bash
   git clone https://github.com/your-username/ai-marketplace.git
   cd ai-marketplace
   ```

2. **Create environment file**:

   ```bash
   cp env.example .env
   ```

3. **Edit .env with your API keys**:

   ```bash
   # Required keys
   OPENAI_API_KEY=sk-your-openai-api-key
   SECRET_KEY=your-super-secret-jwt-key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

   # Optional keys
   DO_SPACES_KEY=your_spaces_key
   DO_SPACES_SECRET=your_spaces_secret
   DO_SPACES_BUCKET=your-bucket-name
   ```

## Step 2: Install DigitalOcean CLI

1. **Install doctl**:

   ```bash
   # macOS
   brew install doctl

   # Linux
   snap install doctl

   # Windows
   # Download from: https://github.com/digitalocean/doctl/releases
   ```

2. **Authenticate with DigitalOcean**:
   ```bash
   doctl auth init
   # Follow the prompts to authenticate
   ```

## Step 3: Deploy to DigitalOcean

### Option A: Automated Deployment (Recommended)

1. **Make the deployment script executable**:

   ```bash
   chmod +x deploy.sh
   ```

2. **Run the deployment script**:

   ```bash
   ./deploy.sh
   ```

3. **Follow the prompts**:
   - Enter your GitHub username
   - Enter your repository name
   - The script will handle the rest!

### Option B: Manual Deployment

1. **Update the app.yaml file**:

   ```yaml
   # In .do/app.yaml, replace:
   github:
     repo: your-username/ai-marketplace
   ```

2. **Create the app**:

   ```bash
   doctl apps create --spec .do/app.yaml
   ```

3. **Set environment variables**:

   ```bash
   # Get your app ID
   doctl apps list

   # Set environment variables
   doctl apps update YOUR_APP_ID --set-env-vars OPENAI_API_KEY="your-key"
   doctl apps update YOUR_APP_ID --set-env-vars SECRET_KEY="your-secret"
   doctl apps update YOUR_APP_ID --set-env-vars STRIPE_SECRET_KEY="your-stripe-key"
   doctl apps update YOUR_APP_ID --set-env-vars STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
   ```

4. **Deploy**:
   ```bash
   doctl apps create-deployment YOUR_APP_ID
   ```

## Step 4: Configure GitHub Actions (Optional)

For automatic deployments on every push to main:

1. **Add secrets to your GitHub repository**:

   - Go to your repo → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `DIGITALOCEAN_ACCESS_TOKEN`: Your DigitalOcean API token
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `SECRET_KEY`: Your JWT secret key
     - `STRIPE_SECRET_KEY`: Your Stripe secret key
     - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

## Step 5: Verify Deployment

1. **Check app status**:

   ```bash
   doctl apps list
   ```

2. **View logs**:

   ```bash
   doctl apps logs YOUR_APP_ID
   ```

3. **Access your app**:
   - Frontend: `https://YOUR_APP_ID.ondigitalocean.app`
   - API: `https://YOUR_APP_ID.ondigitalocean.app/api`
   - API Docs: `https://YOUR_APP_ID.ondigitalocean.app/api/docs`

## Step 6: Custom Domain (Optional)

1. **Add a custom domain**:

   ```bash
   doctl apps update YOUR_APP_ID --set-env-vars DOMAIN="your-domain.com"
   ```

2. **Configure DNS**:
   - Add a CNAME record pointing to `YOUR_APP_ID.ondigitalocean.app`

## Troubleshooting

### Common Issues

1. **Build fails**:

   ```bash
   # Check build logs
   doctl apps logs YOUR_APP_ID

   # Common fixes:
   # - Ensure all environment variables are set
   # - Check that your GitHub repo is public or you have proper access
   ```

2. **Database connection issues**:

   ```bash
   # Check database status
   doctl databases list

   # Verify DATABASE_URL is correct
   doctl apps get YOUR_APP_ID
   ```

3. **API not responding**:

   ```bash
   # Check health endpoint
   curl https://YOUR_APP_ID.ondigitalocean.app/api/health

   # Check logs
   doctl apps logs YOUR_APP_ID
   ```

### Useful Commands

```bash
# List all apps
doctl apps list

# Get app details
doctl apps get YOUR_APP_ID

# View logs
doctl apps logs YOUR_APP_ID

# Scale app
doctl apps update YOUR_APP_ID --size basic-s

# Update environment variables
doctl apps update YOUR_APP_ID --set-env-vars KEY="value"

# Delete app
doctl apps delete YOUR_APP_ID
```

## Cost Estimation

For a small instance:

- **App Platform**: ~$5-10/month
- **Database**: ~$15/month
- **Total**: ~$20-25/month

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to your repository
2. **HTTPS**: DigitalOcean automatically provides SSL certificates
3. **Database**: Use the managed PostgreSQL database for better security
4. **API Keys**: Rotate your API keys regularly

## Monitoring

1. **Set up alerts**:

   ```bash
   # Create alert policy for high CPU usage
   doctl monitoring alert create --name "High CPU" --type "v1/insights/droplet/cpu" --value 80 --compare "GreaterThan" --window "5m"
   ```

2. **View metrics**:
   - Go to your DigitalOcean dashboard
   - Navigate to your app
   - Check the "Metrics" tab

## Support

If you encounter issues:

1. Check the [DigitalOcean App Platform documentation](https://docs.digitalocean.com/products/app-platform/)
2. Review the [GitHub Issues](https://github.com/your-username/ai-marketplace/issues)
3. Check the application logs: `doctl apps logs YOUR_APP_ID`

---

🎉 **Congratulations!** Your AI Marketplace is now live on DigitalOcean!
