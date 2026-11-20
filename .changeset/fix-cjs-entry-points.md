---
"@paprize/react": patch
"@paprize/puppeteer": patch
---

Fix CommonJS entry points so `require("@paprize/react")` and `require("@paprize/puppeteer")` resolve correctly (fixes #46). Declare Node.js >=22.12.0 as the supported runtime for `@paprize/puppeteer`.
