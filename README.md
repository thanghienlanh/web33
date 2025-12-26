# AI Model NFT Marketplace on Sui

[![Deploy Contract](https://img.shields.io/badge/Sui-Testnet-blue)](https://testnet.suiscan.xyz/)
[![Frontend](https://img.shields.io/badge/React-Frontend-blue)](http://localhost:3000)
[![Backend](https://img.shields.io/badge/Node.js-Backend-green)](http://localhost:3001)

A complete AI Model NFT marketplace built on Sui blockchain with modern React frontend, Node.js backend, and Move smart contracts.

## 🌟 Features

- 🎨 **AI Model NFTs** - Mint AI models as NFTs on Sui blockchain
- 💰 **Generation Fees** - Pay 0.1 SUI to generate images using AI
- 🖼️ **Image Generation** - Integrated with multiple AI image generation APIs
- 📦 **IPFS Storage** - Decentralized metadata and image storage
- 🎭 **Modern UI** - Beautiful React interface with Tailwind CSS
- 🔗 **Multi-chain Ready** - Sui blockchain integration
- 📱 **Responsive** - Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install)
- [Git](https://git-scm.com/)

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Deploy Sui Contract

```bash
# On Windows
sui-contracts\deploy-and-verify.bat

# On Linux/Mac
cd sui-contracts
./deploy-and-verify.sh
```

Copy the `Package ID` from deployment output and update `frontend/.env.local`:

```env
VITE_SUI_PACKAGE_ID=0x{your_package_id}
VITE_FEE_CONFIG_ID=0x{your_fee_config_id}
```

### 4. Start Services

```bash
# Start all services
./start-all.bat

# Or start individually:
# Backend: cd backend && npm run dev
# Frontend: cd frontend && npm run dev
# AI Service: cd ai-service && python main.py
```

### 5. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **AI Service**: http://localhost:8000

## 📋 Project Structure

```
├── frontend/           # React frontend
├── backend/            # Node.js backend
├── ai-service/         # Python AI service
├── sui-contracts/      # Sui Move contracts
├── contracts/          # Solidity contracts (legacy)
└── docs/              # Documentation
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
VITE_SUI_PACKAGE_ID=0x...
VITE_FEE_CONFIG_ID=0x...
VITE_SUI_NETWORK=testnet
VITE_API_URL=http://localhost:3001/api
```

#### Backend (.env)
```env
PORT=3001
IPFS_API_URL=http://localhost:5001
AI_SERVICE_URL=http://localhost:8000
```

## 🎨 Usage

### Mint NFT
1. Connect Sui Wallet
2. Go to "Tạo mô hình"
3. Fill model details
4. Upload image or generate with AI
5. Click "Tạo và Mint NFT"

### Generate Images
1. Go to "Tạo mô hình"
2. Click "Tạo ảnh (0.1 SUI)"
3. Approve transaction in wallet
4. AI generates image based on prompt

### View Collection
- "Mô hình của tôi" - Your minted NFTs
- "Thị trường" - Browse all NFTs

## 🔗 Smart Contracts

### Sui Contracts
- **model_nft.move** - NFT minting logic
- **generation_fee.move** - Fee payment system

### Key Functions
- `mint_and_transfer()` - Mint new NFT
- `create_fee_config()` - Initialize fee system
- `pay_fee()` - Pay for image generation

## 🛠️ Development

### Build Contracts
```bash
cd sui-contracts
sui move build
```

### Test Contracts
```bash
cd sui-contracts
sui move test
```

### Deploy to Mainnet
```bash
cd sui-contracts
sui client switch --env mainnet
sui client publish --gas-budget 200000000
```

## 📚 Documentation

- [Quick Start](QUICK_START.md)
- [Setup Guide](SETUP_GUIDE.md)
- [Contract Verification](VERIFY_CONTRACT_SUISCAN.md)
- [API Documentation](docs/API.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Sui Foundation](https://sui.io/) - For the amazing blockchain
- [Mysten Labs](https://mystenlabs.com/) - For Sui development tools
- [React](https://reactjs.org/) - For the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/YOUR_REPO/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/YOUR_REPO/discussions)
- **Discord**: [Sui Community](https://discord.gg/sui)

---

⭐ **Star this repo** if you find it helpful!
