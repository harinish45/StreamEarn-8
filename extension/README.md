# StreamEarn Browser Bridge

This is a real Chrome/Edge Manifest V3 extension for the personal StreamEarn workspace.

## Install locally

1. Open Chrome or Edge extension management.
2. Enable Developer mode.
3. Choose **Load unpacked**.
4. Select this `extension` folder.
5. Keep the StreamEarn website open at `https://streamearn-ai.onrender.com`.

## Capabilities

- Read the active tab metadata.
- Navigate a selected tab to a validated URL.
- Extract the visible page text and links from the selected tab.
- Communicate through the extension runtime rather than an iframe.

The extension intentionally does not silently submit forms, purchase items, send messages, or perform destructive actions. Those actions require a future explicit approval flow.
