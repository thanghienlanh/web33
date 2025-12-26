"""
AI Image Generation Service
Sử dụng Stable Diffusion hoặc DALL-E để tạo ảnh
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
import base64
from io import BytesIO
from PIL import Image

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Image Generation Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class ImageGenerationRequest(BaseModel):
    prompt: str
    model_type: str = "pollinations"  # "pollinations", "stable-diffusion", "dall-e", "grok", "huggingface"
    negative_prompt: Optional[str] = None
    width: int = 512
    height: int = 512
    num_inference_steps: int = 50
    guidance_scale: float = 7.5
    seed: Optional[int] = None

class ImageGenerationResponse(BaseModel):
    success: bool
    image_base64: Optional[str] = None
    image_url: Optional[str] = None
    message: str

# Global model cache
stable_diffusion_pipeline = None

def load_stable_diffusion():
    """Load Stable Diffusion model"""
    global stable_diffusion_pipeline
    if stable_diffusion_pipeline is None:
        try:
            from diffusers import StableDiffusionPipeline
            import torch
            
            device = "cuda" if torch.cuda.is_available() else "cpu"
            model_id = "runwayml/stable-diffusion-v1-5"
            
            print(f"Loading Stable Diffusion model on {device}...")
            stable_diffusion_pipeline = StableDiffusionPipeline.from_pretrained(
                model_id,
                torch_dtype=torch.float16 if device == "cuda" else torch.float32,
            )
            stable_diffusion_pipeline = stable_diffusion_pipeline.to(device)
            stable_diffusion_pipeline.safety_checker = None  # Disable safety checker for faster generation
            print("Stable Diffusion model loaded successfully!")
        except ImportError as e:
            raise HTTPException(
                status_code=503,
                detail="Stable Diffusion is not available. Please install: pip install torch torchvision transformers diffusers accelerate. Or use 'dall-e' model type instead."
            )
        except Exception as e:
            print(f"Error loading Stable Diffusion: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to load Stable Diffusion: {str(e)}"
            )
    return stable_diffusion_pipeline

def generate_with_stable_diffusion(request: ImageGenerationRequest) -> Image:
    """Generate image using Stable Diffusion"""
    try:
        pipeline = load_stable_diffusion()
        
        generator = None
        if request.seed:
            import torch
            generator = torch.Generator(device=pipeline.device).manual_seed(request.seed)
        
        image = pipeline(
            prompt=request.prompt,
            negative_prompt=request.negative_prompt,
            width=request.width,
            height=request.height,
            num_inference_steps=request.num_inference_steps,
            guidance_scale=request.guidance_scale,
            generator=generator,
        ).images[0]
        
        return image
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stable Diffusion error: {str(e)}")

def generate_with_grok(request: ImageGenerationRequest) -> Image:
    """
    Generate image using Grok API
    Lưu ý: Grok không có image generation trực tiếp
    Sử dụng Grok để enhance prompt, sau đó dùng với Stable Diffusion hoặc DALL-E
    """
    try:
        import requests
        
        api_key = os.getenv("XAI_API_KEY") or os.getenv("GROK_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="XAI_API_KEY or GROK_API_KEY not found in environment variables. Please set it in .env file."
            )
        
        # Dùng Grok để enhance prompt
        print(f"Using Grok to enhance prompt: {request.prompt}")
        
        grok_response = requests.post(
            "https://api.x.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "grok-beta",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a professional prompt engineer for AI image generation. Enhance the given prompt to be more detailed, descriptive, and optimized for image generation. Include style, composition, lighting, and other visual details. Return ONLY the enhanced prompt, nothing else."
                    },
                    {
                        "role": "user",
                        "content": f"Enhance this image generation prompt to be more detailed and descriptive: {request.prompt}"
                    }
                ],
                "max_tokens": 300,
                "temperature": 0.7
            },
            timeout=30
        )
        
        if grok_response.status_code != 200:
            raise HTTPException(
                status_code=grok_response.status_code,
                detail=f"Grok API error: {grok_response.text}"
            )
        
        enhanced_prompt = grok_response.json()["choices"][0]["message"]["content"].strip()
        print(f"Enhanced prompt from Grok: {enhanced_prompt}")
        
        # Sau khi có enhanced prompt, dùng với Pollinations (FREE, ưu tiên) hoặc Stable Diffusion hoặc DALL-E
        # Ưu tiên Pollinations vì miễn phí và không cần setup
        try:
            # Thử dùng Pollinations trước (FREE, không cần GPU)
            enhanced_request = ImageGenerationRequest(
                prompt=enhanced_prompt,
                model_type="pollinations",
                negative_prompt=request.negative_prompt,
                width=request.width,
                height=request.height,
                num_inference_steps=request.num_inference_steps,
                guidance_scale=request.guidance_scale,
                seed=request.seed
            )
            print("Using Pollinations (FREE) with Grok-enhanced prompt")
            return generate_with_pollinations(enhanced_request)
        except Exception as poll_error:
            # Nếu Pollinations lỗi, thử Stable Diffusion
            try:
                enhanced_request = ImageGenerationRequest(
                    prompt=enhanced_prompt,
                    model_type="stable-diffusion",
                    negative_prompt=request.negative_prompt,
                    width=request.width,
                    height=request.height,
                    num_inference_steps=request.num_inference_steps,
                    guidance_scale=request.guidance_scale,
                    seed=request.seed
                )
                print("Using Stable Diffusion with Grok-enhanced prompt")
                return generate_with_stable_diffusion(enhanced_request)
            except HTTPException as e:
                # Nếu Stable Diffusion không có, thử DALL-E
                if "Stable Diffusion is not available" in str(e.detail):
                    try:
                        from openai import OpenAI
                        openai_key = os.getenv("OPENAI_API_KEY")
                        if openai_key:
                            print("Using DALL-E with Grok-enhanced prompt")
                            client = OpenAI(api_key=openai_key)
                            response = client.images.generate(
                                model="dall-e-3",
                                prompt=enhanced_prompt,
                                size=f"{request.width}x{request.height}",
                                quality="standard",
                                n=1,
                            )
                            image_url = response.data[0].url
                            img_response = requests.get(image_url)
                            image = Image.open(BytesIO(img_response.content))
                            return image
                        else:
                            # Fallback cuối cùng: Hugging Face
                            try:
                                enhanced_request = ImageGenerationRequest(
                                    prompt=enhanced_prompt,
                                    model_type="huggingface",
                                    negative_prompt=request.negative_prompt,
                                    width=request.width,
                                    height=request.height,
                                    num_inference_steps=request.num_inference_steps,
                                    guidance_scale=request.guidance_scale,
                                    seed=request.seed
                                )
                                print("Using Hugging Face (FREE) with Grok-enhanced prompt")
                                return generate_with_huggingface(enhanced_request)
                            except:
                                raise HTTPException(
                                    status_code=503,
                                    detail="No image generation service available. Please install torch/diffusers, set OPENAI_API_KEY, or use Pollinations directly."
                                )
                    except Exception as dalle_error:
                        raise HTTPException(
                            status_code=500,
                            detail=f"Failed to generate image: {str(dalle_error)}"
                        )
                else:
                    raise
        
    except HTTPException:
        raise
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Grok API request failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Grok error: {str(e)}")

def generate_with_dalle(request: ImageGenerationRequest) -> Image:
    """Generate image using DALL-E API"""
    try:
        from openai import OpenAI
        
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="OPENAI_API_KEY not found in environment variables"
            )
        
        client = OpenAI(api_key=api_key)
        
        response = client.images.generate(
            model="dall-e-3",
            prompt=request.prompt,
            size=f"{request.width}x{request.height}",
            quality="standard",
            n=1,
        )
        
        image_url = response.data[0].url
        
        # Download image
        import requests
        img_response = requests.get(image_url)
        image = Image.open(BytesIO(img_response.content))
        
        return image
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DALL-E error: {str(e)}")

def generate_with_pollinations(request: ImageGenerationRequest) -> Image:
    """
    Generate image using Pollinations.ai API (100% FREE, no API key needed!)
    Website: https://pollinations.ai
    """
    try:
        import requests
        
        # Pollinations.ai API - hoàn toàn miễn phí, không cần API key
        # URL format: https://image.pollinations.ai/prompt/{prompt}?width={width}&height={height}
        
        # Encode prompt for URL
        import urllib.parse
        encoded_prompt = urllib.parse.quote(request.prompt)
        
        # Build URL with parameters
        url = f"https://image.pollinations.ai/prompt/{encoded_prompt}"
        params = {
            "width": request.width,
            "height": request.height,
            "seed": request.seed if request.seed else "",
            "nologo": "true",  # Remove watermark
            "enhance": "true",  # Enhance quality
        }
        
        # Remove empty params
        params = {k: v for k, v in params.items() if v}
        
        print(f"Calling Pollinations.ai API: {url}")
        
        response = requests.get(url, params=params, timeout=60)
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Pollinations API error: {response.text}"
            )
        
        # Pollinations returns image directly
        image = Image.open(BytesIO(response.content))
        return image
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Pollinations API request failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pollinations error: {str(e)}")

def generate_with_huggingface(request: ImageGenerationRequest) -> Image:
    """
    Generate image using Hugging Face Inference API (FREE tier available)
    Requires: HUGGINGFACE_API_KEY (get free at https://huggingface.co/settings/tokens)
    """
    try:
        import requests
        
        api_key = os.getenv("HUGGINGFACE_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="HUGGINGFACE_API_KEY not found. Get free API key at https://huggingface.co/settings/tokens"
            )
        
        # Use Stable Diffusion model on Hugging Face
        model_id = "stabilityai/stable-diffusion-2-1"
        api_url = f"https://api-inference.huggingface.co/models/{model_id}"
        
        headers = {"Authorization": f"Bearer {api_key}"}
        
        payload = {
            "inputs": request.prompt,
            "parameters": {
                "width": request.width,
                "height": request.height,
                "num_inference_steps": request.num_inference_steps,
                "guidance_scale": request.guidance_scale,
            }
        }
        
        if request.seed:
            payload["parameters"]["seed"] = request.seed
        
        print(f"Calling Hugging Face API: {model_id}")
        
        response = requests.post(api_url, headers=headers, json=payload, timeout=120)
        
        if response.status_code != 200:
            error_msg = response.json().get("error", response.text)
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Hugging Face API error: {error_msg}"
            )
        
        # Hugging Face returns image bytes
        image = Image.open(BytesIO(response.content))
        return image
        
    except HTTPException:
        raise
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Hugging Face API request failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hugging Face error: {str(e)}")

def image_to_base64(image: Image) -> str:
    """Convert PIL Image to base64 string"""
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return img_str

@app.get("/")
async def root():
    # Check which models are available
    models = []
    
    # Pollinations - Always available (100% FREE, no API key)
    models.append("pollinations")
    
    # Hugging Face - Check API key
    if os.getenv("HUGGINGFACE_API_KEY"):
        models.append("huggingface")
    
    # Grok API
    if os.getenv("XAI_API_KEY") or os.getenv("GROK_API_KEY"):
        models.append("grok")
    
    # DALL-E
    if os.getenv("OPENAI_API_KEY"):
        models.append("dall-e")
    
    # Local Stable Diffusion
    try:
        import torch
        import diffusers
        models.append("stable-diffusion")
    except ImportError:
        pass
    
    if not models:
        models = ["pollinations"]  # Default to free option
    
    return {
        "message": "AI Image Generation Service",
        "status": "running",
        "models": models,
        "free_models": ["pollinations", "huggingface"],
        "paid_models": ["dall-e", "grok"],
        "note": "Use 'pollinations' for 100% FREE image generation (no API key needed!). Use 'huggingface' for FREE Hugging Face API (requires HUGGINGFACE_API_KEY). Use 'grok' for Grok API (requires XAI_API_KEY). Use 'dall-e' for DALL-E API (requires OPENAI_API_KEY). Use 'stable-diffusion' for local generation (requires torch, diffusers)."
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/generate", response_model=ImageGenerationResponse)
async def generate_image(request: ImageGenerationRequest):
    """
    Generate image from text prompt
    
    - **prompt**: Text description of the image
    - **model_type**: "pollinations" (FREE), "huggingface" (FREE), "stable-diffusion", "dall-e", or "grok"
    - **width**: Image width (default: 512)
    - **height**: Image height (default: 512)
    - **num_inference_steps**: Number of steps for Stable Diffusion (default: 50)
    - **guidance_scale**: Guidance scale (default: 7.5)
    - **seed**: Random seed for reproducibility
    
    FREE Options:
    - "pollinations": 100% FREE, no API key needed! (Recommended)
    - "huggingface": FREE tier, requires HUGGINGFACE_API_KEY
    
    Paid Options:
    - "grok": Uses Grok API to enhance prompt, then generates with Stable Diffusion or DALL-E
    - "dall-e": OpenAI DALL-E API (paid)
    - "stable-diffusion": Local generation (free but needs GPU)
    """
    try:
        # Generate image based on model type
        if request.model_type == "pollinations":
            image = generate_with_pollinations(request)
        elif request.model_type == "huggingface":
            image = generate_with_huggingface(request)
        elif request.model_type == "stable-diffusion":
            image = generate_with_stable_diffusion(request)
        elif request.model_type == "grok":
            image = generate_with_grok(request)
        elif request.model_type == "dall-e":
            image = generate_with_dalle(request)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported model type: {request.model_type}. Available: pollinations (FREE), huggingface (FREE), stable-diffusion, grok, dall-e"
            )
        
        # Convert to base64
        image_base64 = image_to_base64(image)
        
        return ImageGenerationResponse(
            success=True,
            image_base64=image_base64,
            message="Image generated successfully"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        return ImageGenerationResponse(
            success=False,
            message=f"Error generating image: {str(e)}"
        )

@app.post("/generate-batch")
async def generate_batch(requests: list[ImageGenerationRequest]):
    """Generate multiple images"""
    results = []
    for request in requests:
        try:
            result = await generate_image(request)
            results.append(result.dict())
        except Exception as e:
            results.append({
                "success": False,
                "message": str(e)
            })
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

