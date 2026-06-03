"use client";

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { bsc, mainnet, polygon } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = '861a457494a8677c735d4816c4f03762' // Placeholder Project ID

// 2. Create wagmiConfig
const metadata = {
  name: 'RISEN',
  description: 'RISEN Ecosystem - Dust Sweeper & Bridge',
  url: 'https://risenonchain.net',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [bsc, mainnet, polygon] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
})

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
