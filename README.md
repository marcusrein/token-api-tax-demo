# Token API Demo (HTML + Node.js Proxy)

This is a simple demonstration of fetching data from various endpoints of The Graph's Token API (Staging Environment).

It uses plain HTML, CSS, and JavaScript for the frontend, and a simple Node.js/Express server acts as a local proxy to handle potential CORS issues when calling the API directly from the browser.

## Features

*   Select different Token API endpoints (Balances, Transfers, Metadata, Holders, Swaps, Pools, OHLC).
*   Select different EVM networks (Mainnet, Base, Polygon, Arbitrum, Optimism, BSC).
*   Uses network-specific example addresses where applicable (Wallet, Token Contract, Pool Contract).
*   Displays the raw JSON response from the API.

## Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm) installed.

## Getting Started

1.  **Clone the repository (or download the files).**
2.  **Navigate to the project directory:**
    ```bash
    cd path/to/tokenapi-demo
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the proxy server:**
    ```bash
    npm start
    ```
    This will start the server, typically on port 3001.

5.  **Open the demo in your browser:**
    Navigate to [http://localhost:3001](http://localhost:3001)

## How it Works

*   `index.html`: Provides the structure and UI elements.
*   `style.css`: Basic styling for the UI.
*   `script.js`: Handles UI interactions (dropdown changes, button clicks), fetches data via the local proxy, and displays the response.
*   `server.js`: A simple Express server that serves the static frontend files and includes a `/proxy` endpoint. The frontend sends API requests to `/proxy?url=<target_token_api_url>`, and the server forwards the request to the actual Token API, returning the response to the frontend.
*   `package.json`: Defines the Node.js dependencies (Express, node-fetch) and the `start` script. 