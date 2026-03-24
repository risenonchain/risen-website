export const RISEN_CONTRACT_ADDRESS = "0xfaae1faadc569895162c5584ffbca845f4147777";

export const RISEN_IS_CONTRACT_LIVE =
  RISEN_CONTRACT_ADDRESS.trim().startsWith("0x");

export const RISEN_BUY_LINK = RISEN_IS_CONTRACT_LIVE
  ? `https://pancakeswap.finance/swap?chain=bsc&outputCurrency=${RISEN_CONTRACT_ADDRESS}`
  : "#";