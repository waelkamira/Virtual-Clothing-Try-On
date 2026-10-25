# Virtual-Clothing-Try-On

## Virtual try-on

Try-on generation uses the public [IDM-VTON Hugging Face Space](https://huggingface.co/spaces/yisol/IDM-VTON). It accepts the person photo and garment image, and returns a front-view try-on. The free shared demo may be queued, rate-limited, or unavailable.

Images are uploaded to Hugging Face for processing. The IDM-VTON model is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), which permits non-commercial use only. Do not use this integration for commercial purposes.

## Integration setup

Copy `.env.example` to `.env.local` and configure the services you intend to use. Keep credentials server-side; do not prefix them with `NEXT_PUBLIC_`.

### Try-on providers

`GET /api/try-on` reports the configured providers. `POST /api/try-on` tries enabled providers in order and moves to the next provider when one fails:

| Provider                          | Tier             | Configuration                                                                 |
| --------------------------------- | ---------------- | ----------------------------------------------------------------------------- |
| IDM-VTON public Hugging Face demo | Free             | Enabled by default; non-commercial license and shared demo availability apply |
| CatVTON                           | Free/self-hosted | Set `TRYON_CATVTON_URL` to a compatible multipart endpoint                    |
| OOTDiffusion                      | Free/self-hosted | Set `TRYON_OOTDIFFUSION_URL` to a compatible multipart endpoint               |
| Kolors Virtual Try-On             | Free/self-hosted | Set `TRYON_KOLORS_URL` to a compatible multipart endpoint                     |
| FASHN Try-On v1.6                 | Paid             | Set `FASHN_API_KEY` and `TRYON_ENABLE_PAID_FALLBACK=true`                     |
| FASHN Try-On Max                  | Paid             | Set `FASHN_API_KEY` and `TRYON_ENABLE_PAID_FALLBACK=true`                     |

The three self-hosted endpoints must accept multipart fields `person`, `garment`, `category`, and `description`, then return an image or JSON containing an `image` data URL. Configure only endpoints you operate and have licensed for your use.

### Retailer search and photo storage

`GET /api/products/search` uses SerpApi Google Shopping results and supports Amazon, Nike, Zara, Nordstrom, ASOS, H&M, Walmart, Target, eBay, and Etsy. Set `SERPAPI_API_KEY` to enable live results; without it, the route returns `503` with a configuration message. Private persistent uploads use Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set; otherwise the upload route returns an inline data URL for the current session.
