# Custom Zeplin Webhook for Discord

This is a Cloudflare Workers project that takes a Zeplin webhook request, and processes it into a Discord webhook request. 

I've taken references from [birdie0's discord webhook guide](https://birdie0.github.io/discord-webhooks-guide/) and [the Zeplin API Documentation](https://docs.zeplin.dev/reference#introduction) to generate the required types for both discord webhooks and zeplin webhooks. 

## Deploying to Cloudflare Workers

Run `wrangler publish` in the repo after setting up wrangler.toml.
