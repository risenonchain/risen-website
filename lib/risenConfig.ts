export const RISEN_CONTRACT_ADDRESS = "0x4052fba357d000c74e1e90222a3894b083993a6d";

export const RISEN_IS_CONTRACT_LIVE =
  RISEN_CONTRACT_ADDRESS.trim().startsWith("0x");

export const RISEN_BUY_LINK = RISEN_IS_CONTRACT_LIVE
  ? `https://pancakeswap.finance/swap?chain=bsc&outputCurrency=${RISEN_CONTRACT_ADDRESS}`
  : "#";