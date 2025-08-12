#!/bin/bash

# AI Marketplace Deployment Script for DigitalOcean
echo "🚀 Deploying AI Marketplace to DigitalOcean..."

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ doctl CLI is not installed. Please install it first:"
    echo "   https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Check if user is authenticated
if ! doctl account get &> /dev/null; then
    echo "❌ Please authenticate with DigitalOcean first:"
    echo "   doctl auth init"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it from env.example first."
    exit 1
fi

# Check if required environment variables are set
echo "🔍 Checking environment variables..."
source .env

required_vars=("OPENAI_API_KEY" "SECRET_KEY" "STRIPE_SECRET_KEY" "STRIPE_PUBLISHABLE_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ] || [ "${!var}" = "your-${var,,}-here" ]; then
        echo "❌ Please set $var in your .env file"
        exit 1
    fi
done

echo "✅ Environment variables look good!"

# Set GitHub repository details
github_username="Control-B"
repo_name="market"

echo "📝 Using GitHub repository: $github_username/$repo_name"

# Update the app.yaml file
sed -i.bak "s/your-username\/ai-marketplace/$github_username\/$repo_name/g" .do/app.yaml

echo "✅ Updated app.yaml with repository: $github_username/$repo_name"

# Create the app
echo "🔧 Creating DigitalOcean App..."
doctl apps create --spec .do/app.yaml --wait

if [ $? -eq 0 ]; then
    echo "✅ App created successfully!"
    
    # Get the app ID
    app_id=$(doctl apps list --format ID,Spec.Name --no-header | grep ai-marketplace | awk '{print $1}')
    
    if [ -n "$app_id" ]; then
        echo "📊 App ID: $app_id"
        echo "🌐 Your app will be available at:"
        echo "   https://$app_id.ondigitalocean.app"
        
        # Set environment variables
        echo "🔐 Setting environment variables..."
        doctl apps update $app_id --set-env-vars OPENAI_API_KEY="$OPENAI_API_KEY"
        doctl apps update $app_id --set-env-vars SECRET_KEY="$SECRET_KEY"
        doctl apps update $app_id --set-env-vars STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY"
        doctl apps update $app_id --set-env-vars STRIPE_PUBLISHABLE_KEY="$STRIPE_PUBLISHABLE_KEY"
        
        echo "✅ Environment variables set!"
        
        # Deploy
        echo "🚀 Deploying your app..."
        doctl apps create-deployment $app_id --wait
        
        if [ $? -eq 0 ]; then
            echo "🎉 Deployment successful!"
            echo ""
            echo "🌐 Your AI Marketplace is now live at:"
            echo "   https://$app_id.ondigitalocean.app"
            echo ""
            echo "📚 API Documentation:"
            echo "   https://$app_id.ondigitalocean.app/api/docs"
            echo ""
            echo "🔧 To manage your app:"
            echo "   doctl apps get $app_id"
            echo "   doctl apps list-deployments $app_id"
            echo "   doctl apps logs $app_id"
        else
            echo "❌ Deployment failed. Check the logs:"
            echo "   doctl apps logs $app_id"
        fi
    else
        echo "❌ Could not find app ID"
    fi
else
    echo "❌ Failed to create app"
fi

# Restore the original app.yaml
mv .do/app.yaml.bak .do/app.yaml
echo "✅ Restored app.yaml to original state"
