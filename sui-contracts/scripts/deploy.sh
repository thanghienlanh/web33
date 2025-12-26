#!/bin/bash

# Script deploy Sui Move package

echo "=========================================="
echo "  Deploy AI Model NFT Package"
echo "=========================================="
echo ""

# Build package
echo "[1/3] Building package..."
sui move build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Publish to testnet
echo "[2/3] Publishing to testnet..."
echo "Note: Make sure you have SUI in your wallet for gas fees"
echo ""

sui client publish --gas-budget 100000000

if [ $? -ne 0 ]; then
    echo "❌ Publish failed!"
    exit 1
fi

echo ""
echo "=========================================="
echo "  ✅ Deployment Successful!"
echo "=========================================="
echo ""
echo "📋 Next steps:"
echo "1. Copy the Package ID from above"
echo "2. Add to frontend/.env.local:"
echo "   VITE_SUI_PACKAGE_ID=0x{package_id}"
echo "3. Restart frontend dev server"
echo ""
