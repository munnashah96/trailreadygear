
### `deploy.md` – Deployment Instructions

```markdown
# Deployment Guide

## Option 1: Deploy to Vercel (Recommended)
1. Push code to GitHub repository
2. Visit vercel.com and import your repo
3. Add environment variables:
   - `SUPABASE_URL`: your-project-url
   - `SUPABASE_SERVICE_ROLE_KEY`: your-service-role-key
   - `RESEND_API_KEY`: your-resend-api-key
   - `RESEND_AUDIENCE_ID`: your-resend-audience-id
4. Deploy!

## Supabase Setup
1. Create new project at supabase.com
2. Run the SQL schema from `schema.sql`
3. Get your API keys from Project Settings > API

## Post-Launch Checklist
- [ ] Submit sitemap to Google Search Console
- [ ] Add Google Analytics
- [ ] Set up email automation
- [ ] Test all forms and tracking