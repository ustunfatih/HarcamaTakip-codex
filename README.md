<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1rK9c8wTZPJrTZ1PidHOtedAHy-yxcyaT

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create `.env` from `.env.example` and set `TOKEN_ENC_KEY`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Start the token server:
   `npm run dev:server`
4. Run the app:
   `npm run dev`

## MCP Setup (GitHub)

This workspace uses a GitHub MCP server configuration at `/Volumes/Mini/XCode/mcp.json`.

Create `/Volumes/Mini/XCode/.env` with:

```
GITHUB_TOKEN=github_pat_...
```

Load that environment when starting your MCP runner (for example, `set -a; source .env; <run-command>`),
or configure your runner to load `.env` automatically.
