import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { config } from "./config/wagmi";
import { suiConfig } from "./config/sui";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={suiConfig.networks}
        defaultNetwork={suiConfig.defaultNetwork}
      >
        <WalletProvider autoConnect>
          <WagmiProvider config={config}>
            <App />
          </WagmiProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
