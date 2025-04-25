const endpointSelect = document.getElementById('endpointSelect');
const networkSelect = document.getElementById('networkSelect');
const addressInput = document.getElementById('addressInput');
const poolInput = document.getElementById('poolInput');
const contractInput = document.getElementById('contractInput');
const fetchButton = document.getElementById('fetchButton');
const responseArea = document.getElementById('responseArea');

// Input Group Divs
const addressInputGroup = document.getElementById('addressInputGroup');
const poolInputGroup = document.getElementById('poolInputGroup');
const contractInputGroup = document.getElementById('contractInputGroup');
const noInputHelper = document.getElementById('noInputHelper');

// Get description span elements
const addressDescription = document.getElementById('addressDescription');
const poolDescription = document.getElementById('poolDescription');
const contractDescription = document.getElementById('contractDescription');

// Get endpoint description element
const endpointDescription = document.getElementById('endpointDescription');

// --- Endpoint Descriptions Mapping ---
const ENDPOINT_DESCRIPTIONS = {
    balances: "Provides the latest token balances for a given wallet address.",
    historical_balances: "Provides daily historical token balances for a given wallet address.",
    transfers: "Provides recent token transfer events involving a given wallet address.",
    tokens: "Provides metadata (name, symbol, decimals, etc.) for a specific token contract.",
    holders: "Provides a list of addresses holding a specific token contract and their balances.",
    swaps: "Provides recent swap events across DEX pools (e.g., Uniswap V2/V3) on the selected network.",
    pools: "Provides metadata about DEX liquidity pools (e.g., Uniswap V2/V3) on the selected network.",
    ohlc_pool: "Provides price history (Open, High, Low, Close, Volume) for a specific DEX liquidity pool.",
    ohlc_contract: "Provides aggregate price history (Open, High, Low, Close, Volume) for a specific token contract."
};

