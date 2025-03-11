# Deploying to Netlify

Follow these steps to deploy your Korean Character Flashcard Application to Netlify:

## 1. Create a netlify.toml file

Create a file named `netlify.toml` in the root of your project with the following content:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 2. Push your code to GitHub

If your code is not already on GitHub:

1. Create a new repository on GitHub
2. Initialize Git in your project (if not already done):
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Add your GitHub repository as a remote and push:
   ```
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

## 3. Deploy to Netlify

### Option 1: Deploy via Netlify UI

1. Go to [Netlify](https://app.netlify.com/) and sign in (or create an account)
2. Click "Add new site" > "Import an existing project"
3. Connect to your GitHub account and select your repository
4. In the deploy settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install the Netlify CLI:
   ```
   npm install -g netlify-cli
   ```
2. Login to Netlify:
   ```
   netlify login
   ```
3. Initialize and deploy your site:
   ```
   netlify init
   netlify deploy --prod
   ```

## 4. Configure Domain (Optional)

1. In the Netlify dashboard, go to your site settings
2. Under "Domain management", you can:
   - Use the free Netlify subdomain (yoursite.netlify.app)
   - Set up a custom domain you own

## 5. Environment Variables (If Needed)

If your app requires environment variables:

1. Go to Site settings > Build & deploy > Environment
2. Add your environment variables there

## Troubleshooting

- If you encounter build errors, check the build logs in the Netlify dashboard
- Make sure your application works locally with `npm run build && npm run preview`
- Ensure all dependencies are properly listed in package.json
