@echo off
echo Creating .env file with Grok API key...
echo.

(
echo # Grok API Key (xAI)
echo XAI_API_KEY=xai-GqbZBesgkXlA6MdxpxpGHkRNF7TsZTC6tkUcu1jyii3PFD6aLVTVBlnwY1D3i3b39PmER1LQ0RULmaP1
echo.
echo # Hoac dung ten nay (ca 2 deu duoc)
echo GROK_API_KEY=xai-GqbZBesgkXlA6MdxpxpGHkRNF7TsZTC6tkUcu1jyii3PFD6aLVTVBlnwY1D3i3b39PmER1LQ0RULmaP1
echo.
echo # OpenAI API Key (Optional - neu muon dung DALL-E)
echo # OPENAI_API_KEY=sk-...
) > .env

echo.
echo Done! File .env has been created.
echo.
echo Now restart AI service:
echo   python main.py
echo.
pause