// --- Define Network-Specific Example Addresses ---
const EXAMPLE_ADDRESSES = {
    mainnet: {
        wallet: { address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", description: "Vitalik Buterin's Wallet (Mainnet)" },
        pool:   { address: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640", description: "USDC/WETH 0.05% Pool (Uniswap V3 Mainnet)" },
        contract: { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", description: "Wrapped ETH (WETH) Token (Mainnet)" }
    },
    base: {
        wallet: { address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", description: "Vitalik Buterin's Wallet (Base)" },
        pool:   { address: "0x846043d3C7ECc7b4132Ea788f4EC9a1579584643", description: "USDC/WETH Pool (Aerodrome Base) - Example" },
        contract: { address: "0x4200000000000000000000000000000000000006", description: "Wrapped Ether (WETH) Token (Base)" }
    },
    matic: { // Polygon
        wallet: { address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", description: "Vitalik Buterin's Wallet (Polygon)" },
        pool:   { address: "0x853Ee4b2A13f8a742d64C8F088bE7bA2131f670d", description: "WMATIC/USDC Pool (QuickSwap Polygon) - Example" },
        contract: { address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", description: "Wrapped Matic (WMATIC) Token (Polygon)" }
    },
     arbitrum: { // Arbitrum One - NOTE: Network ID in dropdown is 'arbitrum-one'
        wallet: { address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", description: "Vitalik Buterin's Wallet (Arbitrum)" },
        pool:   { address: "0xC31E54c7a869B9FcBEcc14363CF510d1c41f4217", description: "WETH/USDC Pool (Uniswap V3 Arbitrum) - Example" },
        contract: { address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", description: "Wrapped Ether (WETH) Token (Arbitrum)" }
    },
    optimism: {
        wallet: { address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", description: "Vitalik Buterin's Wallet (Optimism)" },
        pool:   { address: "0x851492876999ceeA3Eb5418821556507488B0541", description: "WETH/USDC Pool (Uniswap V3 Optimism) - Example" },
        contract: { address: "0x4200000000000000000000000000000000000006", description: "Wrapped Ether (WETH) Token (Optimism)" }
    },
     bsc: { // BNB Smart Chain
        wallet: { address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", description: "Vitalik Buterin's Wallet (BSC)" },
        pool:   { address: "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16", description: "WBNB/BUSD Pool (PancakeSwap BSC) - Example" },
        contract: { address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", description: "Wrapped BNB (WBNB) Token (BSC)" }
    }
    // Add Unichain examples if known
};

const API_BASE_URL = "https://token-api.service.stage.pinax.network";

// --- Function to Update Inputs and Description ---
function updateInputs() {
    const selectedEndpoint = endpointSelect.value;
    let selectedNetwork = networkSelect.value;
    // Correct network key for arbitrum-one
    if (selectedNetwork === 'arbitrum-one') selectedNetwork = 'arbitrum';

    // Update Endpoint Description Text
    endpointDescription.textContent = ENDPOINT_DESCRIPTIONS[selectedEndpoint] || '';

    // Clear inputs/descriptions
    addressInput.value = ''; addressDescription.textContent = '';
    poolInput.value = '';    poolDescription.textContent = '';
    contractInput.value = ''; contractDescription.textContent = '';

    // Hide all optional inputs, descriptions, and helper text initially
    addressInputGroup.classList.add('hidden'); addressDescription.classList.add('hidden');
    poolInputGroup.classList.add('hidden');    poolDescription.classList.add('hidden');
    contractInputGroup.classList.add('hidden'); contractDescription.classList.add('hidden');
    noInputHelper.classList.add('hidden');

    let example;
    const networkExamples = EXAMPLE_ADDRESSES[selectedNetwork] || EXAMPLE_ADDRESSES.mainnet;

    // Set default values/descriptions based on endpoint
    switch (selectedEndpoint) {
        case 'balances':
        case 'transfers':
        case 'historical_balances':
            example = networkExamples.wallet;
            if (example) { // Check if example exists for this network
                addressInputGroup.classList.remove('hidden');
                addressInput.value = example.address;
                addressDescription.textContent = `(${example.description})`;
                addressDescription.classList.remove('hidden');
            } else {
                addressInputGroup.classList.remove('hidden');
            }
            break;
        case 'tokens':
        case 'holders':
        case 'ohlc_contract':
            example = networkExamples.contract;
             if (example) {
                contractInputGroup.classList.remove('hidden');
                contractInput.value = example.address;
                contractDescription.textContent = `(${example.description})`;
                contractDescription.classList.remove('hidden');
             } else {
                 contractInputGroup.classList.remove('hidden');
             }
            break;
        case 'ohlc_pool':
            example = networkExamples.pool;
            if (example) {
                poolInputGroup.classList.remove('hidden');
                poolInput.value = example.address;
                poolDescription.textContent = `(${example.description})`;
                poolDescription.classList.remove('hidden');
            } else {
                 poolInputGroup.classList.remove('hidden');
            }
            break;
        case 'swaps':
        case 'pools':
            noInputHelper.classList.remove('hidden');
            break;
    }
}

// --- Generic Fetch Function ---
async function fetchData(endpoint) {
    const localProxyUrl = `/proxy?url=${encodeURIComponent(endpoint)}`;

    const response = await fetch(localProxyUrl, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (parseError) {
             errorData = { detail: await response.text() };
        }
        console.error("API Error Response (via proxy):", errorData);
        throw new Error(`API request failed: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
    }

    const actualData = await response.json();
    return actualData;
}

// --- Button Click Handler ---
fetchButton.addEventListener('click', async () => {
    const selectedEndpoint = endpointSelect.value;
    const networkId = document.getElementById('networkSelect').value;
    let targetEndpoint = '';
    let errorMessage = null;

    responseArea.textContent = "Fetching...";
    fetchButton.disabled = true;

    try {
        const address = addressInput.value.trim();
        const pool = poolInput.value.trim();
        const contract = contractInput.value.trim();

        // Build the target endpoint URL based on selection
        switch (selectedEndpoint) {
            case 'balances':
                if (!/^0x[a-fA-F0-9]{40}$/.test(address)) errorMessage = "Invalid EVM Wallet Address format";
                else targetEndpoint = `${API_BASE_URL}/balances/evm/${address}?network_id=${networkId}`;
                break;
            case 'transfers':
                if (!/^0x[a-fA-F0-9]{40}$/.test(address)) errorMessage = "Invalid EVM Wallet Address format";
                else targetEndpoint = `${API_BASE_URL}/transfers/evm/${address}?network_id=${networkId}`;
                break;
            case 'historical_balances':
                if (!/^0x[a-fA-F0-9]{40}$/.test(address)) errorMessage = "Invalid EVM Wallet Address format";
                else targetEndpoint = `${API_BASE_URL}/historical/balances/evm/${address}?network_id=${networkId}`;
                break;
            case 'tokens':
                if (!/^0x[a-fA-F0-9]{40}$/.test(contract)) errorMessage = "Invalid EVM Contract Address format";
                else targetEndpoint = `${API_BASE_URL}/tokens/evm/${contract}?network_id=${networkId}`;
                break;
            case 'holders':
                 if (!/^0x[a-fA-F0-9]{40}$/.test(contract)) errorMessage = "Invalid EVM Contract Address format";
                 else targetEndpoint = `${API_BASE_URL}/holders/evm/${contract}?network_id=${networkId}`;
                 break;
            case 'ohlc_contract':
                 if (!/^0x[a-fA-F0-9]{40}$/.test(contract)) errorMessage = "Invalid EVM Contract Address format";
                 else targetEndpoint = `${API_BASE_URL}/ohlc/prices/evm/${contract}?network_id=${networkId}&interval=1d`;
                 break;
            case 'ohlc_pool':
                if (!/^0x[a-fA-F0-9]{40}$/.test(pool)) errorMessage = "Invalid EVM Pool Address format";
                else targetEndpoint = `${API_BASE_URL}/ohlc/pools/evm/${pool}?network_id=${networkId}&interval=1d`;
                break;
            case 'swaps':
                targetEndpoint = `${API_BASE_URL}/swaps/evm?network_id=${networkId}`;
                break;
            case 'pools':
                targetEndpoint = `${API_BASE_URL}/pools/evm?network_id=${networkId}`;
                break;
            default:
                errorMessage = "Invalid endpoint selected";
        }

        if (errorMessage) {
            throw new Error(errorMessage);
        }
        if (!targetEndpoint) {
             throw new Error("Could not determine target endpoint.");
        }

        const data = await fetchData(targetEndpoint);
        responseArea.textContent = JSON.stringify(data, null, 2);

    } catch (error) {
        console.error("Error in fetch handler:", error);
        responseArea.textContent = `Error: ${error.message}`;
    } finally {
        fetchButton.disabled = false;
    }
});

// --- Initial Setup ---
endpointSelect.addEventListener('change', updateInputs);
networkSelect.addEventListener('change', updateInputs);

updateInputs(); 