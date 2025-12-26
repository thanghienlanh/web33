import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { SplashScreen } from "./components/SplashScreen";
import { Home } from "./pages/Home";
import { Marketplace } from "./pages/Marketplace";
import { CreateModel } from "./pages/CreateModel";
import { MyModels } from "./pages/MyModels";
import { ModelDetail } from "./pages/ModelDetail";
import { SuiWalletDemo } from "./pages/SuiWalletDemo";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem("splashShown", "true");
    }
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/create" element={<CreateModel />} />
          <Route path="/my-models" element={<MyModels />} />
          <Route path="/model/:tokenId" element={<ModelDetail />} />
          <Route path="/sui-wallet" element={<SuiWalletDemo />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
