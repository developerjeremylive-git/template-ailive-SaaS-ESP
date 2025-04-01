import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { logger } from 'hono/logger'
import { Ai } from '@cloudflare/ai'
import { cors } from 'hono/cors'

type Bindings = {
	__STATIC_CONTENT_MANIFEST: string
	AI: Ai
	DEEPSEEK_API_KEY?: string  // Optional API key in environment
}

const app: any = new Hono<{ Bindings: Bindings }>()

// Add CORS middleware for development
app.use('*', cors())

// Add logger middleware
app.use('*', logger())

// Middleware to handle errors
app.onError((err, c) => {
	console.error(`Error occurred:`, {
		message: err.message,
		stack: err.stack,
		url: c.req.url,
		method: c.req.method
	})
	return c.json({
		error: 'Internal Server Error',
		message: err.message
	}, 500)
})

// Health check endpoint
app.get('/health', (c) => c.json({ status: 'ok' }))

// Deepseek model endpoint
app.post('/api/deepseek', async (c) => {
	try {
		// Check for API key when configured
		const envApiKey = c.env.DEEPSEEK_API_KEY
		if (envApiKey) {
			const apiKey = c.req.header('X-API-Key')
			if (!apiKey || apiKey !== envApiKey) {
				return c.json({ error: 'Unauthorized. Invalid or missing API key.' }, 401)
			}
		}

		const body = await c.req.json()
		const { 
			messages,
			temperature,
			max_tokens,
			top_p,
			top_k 
		} = body

		if (!messages || !Array.isArray(messages)) {
			return c.json({ error: 'Invalid request. Messages array is required.' }, 400)
		}

		// Handle case where AI binding might not be available (development)
		if (!c.env.AI) {
			return c.json({ 
				error: 'AI binding not available',
				message: 'This endpoint requires Cloudflare Workers AI binding. Make sure you are deploying to Cloudflare with the proper AI binding configuration.'
			}, 500)
		}

		// Call the AI model with all parameters
		const stream = await c.env.AI.run(
			'@cf/deepseek-ai/deepseek-r1-distill-qwen-32b' as any,
			{
				messages,
				stream: true,
				temperature: temperature ?? 0.7,
				max_tokens: max_tokens ?? 1024,
				top_p: top_p ?? 1,
				top_k: top_k ?? 40
			} as any
		)

		return new Response(stream as any, {
			headers: { 'content-type': 'text/event-stream' },
		})
	} catch (error) {
		console.error('Error calling Deepseek model:', error)
		return c.json({ 
			error: 'Failed to process request',
			message: error instanceof Error ? error.message : 'Unknown error'
		}, 500)
	}
})

import { handlePayPalWebhook } from './api/paypal-webhook';
import { Context } from 'hono';

app.post('/api/paypal-webhook', async (c: Context<{ Bindings: Bindings }>) => {
  return handlePayPalWebhook(c.req as any);
});

// Serve static assets and handle SPA routing
app.use('*', async (c, next) => {
  try {
    // Parse manifest once to avoid multiple parsing
    let manifest;
    try {
      manifest = JSON.parse(c.env.__STATIC_CONTENT_MANIFEST)
    } catch (parseError) {
      console.error('Error parsing static content manifest:', parseError)
      throw new Error('Invalid static content manifest')
    }

    // Try to serve static files first
    try {
      const path = c.req.path
      // Check if the request is for a static asset
      const isStaticAsset = /\.(js|css|png|jpg|jpeg|gif|ico|svg)$/.test(path)
      
      const staticResponse = await serveStatic({
        root: './dist',
        manifest,
        rewriteRequestPath: (path) => {
          // Remove leading slash and handle potential double slashes
          return path.replace(/^\/+/, '').replace(/\/+/g, '/')
        }
      })(c, next)
      
      if (staticResponse) {
        // Add caching headers for static assets
        if (isStaticAsset) {
          staticResponse.headers.set('Cache-Control', 'public, max-age=31536000')
        }
        return staticResponse
      }

      // If the request is for a static asset but we couldn't serve it, return 404
      if (isStaticAsset) {
        throw new Error('Static asset not found')
      }
    } catch (staticError) {
      console.error('Error serving static file:', staticError)
      if (staticError.message === 'Static asset not found') {
        return new Response('Not Found', { status: 404 })
      }
      // Continue to SPA fallback for non-static assets
    }

    // For SPA routes, always serve index.html
    const indexHtmlContent = manifest['index.html']
    if (!indexHtmlContent) {
      console.error('index.html not found in manifest')
      throw new Error('Required static assets not found')
    }

    // Set appropriate headers for SPA routing
    return new Response(indexHtmlContent, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error serving content:', error)
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Error: ${error.message}` 
      : 'Unable to serve the requested content. Please try again later.'

    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redireccionando...</title>
        <style>
          :root { --bg: #1a1a1a; --text: #ffffff; --accent: #6366f1; --shadow: rgba(0, 0, 0, 0.1); }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg);
            color: var(--text);
            transition: all 0.3s ease;
          }
          .container {
            text-align: center;
            padding: 2rem;
            max-width: 600px;
            background: linear-gradient(145deg, var(--bg), color-mix(in srgb, var(--bg) 90%, var(--accent)));
            border-radius: 24px;
            box-shadow: 0 20px 40px var(--shadow);
            animation: float 6s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          h1 {
            font-size: 2.5rem;
            margin: 0 0 1rem;
            background: linear-gradient(to right, var(--accent), color-mix(in srgb, var(--accent) 70%, var(--text)));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient 8s ease infinite;
          }
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          p {
            font-size: 1.2rem;
            line-height: 1.6;
            margin: 1rem 0;
            opacity: 0.9;
          }
          .redirect-text {
            color: var(--accent);
            font-weight: 500;
            animation: pulse 2s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          .loader {
            width: 50px;
            height: 50px;
            border: 3px solid var(--bg);
            border-radius: 50%;
            border-top-color: var(--accent);
            margin: 2rem auto;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        </style>
        <script>
          // Detectar tema del sistema y aplicar variables CSS
          function setTheme() {
            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.style.setProperty('--bg', isDark ? '#1a1a1a' : '#ffffff');
            document.documentElement.style.setProperty('--text', isDark ? '#ffffff' : '#1a1a1a');
            document.documentElement.style.setProperty('--accent', isDark ? '#6366f1' : '#4f46e5');
            document.documentElement.style.setProperty('--shadow', isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)');
          }

          // Actualizar tema cuando cambie la preferencia del sistema
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);

          // Inicializar tema
          setTheme();

          // Contador de redirección
          let count = 2;
          function updateCounter() {
            const counter = document.getElementById('counter');
            counter.textContent = count;
            if (count > 0) {
              count--;
              setTimeout(updateCounter, 1000);
            } else {
              window.location.href = '/';
            }
          }
          window.onload = updateCounter;
        </script>
      </head>
      <body>
        <div class="container">
          <h1>${(c.req.headers?.get('Accept-Language') || '').includes('es') ? 'Procesando su solicitud' : 'Processing your request'}</h1>
          <div class="loader"></div>
          <p>${errorMessage}</p>
          <p class="redirect-text">${(c.req.headers?.get('Accept-Language') || '').includes('es') ? 'Redirigiendo a la página principal en' : 'Redirecting to the home page in'} <span id="counter">3</span> ${(c.req.headers?.get('Accept-Language') || '').includes('es') ? 'segundos...' : 'seconds...'}</p>
        </div>
      </body>
      </html>`,
      {
        status: 500,
        headers: { 
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'no-store'
        }
      }
    )
  }
})

export default app
