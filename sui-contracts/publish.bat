@echo off
REM Publish script với đường dẫn đầy đủ tới Sui CLI
REM Note: Cần switch sang testnet network trước: sui client switch --env testnet
D:\sui\sui.exe client publish --gas-budget 100000000
