# Prompt Playground

What it does: Select a use case and tone → AI generates professional content instantly.

Live demo: https://talha-prompt-playground.netlify.app/

Built with: HTML · CSS · JavaScript · Gemini API · Netlify Functions

How it works:
- User selects use case (Social Media, Email, Product Description, Blog Intro)
- User selects tone (Formal, Casual, Persuasive)
- JS sends request to a Netlify serverless function
- Function calls Gemini API securely (API key never exposed to client)
- AI output rendered in the output div

Security note:
API key is stored as a Netlify environment variable, 
never in client-side code.

What I learned:
- Prompt engineering techniques (role prompting, tone control, output formatting)
- Securing API keys using Netlify serverless functions
- Deploying frontend projects with secure backends

Status: Live ✅ + Fiverr gig active