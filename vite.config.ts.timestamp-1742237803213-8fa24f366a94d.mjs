var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/api/stripe-service.ts
var STRIPE_API, StripeService, stripeService, stripe_service_default;
var init_stripe_service = __esm({
  "src/api/stripe-service.ts"() {
    STRIPE_API = {
      createCustomer: "/api/stripe/customers",
      updateCustomer: "/api/stripe/customers",
      createSession: "/api/stripe/create-checkout-session",
      retrieveSession: "/api/stripe/retrieve-session",
      getSubscription: "/api/stripe/subscriptions",
      getCustomerSubscriptions: "/api/stripe/customer-subscriptions",
      updateSubscription: "/api/stripe/subscriptions",
      cancelSubscription: "/api/stripe/subscriptions/cancel",
      createPortalSession: "/api/stripe/create-portal-session"
    };
    StripeService = class {
      apiRoot;
      constructor(apiRoot = "") {
        this.apiRoot = apiRoot;
      }
      /**
       * Create a Stripe customer
       */
      async createCustomer(params) {
        const response = await fetch(`${this.apiRoot}${STRIPE_API.createCustomer}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params)
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create Stripe customer");
        }
        return response.json();
      }
      /**
       * Update a Stripe customer
       */
      async updateCustomer(customerId, updates) {
        const response = await fetch(`${this.apiRoot}${STRIPE_API.updateCustomer}/${customerId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates)
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update Stripe customer");
        }
        return response.json();
      }
      /**
       * Create a checkout session for subscription
       */
      async createCheckoutSession(params) {
        const response = await fetch(`${this.apiRoot}${STRIPE_API.createSession}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId: params.priceId,
            customerId: params.customerId,
            successUrl: params.successUrl,
            cancelUrl: params.cancelUrl
          })
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create checkout session");
        }
        return response.json();
      }
      /**
       * Create a customer portal session
       */
      async createCustomerPortalSession(params) {
        const response = await fetch(`${this.apiRoot}${STRIPE_API.createPortalSession}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: params.customerId,
            returnUrl: params.returnUrl
          })
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create portal session");
        }
        return response.json();
      }
      /**
       * Get subscription by ID
       */
      async getSubscription(subscriptionId) {
        const response = await fetch(`${this.apiRoot}${STRIPE_API.getSubscription}/${subscriptionId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to retrieve subscription");
        }
        return response.json();
      }
      /**
       * Get subscriptions for a customer
       */
      async getCustomerSubscriptions(customerId) {
        const response = await fetch(`${this.apiRoot}${STRIPE_API.getCustomerSubscriptions}/${customerId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to retrieve customer subscriptions");
        }
        return response.json();
      }
      /**
       * Update subscription
       */
      async updateSubscription(subscriptionId, newPriceId) {
        const response = await fetch(`${this.apiRoot}${STRIPE_API.updateSubscription}/${subscriptionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId: newPriceId
          })
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update subscription");
        }
        return response.json();
      }
      /**
       * Cancel subscription
       */
      async cancelSubscription(subscriptionId) {
        const response = await fetch(`${this.apiRoot}${STRIPE_API.cancelSubscription}/${subscriptionId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to cancel subscription");
        }
        return response.json();
      }
      /**
       * Retrieve checkout session by ID
       */
      async retrieveSession(sessionId) {
        const response = await fetch(`${this.apiRoot}${STRIPE_API.retrieveSession}/${sessionId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to retrieve checkout session");
        }
        return response.json();
      }
      /**
       * Create a Stripe customer or return the billing portal URL
       */
      async createStripeCustomer() {
        const response = await fetch(`${this.apiRoot}/api/create-stripe-customer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create/link Stripe customer");
        }
        return response.json();
      }
    };
    stripeService = new StripeService();
    stripe_service_default = stripeService;
  }
});

// src/utils/subscriptionConstants.ts
var PLAN_IDS, PLAN_TO_PRICE_MAP, PRICE_TO_PLAN_MAP, PLAN_PRICING, PLAN_FEATURES, PLAN_NAMES;
var init_subscriptionConstants = __esm({
  "src/utils/subscriptionConstants.ts"() {
    PLAN_IDS = {
      FREE: "1",
      STARTER: "2",
      PRO: "3",
      ENTERPRISE: "4"
    };
    PLAN_TO_PRICE_MAP = {
      // Free plan doesn't have a price ID
      [PLAN_IDS.FREE]: "",
      // Test price IDs for Stripe
      [PLAN_IDS.STARTER]: "price_1QzuV407Sez9m06J0x9IUqhR",
      // Starter plan
      [PLAN_IDS.PRO]: "price_1QzuVA07Sez9m06JbNwIzPcV",
      // Pro plan
      [PLAN_IDS.ENTERPRISE]: "price_1QzueA07Sez9m06JkNgQEjoH"
      // Enterprise plan
    };
    PRICE_TO_PLAN_MAP = Object.entries(PLAN_TO_PRICE_MAP).reduce((acc, [planId, priceId]) => {
      if (priceId) acc[priceId] = planId;
      return acc;
    }, {});
    PLAN_PRICING = {
      [PLAN_IDS.FREE]: {
        monthly: 0,
        yearly: 0
      },
      [PLAN_IDS.STARTER]: {
        monthly: 9.99,
        yearly: 99.99
        // ~2 months free
      },
      [PLAN_IDS.PRO]: {
        monthly: 19.99,
        yearly: 199.99
        // ~2 months free
      },
      [PLAN_IDS.ENTERPRISE]: {
        monthly: 99.99,
        yearly: 999.99
        // ~2 months free
      }
    };
    PLAN_FEATURES = {
      [PLAN_IDS.FREE]: {
        apiCalls: 100,
        storage: 100 * 1024 * 1024,
        // 100 MB
        modelLimit: 5,
        supportLevel: "email",
        customization: false,
        analytics: false
      },
      [PLAN_IDS.STARTER]: {
        apiCalls: 1e3,
        storage: 500 * 1024 * 1024,
        // 500 MB
        modelLimit: 20,
        supportLevel: "priority_email",
        customization: true,
        analytics: false
      },
      [PLAN_IDS.PRO]: {
        apiCalls: 1e4,
        storage: 2 * 1024 * 1024 * 1024,
        // 2 GB
        modelLimit: 50,
        supportLevel: "live_chat",
        customization: true,
        analytics: true
      },
      [PLAN_IDS.ENTERPRISE]: {
        apiCalls: 1e5,
        storage: 10 * 1024 * 1024 * 1024,
        // 10 GB
        modelLimit: 100,
        supportLevel: "dedicated",
        customization: true,
        analytics: true
      }
    };
    PLAN_NAMES = {
      [PLAN_IDS.FREE]: "Free",
      [PLAN_IDS.STARTER]: "Starter",
      [PLAN_IDS.PRO]: "Pro",
      [PLAN_IDS.ENTERPRISE]: "Enterprise"
    };
  }
});

// src/utils/subscriptionHelpers.ts
var init_subscriptionHelpers = __esm({
  "src/utils/subscriptionHelpers.ts"() {
    init_subscriptionConstants();
  }
});

// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from "file:///C:/Users/Jerem/Desktop/StartUp/ailive/live-chatbot/node_modules/react/index.js";
import { createClient } from "file:///C:/Users/Jerem/Desktop/StartUp/ailive/live-chatbot/node_modules/@supabase/supabase-js/dist/main/index.js";
var AuthContext, supabaseUrl, supabaseKey, supabase;
var init_AuthContext = __esm({
  "src/context/AuthContext.tsx"() {
    init_subscriptionHelpers();
    init_stripe_service();
    init_subscriptionConstants();
    AuthContext = createContext(void 0);
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY environment variables.");
    }
    supabase = createClient(supabaseUrl, supabaseKey);
  }
});

// src/pages/api/create-stripe-customer.ts
var create_stripe_customer_exports = {};
__export(create_stripe_customer_exports, {
  default: () => handler
});
async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
      let stripeCustomerId = user.user_metadata?.stripe_customer_id;
      if (!stripeCustomerId) {
        const customer = await stripe_service_default.createCustomer({
          email: user.email || "",
          name: profile?.username || "",
          metadata: {
            user_id: user.id
          }
        });
        stripeCustomerId = customer.id;
        try {
          const { data, error } = await supabase.auth.updateUser({
            data: {
              stripe_customer_id: stripeCustomerId
            }
          });
          if (error) {
            console.error("Error updating user metadata:", error);
            return res.status(500).json({ message: "Failed to update user metadata" });
          }
        } catch (error) {
          console.error("Error updating user metadata:", error);
          return res.status(500).json({ message: "Failed to update user metadata" });
        }
        console.log("stripeCustomerId", stripeCustomerId);
      }
      const stripe = __require("file:///C:/Users/Jerem/node_modules/stripe/esm/stripe.esm.node.js")("sk_test_51QfOtM07Sez9m06JATTFWahDCLl8XzajR1nQgghAJhMD7cTijA6GjPLChBWxYgVSa3VKOk3Ui2HkvM3Ik9K5nBx900XMZdIUay");
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${req.headers.origin}/subscription`
      });
      res.status(200).json({ url: portalSession.url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || "Failed to create/link Stripe customer" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
var init_create_stripe_customer = __esm({
  "src/pages/api/create-stripe-customer.ts"() {
    init_stripe_service();
    init_AuthContext();
  }
});

// src/api/deepseek-proxy.ts
var deepseek_proxy_exports = {};
__export(deepseek_proxy_exports, {
  POST: () => POST
});
async function POST(request) {
  try {
    const body = await request.json();
    const { messages } = body;
    const apiKey = request.headers.get("X-API-Key");
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request. Messages array is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (apiKey && !validateApiKey(apiKey)) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Invalid API key." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const lastUserMessage = messages.filter((m) => m.role === "user").pop()?.content || "";
          const simulatedResponse = `This is a simulated response in development mode for: "${lastUserMessage}". 
            
In production with Cloudflare Workers, this would connect to the DeepSeek-R1-Distill-Qwen-32B model.

Key features of this model:
- 80,000 token context window
- State-of-the-art performance for dense models
- Excels at reasoning and creative tasks
- Outperforms OpenAI-o1-mini across benchmarks

To use the actual model, deploy to Cloudflare Workers with the AI binding configured.`;
          let currentPosition = 0;
          const chunkSize = 10;
          while (currentPosition < simulatedResponse.length) {
            const chunk = simulatedResponse.slice(
              currentPosition,
              Math.min(currentPosition + chunkSize, simulatedResponse.length)
            );
            const sseData = `data: ${JSON.stringify({ response: chunk })}

`;
            controller.enqueue(encoder.encode(sseData));
            currentPosition += chunkSize;
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });
  } catch (error) {
    console.error("Error in DeepSeek proxy:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
var validateApiKey;
var init_deepseek_proxy = __esm({
  "src/api/deepseek-proxy.ts"() {
    validateApiKey = (apiKey) => {
      return !!apiKey;
    };
  }
});

// vite.config.ts
import { defineConfig } from "file:///C:/Users/Jerem/Desktop/StartUp/ailive/live-chatbot/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Jerem/Desktop/StartUp/ailive/live-chatbot/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { fileURLToPath } from "url";
import path from "path";
var __vite_injected_original_import_meta_url = "file:///C:/Users/Jerem/Desktop/StartUp/ailive/live-chatbot/vite.config.ts";
var __dirname = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 3e3,
    host: true,
    proxy: {
      // Proxy API requests in development
      "/api/create-stripe-customer": {
        target: "http://localhost:3000",
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
        },
        bypass: (req, res) => {
          if (req.url === "/api/create-stripe-customer") {
            Promise.resolve().then(() => (init_create_stripe_customer(), create_stripe_customer_exports)).then((module) => {
              module.default(req, res).catch((error) => {
                console.error("Error processing request:", error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "Internal server error" }));
              });
            }).catch((error) => {
              console.error("Error importing API handler:", error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Failed to load API handler" }));
            });
            return true;
          }
        }
      },
      "/api/deepseek": {
        target: "http://localhost:3000",
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
        },
        // Use custom handler for the API endpoint
        bypass: (req, res) => {
          if (req.url === "/api/deepseek") {
            Promise.resolve().then(() => (init_deepseek_proxy(), deepseek_proxy_exports)).then((module) => {
              module.POST(req).then((response) => {
                res.statusCode = response.status;
                response.headers.forEach((value, key) => {
                  res.setHeader(key, value);
                });
                if (response.body) {
                  const reader = response.body.getReader();
                  const pump = () => {
                    reader.read().then(({ done, value }) => {
                      if (done) {
                        res.end();
                        return;
                      }
                      res.write(value);
                      pump();
                    }).catch((err) => {
                      console.error("Error streaming response:", err);
                      res.end();
                    });
                  };
                  pump();
                } else {
                  res.end();
                }
              }).catch((error) => {
                console.error("Error processing request:", error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "Internal server error" }));
              });
            }).catch((error) => {
              console.error("Error importing proxy module:", error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Failed to load API handler" }));
            });
            return true;
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    // Increase the warning limit to suppress the warning message
    chunkSizeWarningLimit: 1e3
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2FwaS9zdHJpcGUtc2VydmljZS50cyIsICJzcmMvdXRpbHMvc3Vic2NyaXB0aW9uQ29uc3RhbnRzLnRzIiwgInNyYy91dGlscy9zdWJzY3JpcHRpb25IZWxwZXJzLnRzIiwgInNyYy9jb250ZXh0L0F1dGhDb250ZXh0LnRzeCIsICJzcmMvcGFnZXMvYXBpL2NyZWF0ZS1zdHJpcGUtY3VzdG9tZXIudHMiLCAic3JjL2FwaS9kZWVwc2Vlay1wcm94eS50cyIsICJ2aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEplcmVtXFxcXERlc2t0b3BcXFxcU3RhcnRVcFxcXFxhaWxpdmVcXFxcbGl2ZS1jaGF0Ym90XFxcXHNyY1xcXFxhcGlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEplcmVtXFxcXERlc2t0b3BcXFxcU3RhcnRVcFxcXFxhaWxpdmVcXFxcbGl2ZS1jaGF0Ym90XFxcXHNyY1xcXFxhcGlcXFxcc3RyaXBlLXNlcnZpY2UudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0plcmVtL0Rlc2t0b3AvU3RhcnRVcC9haWxpdmUvbGl2ZS1jaGF0Ym90L3NyYy9hcGkvc3RyaXBlLXNlcnZpY2UudHNcIjtpbXBvcnQgeyBTdWJzY3JpcHRpb25QbGFuIH0gZnJvbSAnLi4vY29udGV4dC9BdXRoQ29udGV4dCc7XG5pbXBvcnQgeyBQTEFOX1RPX1BSSUNFX01BUCwgUFJJQ0VfVE9fUExBTl9NQVAgfSBmcm9tICcuLi91dGlscy9zdWJzY3JpcHRpb25Db25zdGFudHMnO1xuXG4vLyBEZWZpbmUgU3RyaXBlIEFQSSBlbmRwb2ludHNcbmNvbnN0IFNUUklQRV9BUEkgPSB7XG4gIGNyZWF0ZUN1c3RvbWVyOiAnL2FwaS9zdHJpcGUvY3VzdG9tZXJzJyxcbiAgdXBkYXRlQ3VzdG9tZXI6ICcvYXBpL3N0cmlwZS9jdXN0b21lcnMnLFxuICBjcmVhdGVTZXNzaW9uOiAnL2FwaS9zdHJpcGUvY3JlYXRlLWNoZWNrb3V0LXNlc3Npb24nLFxuICByZXRyaWV2ZVNlc3Npb246ICcvYXBpL3N0cmlwZS9yZXRyaWV2ZS1zZXNzaW9uJyxcbiAgZ2V0U3Vic2NyaXB0aW9uOiAnL2FwaS9zdHJpcGUvc3Vic2NyaXB0aW9ucycsXG4gIGdldEN1c3RvbWVyU3Vic2NyaXB0aW9uczogJy9hcGkvc3RyaXBlL2N1c3RvbWVyLXN1YnNjcmlwdGlvbnMnLFxuICB1cGRhdGVTdWJzY3JpcHRpb246ICcvYXBpL3N0cmlwZS9zdWJzY3JpcHRpb25zJyxcbiAgY2FuY2VsU3Vic2NyaXB0aW9uOiAnL2FwaS9zdHJpcGUvc3Vic2NyaXB0aW9ucy9jYW5jZWwnLFxuICBjcmVhdGVQb3J0YWxTZXNzaW9uOiAnL2FwaS9zdHJpcGUvY3JlYXRlLXBvcnRhbC1zZXNzaW9uJ1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBTdHJpcGVDdXN0b21lciB7XG4gIGlkOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIG1ldGFkYXRhPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdHJpcGVTdWJzY3JpcHRpb24ge1xuICBpZDogc3RyaW5nO1xuICBjdXN0b21lcjogc3RyaW5nO1xuICBzdGF0dXM6ICdhY3RpdmUnIHwgJ2NhbmNlbGVkJyB8ICdpbmNvbXBsZXRlJyB8ICdpbmNvbXBsZXRlX2V4cGlyZWQnIHwgJ3Bhc3RfZHVlJyB8ICd0cmlhbGluZycgfCAndW5wYWlkJztcbiAgY3VycmVudF9wZXJpb2Rfc3RhcnQ6IG51bWJlcjtcbiAgY3VycmVudF9wZXJpb2RfZW5kOiBudW1iZXI7XG4gIHN0YXJ0X2RhdGU6IG51bWJlcjtcbiAgY2FuY2VsZWRfYXQ6IG51bWJlciB8IG51bGw7XG4gIGNhbmNlbF9hdF9wZXJpb2RfZW5kOiBib29sZWFuO1xuICBpdGVtczoge1xuICAgIGRhdGE6IEFycmF5PHtcbiAgICAgIHByaWNlOiB7XG4gICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgIHByb2R1Y3Q6IHN0cmluZztcbiAgICAgIH1cbiAgICB9PlxuICB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0cmlwZVBheW1lbnRNZXRob2Qge1xuICBpZDogc3RyaW5nO1xuICB0eXBlOiBzdHJpbmc7XG4gIGNhcmQ/OiB7XG4gICAgYnJhbmQ6IHN0cmluZztcbiAgICBsYXN0NDogc3RyaW5nO1xuICAgIGV4cF9tb250aDogbnVtYmVyO1xuICAgIGV4cF95ZWFyOiBudW1iZXI7XG4gIH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2hlY2tvdXRTZXNzaW9uUGFyYW1zIHtcbiAgY3VzdG9tZXJJZDogc3RyaW5nO1xuICBwcmljZUlkOiBzdHJpbmc7XG4gIHN1Y2Nlc3NVcmw6IHN0cmluZztcbiAgY2FuY2VsVXJsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tZXJQb3J0YWxQYXJhbXMge1xuICBjdXN0b21lcklkOiBzdHJpbmc7XG4gIHJldHVyblVybDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbWVyUGFyYW1zIHtcbiAgZW1haWw6IHN0cmluZztcbiAgbmFtZT86IHN0cmluZztcbiAgbWV0YWRhdGE/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbWVyVXBkYXRlUGFyYW1zIHtcbiAgZW1haWw/OiBzdHJpbmc7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIG1ldGFkYXRhPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn1cblxuY2xhc3MgU3RyaXBlU2VydmljZSB7XG4gIHByaXZhdGUgYXBpUm9vdDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGFwaVJvb3QgPSAnJykge1xuICAgIHRoaXMuYXBpUm9vdCA9IGFwaVJvb3Q7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU3RyaXBlIGN1c3RvbWVyXG4gICAqL1xuICBhc3luYyBjcmVhdGVDdXN0b21lcihwYXJhbXM6IEN1c3RvbWVyUGFyYW1zKTogUHJvbWlzZTxTdHJpcGVDdXN0b21lcj4ge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7dGhpcy5hcGlSb290fSR7U1RSSVBFX0FQSS5jcmVhdGVDdXN0b21lcn1gLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGFyYW1zKSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byBjcmVhdGUgU3RyaXBlIGN1c3RvbWVyJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYSBTdHJpcGUgY3VzdG9tZXJcbiAgICovXG4gIGFzeW5jIHVwZGF0ZUN1c3RvbWVyKGN1c3RvbWVySWQ6IHN0cmluZywgdXBkYXRlczogQ3VzdG9tZXJVcGRhdGVQYXJhbXMpOiBQcm9taXNlPFN0cmlwZUN1c3RvbWVyPiB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHt0aGlzLmFwaVJvb3R9JHtTVFJJUEVfQVBJLnVwZGF0ZUN1c3RvbWVyfS8ke2N1c3RvbWVySWR9YCwge1xuICAgICAgbWV0aG9kOiAnUEFUQ0gnLFxuICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh1cGRhdGVzKSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byB1cGRhdGUgU3RyaXBlIGN1c3RvbWVyJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBjaGVja291dCBzZXNzaW9uIGZvciBzdWJzY3JpcHRpb25cbiAgICovXG4gIGFzeW5jIGNyZWF0ZUNoZWNrb3V0U2Vzc2lvbihwYXJhbXM6IENoZWNrb3V0U2Vzc2lvblBhcmFtcyk6IFByb21pc2U8eyBzZXNzaW9uSWQ6IHN0cmluZzsgdXJsOiBzdHJpbmcgfT4ge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7dGhpcy5hcGlSb290fSR7U1RSSVBFX0FQSS5jcmVhdGVTZXNzaW9ufWAsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHByaWNlSWQ6IHBhcmFtcy5wcmljZUlkLFxuICAgICAgICBjdXN0b21lcklkOiBwYXJhbXMuY3VzdG9tZXJJZCxcbiAgICAgICAgc3VjY2Vzc1VybDogcGFyYW1zLnN1Y2Nlc3NVcmwsXG4gICAgICAgIGNhbmNlbFVybDogcGFyYW1zLmNhbmNlbFVybCxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGNyZWF0ZSBjaGVja291dCBzZXNzaW9uJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBjdXN0b21lciBwb3J0YWwgc2Vzc2lvblxuICAgKi9cbiAgYXN5bmMgY3JlYXRlQ3VzdG9tZXJQb3J0YWxTZXNzaW9uKHBhcmFtczogQ3VzdG9tZXJQb3J0YWxQYXJhbXMpOiBQcm9taXNlPHsgdXJsOiBzdHJpbmcgfT4ge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7dGhpcy5hcGlSb290fSR7U1RSSVBFX0FQSS5jcmVhdGVQb3J0YWxTZXNzaW9ufWAsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGN1c3RvbWVySWQ6IHBhcmFtcy5jdXN0b21lcklkLFxuICAgICAgICByZXR1cm5Vcmw6IHBhcmFtcy5yZXR1cm5VcmwsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byBjcmVhdGUgcG9ydGFsIHNlc3Npb24nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBzdWJzY3JpcHRpb24gYnkgSURcbiAgICovXG4gIGFzeW5jIGdldFN1YnNjcmlwdGlvbihzdWJzY3JpcHRpb25JZDogc3RyaW5nKTogUHJvbWlzZTxTdHJpcGVTdWJzY3JpcHRpb24+IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke3RoaXMuYXBpUm9vdH0ke1NUUklQRV9BUEkuZ2V0U3Vic2NyaXB0aW9ufS8ke3N1YnNjcmlwdGlvbklkfWAsIHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byByZXRyaWV2ZSBzdWJzY3JpcHRpb24nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBzdWJzY3JpcHRpb25zIGZvciBhIGN1c3RvbWVyXG4gICAqL1xuICBhc3luYyBnZXRDdXN0b21lclN1YnNjcmlwdGlvbnMoY3VzdG9tZXJJZDogc3RyaW5nKTogUHJvbWlzZTx7IGRhdGE6IFN0cmlwZVN1YnNjcmlwdGlvbltdIH0+IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke3RoaXMuYXBpUm9vdH0ke1NUUklQRV9BUEkuZ2V0Q3VzdG9tZXJTdWJzY3JpcHRpb25zfS8ke2N1c3RvbWVySWR9YCwge1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgIH0pO1xuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnRmFpbGVkIHRvIHJldHJpZXZlIGN1c3RvbWVyIHN1YnNjcmlwdGlvbnMnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBzdWJzY3JpcHRpb25cbiAgICovXG4gIGFzeW5jIHVwZGF0ZVN1YnNjcmlwdGlvbihzdWJzY3JpcHRpb25JZDogc3RyaW5nLCBuZXdQcmljZUlkOiBzdHJpbmcpOiBQcm9taXNlPFN0cmlwZVN1YnNjcmlwdGlvbj4ge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7dGhpcy5hcGlSb290fSR7U1RSSVBFX0FQSS51cGRhdGVTdWJzY3JpcHRpb259LyR7c3Vic2NyaXB0aW9uSWR9YCwge1xuICAgICAgbWV0aG9kOiAnUEFUQ0gnLFxuICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHByaWNlSWQ6IG5ld1ByaWNlSWQsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byB1cGRhdGUgc3Vic2NyaXB0aW9uJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW5jZWwgc3Vic2NyaXB0aW9uXG4gICAqL1xuICBhc3luYyBjYW5jZWxTdWJzY3JpcHRpb24oc3Vic2NyaXB0aW9uSWQ6IHN0cmluZyk6IFByb21pc2U8eyBjYW5jZWxlZDogYm9vbGVhbiB9PiB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHt0aGlzLmFwaVJvb3R9JHtTVFJJUEVfQVBJLmNhbmNlbFN1YnNjcmlwdGlvbn0vJHtzdWJzY3JpcHRpb25JZH1gLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgIH0pO1xuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGNhbmNlbCBzdWJzY3JpcHRpb24nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGNoZWNrb3V0IHNlc3Npb24gYnkgSURcbiAgICovXG4gIGFzeW5jIHJldHJpZXZlU2Vzc2lvbihzZXNzaW9uSWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHt0aGlzLmFwaVJvb3R9JHtTVFJJUEVfQVBJLnJldHJpZXZlU2Vzc2lvbn0vJHtzZXNzaW9uSWR9YCwge1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgIH0pO1xuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnRmFpbGVkIHRvIHJldHJpZXZlIGNoZWNrb3V0IHNlc3Npb24nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFN0cmlwZSBjdXN0b21lciBvciByZXR1cm4gdGhlIGJpbGxpbmcgcG9ydGFsIFVSTFxuICAgKi9cbiAgYXN5bmMgY3JlYXRlU3RyaXBlQ3VzdG9tZXIoKTogUHJvbWlzZTx7IHVybDogc3RyaW5nIH0+IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke3RoaXMuYXBpUm9vdH0vYXBpL2NyZWF0ZS1zdHJpcGUtY3VzdG9tZXJgLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgIH0pO1xuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGNyZWF0ZS9saW5rIFN0cmlwZSBjdXN0b21lcicpO1xuICAgIH1cblxuICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gIH1cbn1cblxuLy8gRXhwb3J0IGEgc2luZ2xldG9uIGluc3RhbmNlIG9mIHRoZSBzZXJ2aWNlXG5jb25zdCBzdHJpcGVTZXJ2aWNlID0gbmV3IFN0cmlwZVNlcnZpY2UoKTtcbmV4cG9ydCBkZWZhdWx0IHN0cmlwZVNlcnZpY2U7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEplcmVtXFxcXERlc2t0b3BcXFxcU3RhcnRVcFxcXFxhaWxpdmVcXFxcbGl2ZS1jaGF0Ym90XFxcXHNyY1xcXFx1dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSmVyZW1cXFxcRGVza3RvcFxcXFxTdGFydFVwXFxcXGFpbGl2ZVxcXFxsaXZlLWNoYXRib3RcXFxcc3JjXFxcXHV0aWxzXFxcXHN1YnNjcmlwdGlvbkNvbnN0YW50cy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvSmVyZW0vRGVza3RvcC9TdGFydFVwL2FpbGl2ZS9saXZlLWNoYXRib3Qvc3JjL3V0aWxzL3N1YnNjcmlwdGlvbkNvbnN0YW50cy50c1wiOy8vIFN1YnNjcmlwdGlvbiBwbGFuIElEcyBpbiBvdXIgYXBwbGljYXRpb25cbmV4cG9ydCBjb25zdCBQTEFOX0lEUyA9IHtcbiAgRlJFRTogJzEnLFxuICBTVEFSVEVSOiAnMicsXG4gIFBSTzogJzMnLFxuICBFTlRFUlBSSVNFOiAnNCdcbn07XG5cbi8vIE1hcHBpbmcgYmV0d2VlbiBvdXIgYXBwJ3MgcGxhbiBJRHMgYW5kIFN0cmlwZSBwcmljZSBJRHNcbi8vIFRoZXNlIGFyZSBhY3R1YWwgdGVzdCBTdHJpcGUgcHJpY2UgSURzICh0aGUgc2FtZSBvbmVzIHVzZWQgcHJldmlvdXNseSBpbiBzdHJpcGUtc2VydmljZS50cylcbmV4cG9ydCBjb25zdCBQTEFOX1RPX1BSSUNFX01BUDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgLy8gRnJlZSBwbGFuIGRvZXNuJ3QgaGF2ZSBhIHByaWNlIElEXG4gIFtQTEFOX0lEUy5GUkVFXTogJycsXG4gIC8vIFRlc3QgcHJpY2UgSURzIGZvciBTdHJpcGVcbiAgW1BMQU5fSURTLlNUQVJURVJdOiAncHJpY2VfMVF6dVY0MDdTZXo5bTA2SjB4OUlVcWhSJywgICAvLyBTdGFydGVyIHBsYW5cbiAgW1BMQU5fSURTLlBST106ICdwcmljZV8xUXp1VkEwN1NlejltMDZKYk53SXpQY1YnLCAgICAgICAvLyBQcm8gcGxhblxuICBbUExBTl9JRFMuRU5URVJQUklTRV06ICdwcmljZV8xUXp1ZUEwN1NlejltMDZKa05nUUVqb0gnICAvLyBFbnRlcnByaXNlIHBsYW5cbn07XG5cbi8vIFJldmVyc2UgbWFwcGluZyBmb3IgbG9va2luZyB1cCBwbGFuIElEcyBmcm9tIHByaWNlIElEc1xuZXhwb3J0IGNvbnN0IFBSSUNFX1RPX1BMQU5fTUFQOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0gXG4gIE9iamVjdC5lbnRyaWVzKFBMQU5fVE9fUFJJQ0VfTUFQKS5yZWR1Y2UoKGFjYywgW3BsYW5JZCwgcHJpY2VJZF0pID0+IHtcbiAgICBpZiAocHJpY2VJZCkgYWNjW3ByaWNlSWRdID0gcGxhbklkO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9IGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4pO1xuXG4vLyBEZWZhdWx0IHByaWNpbmcgZGF0YVxuZXhwb3J0IGNvbnN0IFBMQU5fUFJJQ0lORyA9IHtcbiAgW1BMQU5fSURTLkZSRUVdOiB7XG4gICAgbW9udGhseTogMC4wMCxcbiAgICB5ZWFybHk6IDAuMDBcbiAgfSxcbiAgW1BMQU5fSURTLlNUQVJURVJdOiB7XG4gICAgbW9udGhseTogOS45OSxcbiAgICB5ZWFybHk6IDk5Ljk5ICAvLyB+MiBtb250aHMgZnJlZVxuICB9LFxuICBbUExBTl9JRFMuUFJPXToge1xuICAgIG1vbnRobHk6IDE5Ljk5LFxuICAgIHllYXJseTogMTk5Ljk5ICAvLyB+MiBtb250aHMgZnJlZVxuICB9LFxuICBbUExBTl9JRFMuRU5URVJQUklTRV06IHtcbiAgICBtb250aGx5OiA5OS45OSxcbiAgICB5ZWFybHk6IDk5OS45OSAgLy8gfjIgbW9udGhzIGZyZWVcbiAgfVxufTtcblxuLy8gUGxhbiBmZWF0dXJlcyBhbmQgbGltaXRzXG5leHBvcnQgY29uc3QgUExBTl9GRUFUVVJFUyA9IHtcbiAgW1BMQU5fSURTLkZSRUVdOiB7XG4gICAgYXBpQ2FsbHM6IDEwMCxcbiAgICBzdG9yYWdlOiAxMDAgKiAxMDI0ICogMTAyNCwgLy8gMTAwIE1CXG4gICAgbW9kZWxMaW1pdDogNSxcbiAgICBzdXBwb3J0TGV2ZWw6ICdlbWFpbCcsXG4gICAgY3VzdG9taXphdGlvbjogZmFsc2UsXG4gICAgYW5hbHl0aWNzOiBmYWxzZVxuICB9LFxuICBbUExBTl9JRFMuU1RBUlRFUl06IHtcbiAgICBhcGlDYWxsczogMTAwMCxcbiAgICBzdG9yYWdlOiA1MDAgKiAxMDI0ICogMTAyNCwgLy8gNTAwIE1CXG4gICAgbW9kZWxMaW1pdDogMjAsXG4gICAgc3VwcG9ydExldmVsOiAncHJpb3JpdHlfZW1haWwnLFxuICAgIGN1c3RvbWl6YXRpb246IHRydWUsXG4gICAgYW5hbHl0aWNzOiBmYWxzZVxuICB9LFxuICBbUExBTl9JRFMuUFJPXToge1xuICAgIGFwaUNhbGxzOiAxMDAwMCxcbiAgICBzdG9yYWdlOiAyICogMTAyNCAqIDEwMjQgKiAxMDI0LCAvLyAyIEdCXG4gICAgbW9kZWxMaW1pdDogNTAsXG4gICAgc3VwcG9ydExldmVsOiAnbGl2ZV9jaGF0JyxcbiAgICBjdXN0b21pemF0aW9uOiB0cnVlLFxuICAgIGFuYWx5dGljczogdHJ1ZVxuICB9LFxuICBbUExBTl9JRFMuRU5URVJQUklTRV06IHtcbiAgICBhcGlDYWxsczogMTAwMDAwLFxuICAgIHN0b3JhZ2U6IDEwICogMTAyNCAqIDEwMjQgKiAxMDI0LCAvLyAxMCBHQlxuICAgIG1vZGVsTGltaXQ6IDEwMCxcbiAgICBzdXBwb3J0TGV2ZWw6ICdkZWRpY2F0ZWQnLFxuICAgIGN1c3RvbWl6YXRpb246IHRydWUsXG4gICAgYW5hbHl0aWNzOiB0cnVlXG4gIH1cbn07XG5cbi8vIFBsYW4gbmFtZXNcbmV4cG9ydCBjb25zdCBQTEFOX05BTUVTID0ge1xuICBbUExBTl9JRFMuRlJFRV06ICdGcmVlJyxcbiAgW1BMQU5fSURTLlNUQVJURVJdOiAnU3RhcnRlcicsXG4gIFtQTEFOX0lEUy5QUk9dOiAnUHJvJyxcbiAgW1BMQU5fSURTLkVOVEVSUFJJU0VdOiAnRW50ZXJwcmlzZSdcbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEplcmVtXFxcXERlc2t0b3BcXFxcU3RhcnRVcFxcXFxhaWxpdmVcXFxcbGl2ZS1jaGF0Ym90XFxcXHNyY1xcXFx1dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSmVyZW1cXFxcRGVza3RvcFxcXFxTdGFydFVwXFxcXGFpbGl2ZVxcXFxsaXZlLWNoYXRib3RcXFxcc3JjXFxcXHV0aWxzXFxcXHN1YnNjcmlwdGlvbkhlbHBlcnMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0plcmVtL0Rlc2t0b3AvU3RhcnRVcC9haWxpdmUvbGl2ZS1jaGF0Ym90L3NyYy91dGlscy9zdWJzY3JpcHRpb25IZWxwZXJzLnRzXCI7aW1wb3J0IHsgUExBTl9JRFMsIFBMQU5fRkVBVFVSRVMsIFBMQU5fTkFNRVMgfSBmcm9tICcuL3N1YnNjcmlwdGlvbkNvbnN0YW50cyc7XG5cbi8qKlxuICogU3Vic2NyaXB0aW9uIHBsYW4gaGVscGVycyBhbmQgdXRpbGl0aWVzXG4gKiBUaGVzZSBmdW5jdGlvbnMgaGVscCBkZXRlcm1pbmUgZmVhdHVyZSBhY2Nlc3MgYmFzZWQgb24gc3Vic2NyaXB0aW9uIGxldmVsc1xuICovXG5cbi8vIERlZmluZSB0aGUgYXZhaWxhYmxlIHBsYW4gdHlwZXNcbmV4cG9ydCB0eXBlIFBsYW5UeXBlID0gJzEnIHwgJzInIHwgJzMnIHwgJzQnO1xuXG4vLyBQbGFuIGRldGFpbHMgbWFwcGluZ1xuZXhwb3J0IGNvbnN0IHBsYW5GZWF0dXJlczogUmVjb3JkPHN0cmluZywgRmVhdHVyZUFjY2Vzcz4gPSBQTEFOX0ZFQVRVUkVTO1xuXG4vLyBGZWF0dXJlIGFjY2VzcyBieSBwbGFuXG5leHBvcnQgaW50ZXJmYWNlIEZlYXR1cmVBY2Nlc3Mge1xuICBjaGF0TWVzc2FnZXM6IG51bWJlcjtcbiAgbW9kZWxBY2Nlc3M6IHN0cmluZ1tdO1xuICBhcGlDYWxsc0xpbWl0OiBudW1iZXI7XG4gIHN0b3JhZ2VMaW1pdDogbnVtYmVyOyAvLyBpbiBNQlxuICBjdXN0b21BcGlLZXlzOiBib29sZWFuO1xuICBhZHZhbmNlZEFuYWx5dGljczogYm9vbGVhbjtcbiAgdGVhbU1lbWJlcnM6IG51bWJlcjtcbiAgcHJpb3JpdHlTdXBwb3J0OiBib29sZWFuO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGEgdXNlcidzIHBsYW4gaGFzIGFjY2VzcyB0byBhIHNwZWNpZmljIGZlYXR1cmVcbiAqIEBwYXJhbSB1c2VyUGxhbklkIFRoZSB1c2VyJ3MgY3VycmVudCBwbGFuIElEXG4gKiBAcGFyYW0gcmVxdWlyZWRQbGFuSWQgVGhlIG1pbmltdW0gcGxhbiBJRCByZXF1aXJlZCBmb3IgdGhlIGZlYXR1cmVcbiAqIEByZXR1cm5zIEJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgdXNlciBoYXMgYWNjZXNzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNBY2Nlc3ModXNlclBsYW5JZDogc3RyaW5nIHwgbnVsbCwgcmVxdWlyZWRQbGFuSWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAvLyBJZiBubyB1c2VyIHBsYW4sIHRoZXkgb25seSBoYXZlIGFjY2VzcyB0byBGcmVlIHBsYW5cbiAgaWYgKCF1c2VyUGxhbklkKSByZXR1cm4gcmVxdWlyZWRQbGFuSWQgPT09IFBMQU5fSURTLkZSRUU7XG5cbiAgLy8gQ29udmVydCBwbGFuIElEcyB0byBudW1iZXJzIGZvciBjb21wYXJpc29uXG4gIGNvbnN0IHVzZXJQbGFuID0gcGFyc2VJbnQodXNlclBsYW5JZCk7XG4gIGNvbnN0IHJlcXVpcmVkUGxhbiA9IHBhcnNlSW50KHJlcXVpcmVkUGxhbklkKTtcblxuICAvLyBVc2VycyBoYXZlIGFjY2VzcyB0byB0aGVpciBwbGFuIGFuZCBiZWxvd1xuICByZXR1cm4gdXNlclBsYW4gPj0gcmVxdWlyZWRQbGFuO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGEgc3BlY2lmaWMgbW9kZWwgaXMgYXZhaWxhYmxlIGZvciBhIHVzZXIncyBwbGFuXG4gKiBAcGFyYW0gdXNlclBsYW5JZCBUaGUgdXNlcidzIGN1cnJlbnQgcGxhbiBJRFxuICogQHBhcmFtIG1vZGVsSWQgVGhlIG1vZGVsIHRvIGNoZWNrIGFjY2VzcyBmb3JcbiAqIEByZXR1cm5zIEJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgdXNlciBoYXMgYWNjZXNzIHRvIHRoZSBtb2RlbFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzTW9kZWxBY2Nlc3ModXNlclBsYW5JZDogc3RyaW5nIHwgbnVsbCwgbW9kZWxJZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIE1vZGVsIElEcyBjYW4gYmUgbWFwcGVkIHRvIHJlcXVpcmVkIHBsYW4gbGV2ZWxzXG4gIGNvbnN0IG1vZGVsVG9QbGFuTWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICdncHQtMy41LXR1cmJvJzogUExBTl9JRFMuRlJFRSxcbiAgICAndGV4dC1kYXZpbmNpLTAwMyc6IFBMQU5fSURTLkZSRUUsXG4gICAgJ2NsYXVkZS1pbnN0YW50LTEnOiBQTEFOX0lEUy5TVEFSVEVSLFxuICAgICdncHQtNCc6IFBMQU5fSURTLlBSTyxcbiAgICAnY2xhdWRlLTInOiBQTEFOX0lEUy5QUk8sXG4gICAgJ2dwdC00LXZpc2lvbic6IFBMQU5fSURTLkVOVEVSUFJJU0UsXG4gICAgJ2NsYXVkZS0zLW9wdXMnOiBQTEFOX0lEUy5FTlRFUlBSSVNFLFxuICB9O1xuXG4gIGNvbnN0IHJlcXVpcmVkUGxhbiA9IG1vZGVsVG9QbGFuTWFwW21vZGVsSWRdIHx8IFBMQU5fSURTLkZSRUU7XG4gIHJldHVybiBoYXNBY2Nlc3ModXNlclBsYW5JZCwgcmVxdWlyZWRQbGFuKTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHBsYW4gbmFtZSBmcm9tIHRoZSBwbGFuIElEXG4gKiBAcGFyYW0gcGxhbklkIFRoZSBwbGFuIElEXG4gKiBAcmV0dXJucyBUaGUgcGxhbiBuYW1lIGFzIGEgc3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGFuTmFtZShwbGFuSWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBQTEFOX05BTUVTW3BsYW5JZCBhcyBQbGFuVHlwZV0gfHwgJ1Vua25vd24gUGxhbic7XG59XG5cbi8qKlxuICogR2V0IHRoZSBuZXh0IHVwZ3JhZGUgcGxhbiBmb3IgYSBnaXZlbiBwbGFuXG4gKiBAcGFyYW0gY3VycmVudFBsYW5JZCBUaGUgY3VycmVudCBwbGFuIElEXG4gKiBAcmV0dXJucyBUaGUgbmV4dCBwbGFuIElEIG9yIG51bGwgaWYgYWxyZWFkeSBhdCBoaWdoZXN0IHBsYW5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5leHRQbGFuKGN1cnJlbnRQbGFuSWQ6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBwbGFuSWRzID0gT2JqZWN0LnZhbHVlcyhQTEFOX0lEUyk7XG4gIGNvbnN0IGN1cnJlbnRJbmRleCA9IHBsYW5JZHMuaW5kZXhPZihjdXJyZW50UGxhbklkKTtcbiAgXG4gIGlmIChjdXJyZW50SW5kZXggPT09IC0xIHx8IGN1cnJlbnRJbmRleCA9PT0gcGxhbklkcy5sZW5ndGggLSAxKSB7XG4gICAgcmV0dXJuIG51bGw7IC8vIE5vIG5leHQgcGxhbiBpZiBjdXJyZW50IHBsYW4gbm90IGZvdW5kIG9yIGFscmVhZHkgYXQgaGlnaGVzdCBwbGFuXG4gIH1cbiAgXG4gIHJldHVybiBwbGFuSWRzW2N1cnJlbnRJbmRleCArIDFdO1xufVxuXG4vKipcbiAqIEZvcm1hdCBzdG9yYWdlIHNpemVzIGluIGEgaHVtYW4tcmVhZGFibGUgZm9ybWF0XG4gKiBAcGFyYW0gYnl0ZXMgU2l6ZSBpbiBieXRlc1xuICogQHJldHVybnMgRm9ybWF0dGVkIHN0cmluZyB3aXRoIGFwcHJvcHJpYXRlIHVuaXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFN0b3JhZ2VTaXplKGJ5dGVzOiBudW1iZXIpOiBzdHJpbmcge1xuICBjb25zdCB1bml0cyA9IFsnQicsICdLQicsICdNQicsICdHQicsICdUQiddO1xuICBsZXQgc2l6ZSA9IGJ5dGVzO1xuICBsZXQgdW5pdEluZGV4ID0gMDtcbiAgXG4gIHdoaWxlIChzaXplID49IDEwMjQgJiYgdW5pdEluZGV4IDwgdW5pdHMubGVuZ3RoIC0gMSkge1xuICAgIHNpemUgLz0gMTAyNDtcbiAgICB1bml0SW5kZXgrKztcbiAgfVxuICBcbiAgcmV0dXJuIGAke3NpemUudG9GaXhlZCgyKX0gJHt1bml0c1t1bml0SW5kZXhdfWA7XG59XG5cbi8qKlxuICogR2V0IHRoZSBmZWF0dXJlIGxpbWl0IGZvciBhIHNwZWNpZmljIHBsYW4gYW5kIGZlYXR1cmVcbiAqIEBwYXJhbSBwbGFuSWQgVGhlIHBsYW4gSURcbiAqIEBwYXJhbSBmZWF0dXJlIFRoZSBmZWF0dXJlIHRvIGdldCB0aGUgbGltaXQgZm9yXG4gKiBAcmV0dXJucyBUaGUgbGltaXQgdmFsdWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZlYXR1cmVMaW1pdChwbGFuSWQ6IHN0cmluZywgZmVhdHVyZU5hbWU6IGtleW9mIHR5cGVvZiBQTEFOX0ZFQVRVUkVTW1BsYW5UeXBlXSk6IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4ge1xuICBpZiAoIXBsYW5JZCB8fCAhUExBTl9GRUFUVVJFU1twbGFuSWQgYXMgUGxhblR5cGVdKSB7XG4gICAgcmV0dXJuIFBMQU5fRkVBVFVSRVNbUExBTl9JRFMuRlJFRV1bZmVhdHVyZU5hbWVdO1xuICB9XG4gIFxuICByZXR1cm4gUExBTl9GRUFUVVJFU1twbGFuSWQgYXMgUGxhblR5cGVdW2ZlYXR1cmVOYW1lXTtcbn1cbiIsICJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCwgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgVXNlciwgY3JlYXRlQ2xpZW50LCBTdXBhYmFzZUNsaWVudCB9IGZyb20gJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcyc7XHJcbmltcG9ydCB7IFxyXG4gIGhhc0FjY2VzcyBhcyBjaGVja0FjY2VzcywgXHJcbiAgaGFzTW9kZWxBY2Nlc3MsIFxyXG4gIGdldFBsYW5OYW1lLCBcclxuICBnZXRGZWF0dXJlTGltaXQsIFxyXG4gIGZvcm1hdFN0b3JhZ2VTaXplLFxyXG4gIGdldE5leHRQbGFuLFxyXG4gIFBsYW5UeXBlXHJcbn0gZnJvbSAnLi4vdXRpbHMvc3Vic2NyaXB0aW9uSGVscGVycyc7XHJcbmltcG9ydCBzdHJpcGVTZXJ2aWNlIGZyb20gJy4uL2FwaS9zdHJpcGUtc2VydmljZSc7XHJcbmltcG9ydCB7IFBMQU5fSURTLCBQTEFOX1RPX1BSSUNFX01BUCwgUFJJQ0VfVE9fUExBTl9NQVAgfSBmcm9tICcuLi91dGlscy9zdWJzY3JpcHRpb25Db25zdGFudHMnO1xyXG5cclxuLy8gRGVmaW5lIHRpcG9zIHBhcmEgbGFzIHN1c2NyaXBjaW9uZXNcclxuZXhwb3J0IHR5cGUgU3Vic2NyaXB0aW9uUGxhbiA9IHtcclxuICBpZDogc3RyaW5nO1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIHByaWNlX21vbnRobHk/OiBudW1iZXI7XHJcbiAgcHJpY2VfeWVhcmx5PzogbnVtYmVyO1xyXG4gIGJpbGxpbmdfY3ljbGU6IHN0cmluZztcclxuICBmZWF0dXJlczogYW55O1xyXG4gIGNyZWF0ZWRfYXQ6IHN0cmluZztcclxuICB1cGRhdGVkX2F0OiBzdHJpbmc7XHJcbn07XHJcblxyXG5leHBvcnQgdHlwZSBTdWJzY3JpcHRpb24gPSB7XHJcbiAgaWQ6IHN0cmluZztcclxuICB1c2VyX2lkOiBzdHJpbmc7XHJcbiAgcGxhbl9pZDogc3RyaW5nO1xyXG4gIHN0YXR1czogc3RyaW5nO1xyXG4gIHN0YXJ0X2RhdGU6IHN0cmluZztcclxuICBlbmRfZGF0ZTogc3RyaW5nIHwgbnVsbDtcclxuICBjdXJyZW50X3BlcmlvZF9zdGFydD86IHN0cmluZztcclxuICBjdXJyZW50X3BlcmlvZF9lbmQ/OiBzdHJpbmc7XHJcbiAgc3Vic2NyaXB0aW9uX2lkPzogc3RyaW5nOyAvLyBTdHJpcGUgc3Vic2NyaXB0aW9uIElEXHJcbiAgY2FuY2VsZWRfYXQ/OiBzdHJpbmc7XHJcbiAgY2FuY2VsX2F0X3BlcmlvZF9lbmQ/OiBib29sZWFuO1xyXG4gIGNyZWF0ZWRfYXQ6IHN0cmluZztcclxuICB1cGRhdGVkX2F0OiBzdHJpbmc7XHJcbn07XHJcblxyXG5leHBvcnQgdHlwZSBVc2FnZVN0YXRzID0ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgdXNlcl9pZDogc3RyaW5nO1xyXG4gIGFwaV9jYWxsczogbnVtYmVyO1xyXG4gIHN0b3JhZ2VfdXNlZDogbnVtYmVyO1xyXG4gIGxhc3RfYWN0aXZlOiBzdHJpbmc7XHJcbiAgY3JlYXRlZF9hdDogc3RyaW5nO1xyXG4gIHVwZGF0ZWRfYXQ6IHN0cmluZztcclxufTtcclxuXHJcbnR5cGUgUHJvZmlsZSA9IHtcclxuICBpZDogc3RyaW5nO1xyXG4gIHVzZXJuYW1lOiBzdHJpbmcgfCBudWxsO1xyXG4gIGF2YXRhcl91cmw6IHN0cmluZyB8IG51bGw7XHJcbiAgc3RyaXBlX2N1c3RvbWVyX2lkPzogc3RyaW5nO1xyXG4gIGVtYWlsPzogc3RyaW5nO1xyXG4gIGRpc3BsYXlfbmFtZT86IHN0cmluZztcclxufTtcclxuXHJcbi8vIERlZmluZSB0aXBvIHBhcmEgZWwgY29udGV4dG8gZGUgYXV0ZW50aWNhY2lcdTAwRjNuXHJcbnR5cGUgQXV0aENvbnRleHRUeXBlID0ge1xyXG4gIHVzZXI6IFVzZXIgfCBudWxsO1xyXG4gIHByb2ZpbGU6IFByb2ZpbGUgfCBudWxsO1xyXG4gIHVzZXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiB8IG51bGw7XHJcbiAgdXNhZ2VTdGF0czogVXNhZ2VTdGF0cyB8IG51bGw7XHJcbiAgYXZhaWxhYmxlUGxhbnM6IFN1YnNjcmlwdGlvblBsYW5bXTtcclxuICBzaWduSW46IChlbWFpbDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSA9PiBQcm9taXNlPHsgZGF0YT86IGFueTsgZXJyb3I/OiBhbnkgfT47XHJcbiAgc2lnblVwOiAoZW1haWw6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgdXNlcm5hbWU/OiBzdHJpbmcpID0+IFByb21pc2U8eyB1c2VyPzogYW55OyBlcnJvcj86IGFueSB9PjtcclxuICBzaWduT3V0OiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG4gIHVwZGF0ZVByb2ZpbGU6ICh1cGRhdGVzOiBQYXJ0aWFsPFByb2ZpbGU+KSA9PiBQcm9taXNlPHsgZXJyb3I6IGFueSB8IG51bGwgfT47XHJcbiAgcmVzZXRQYXNzd29yZDogKGVtYWlsOiBzdHJpbmcpID0+IFByb21pc2U8eyBlcnJvcjogYW55IHwgbnVsbCB9PjtcclxuICB1cGRhdGVQYXNzd29yZDogKG5ld1Bhc3N3b3JkOiBzdHJpbmcsIGFjY2Vzc1Rva2VuOiBzdHJpbmcpID0+IFByb21pc2U8eyBlcnJvcjogYW55IHwgbnVsbCB9PjtcclxuICB1cGRhdGVTdWJzY3JpcHRpb246IChwbGFuSWQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcclxuICBjYW5jZWxTdWJzY3JpcHRpb246ICgpID0+IFByb21pc2U8dm9pZD47XHJcbiAgaW5jcmVtZW50QXBpVXNhZ2U6ICgpID0+IFByb21pc2U8dm9pZD47XHJcbiAgYWRkU3RvcmFnZVVzYWdlOiAoYnl0ZXNBZGRlZDogbnVtYmVyKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG4gIGhhc0FjY2VzczogKHJlcXVpcmVkUGxhbklkOiBzdHJpbmcpID0+IGJvb2xlYW47XHJcbiAgaGFzTW9kZWxBY2Nlc3M6IChtb2RlbElkOiBzdHJpbmcpID0+IGJvb2xlYW47XHJcbiAgZ2V0UGxhbk5hbWU6IChwbGFuSWQ6IHN0cmluZykgPT4gc3RyaW5nO1xyXG4gIHJlZnJlc2hTdWJzY3JpcHRpb25EYXRhOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG4gIGlzTG9hZGluZzogYm9vbGVhbjtcclxuICBzdXBhYmFzZTogU3VwYWJhc2VDbGllbnQ7XHJcbiAgc3RyaXBlQ3VzdG9tZXJJZDogc3RyaW5nIHwgbnVsbDtcclxuICBpc0xvZ2luT3BlbjogYm9vbGVhbjtcclxuICBzZXRJc0xvZ2luT3BlbjogKGlzT3BlbjogYm9vbGVhbikgPT4gdm9pZDtcclxuICByZWRpcmVjdFRvQ2hlY2tvdXQ6IChwbGFuSWQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcclxuICByZWRpcmVjdFRvQ3VzdG9tZXJQb3J0YWw6ICgpID0+IFByb21pc2U8dm9pZD47XHJcbiAgbG9nb3V0OiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG4gIGNyZWF0ZVN0cmlwZUN1c3RvbWVyOiAoKSA9PiBQcm9taXNlPHsgdXJsOiBzdHJpbmcgfT47XHJcbn07XHJcblxyXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8QXV0aENvbnRleHRUeXBlIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpO1xyXG5cclxuLy8gQ3JlYXRlIFN1cGFiYXNlIGNsaWVudFxyXG5jb25zdCBzdXBhYmFzZVVybCA9IChpbXBvcnQubWV0YSBhcyBhbnkpLmVudi5WSVRFX1NVUEFCQVNFX1VSTDtcclxuY29uc3Qgc3VwYWJhc2VLZXkgPSAoaW1wb3J0Lm1ldGEgYXMgYW55KS5lbnYuVklURV9TVVBBQkFTRV9LRVk7XHJcblxyXG5pZiAoIXN1cGFiYXNlVXJsIHx8ICFzdXBhYmFzZUtleSkge1xyXG4gIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBWSVRFX1NVUEFCQVNFX1VSTCBvciBWSVRFX1NVUEFCQVNFX0tFWSBlbnZpcm9ubWVudCB2YXJpYWJsZXMuJyk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudChzdXBhYmFzZVVybCwgc3VwYWJhc2VLZXkpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhQcm92aWRlcih7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSB7XHJcbiAgY29uc3QgW3VzZXIsIHNldFVzZXJdID0gdXNlU3RhdGU8VXNlciB8IG51bGw+KCgpID0+IHtcclxuICBjb25zdCBzZXNzaW9uID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3N1cGFiYXNlLmF1dGguc2Vzc2lvbicpO1xyXG4gIHJldHVybiBzZXNzaW9uID8gSlNPTi5wYXJzZShzZXNzaW9uKS51c2VyIDogbnVsbDtcclxufSk7XHJcbiAgY29uc3QgW3Byb2ZpbGUsIHNldFByb2ZpbGVdID0gdXNlU3RhdGU8UHJvZmlsZSB8IG51bGw+KG51bGwpO1xyXG4gIGNvbnN0IFt1c2VyU3Vic2NyaXB0aW9uLCBzZXRVc2VyU3Vic2NyaXB0aW9uXSA9IHVzZVN0YXRlPFN1YnNjcmlwdGlvbiB8IG51bGw+KG51bGwpO1xyXG4gIGNvbnN0IFt1c2FnZVN0YXRzLCBzZXRVc2FnZVN0YXRzXSA9IHVzZVN0YXRlPFVzYWdlU3RhdHMgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbYXZhaWxhYmxlUGxhbnMsIHNldEF2YWlsYWJsZVBsYW5zXSA9IHVzZVN0YXRlPFN1YnNjcmlwdGlvblBsYW5bXT4oW10pO1xyXG4gIGNvbnN0IFtpc0xvYWRpbmcsIHNldElzTG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICBjb25zdCBbc3RyaXBlQ3VzdG9tZXJJZCwgc2V0U3RyaXBlQ3VzdG9tZXJJZF0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbaXNMb2dpbk9wZW4sIHNldElzTG9naW5PcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgLy8gSW5pY2lhbGl6YXIgeSBlc2N1Y2hhciBjYW1iaW9zIGRlIGF1dGVudGljYWNpXHUwMEYzblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBhc3luYyBmdW5jdGlvbiBnZXRJbml0aWFsU2Vzc2lvbigpIHtcclxuICAgICAgc2V0SXNMb2FkaW5nKHRydWUpO1xyXG4gICAgICBcclxuICAgICAgLy8gQ29tcHJvYmFyIHNpIGhheSB1bmEgc2VzaVx1MDBGM24gYWN0aXZhXHJcbiAgICAgIGNvbnN0IHsgZGF0YTogc2Vzc2lvbkRhdGEgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0U2Vzc2lvbigpO1xyXG4gICAgICBcclxuICAgICAgaWYgKHNlc3Npb25EYXRhICYmIHNlc3Npb25EYXRhPy5zZXNzaW9uPy51c2VyKSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzdXBhYmFzZS5hdXRoLnNlc3Npb24nLCBKU09OLnN0cmluZ2lmeShzZXNzaW9uRGF0YS5zZXNzaW9uKSk7XHJcbiAgICAgICAgc2V0VXNlcihzZXNzaW9uRGF0YS5zZXNzaW9uLnVzZXIpO1xyXG4gICAgICAgIGF3YWl0IGxvYWRVc2VyRGF0YShzZXNzaW9uRGF0YS5zZXNzaW9uLnVzZXIuaWQpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBTdXNjcmliaXJzZSBhIGNhbWJpb3MgZGUgYXV0ZW50aWNhY2lcdTAwRjNuXHJcbiAgICAgIGNvbnN0IHsgZGF0YTogYXV0aExpc3RlbmVyIH0gPSBzdXBhYmFzZS5hdXRoLm9uQXV0aFN0YXRlQ2hhbmdlKGFzeW5jIChldmVudCwgc2Vzc2lvbikgPT4ge1xyXG4gICAgICAgIGlmIChldmVudCA9PT0gJ1NJR05FRF9JTicgJiYgc2Vzc2lvbj8udXNlcikge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzdXBhYmFzZS5hdXRoLnNlc3Npb24nLCBKU09OLnN0cmluZ2lmeShzZXNzaW9uKSk7XHJcbiAgICAgICAgICBzZXRVc2VyKHNlc3Npb24udXNlcik7XHJcbiAgICAgICAgICBhd2FpdCBsb2FkVXNlckRhdGEoc2Vzc2lvbi51c2VyLmlkKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSAnU0lHTkVEX09VVCcpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnc3VwYWJhc2UuYXV0aC5zZXNzaW9uJyk7XHJcbiAgICAgICAgICBzZXRVc2VyKG51bGwpO1xyXG4gICAgICAgICAgc2V0UHJvZmlsZShudWxsKTtcclxuICAgICAgICAgIHNldFVzZXJTdWJzY3JpcHRpb24obnVsbCk7XHJcbiAgICAgICAgICBzZXRVc2FnZVN0YXRzKG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBDYXJnYXIgcGxhbmVzIGRpc3BvbmlibGVzXHJcbiAgICAgIC8vIGF3YWl0IGxvYWRBdmFpbGFibGVQbGFucygpO1xyXG4gICAgICBcclxuICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgYXV0aExpc3RlbmVyLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRJbml0aWFsU2Vzc2lvbigpO1xyXG4gIH0sIFtdKTtcclxuICBcclxuICAvLyBDYXJnYXIgZGF0b3MgZGVsIHVzdWFyaW8gKHBlcmZpbCwgc3VzY3JpcGNpXHUwMEYzbiwgdXNvKVxyXG4gIGFzeW5jIGZ1bmN0aW9uIGxvYWRVc2VyRGF0YSh1c2VySWQ6IHN0cmluZykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gQ2FyZ2FyIHBlcmZpbFxyXG4gICAgICAvLyBjb25zdCB7IGRhdGE6IHByb2ZpbGVEYXRhLCBlcnJvcjogcHJvZmlsZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAvLyAgIC5mcm9tKCdwcm9maWxlcycpXHJcbiAgICAgIC8vICAgLnNlbGVjdCgnKicsIHsgaGVhZDogZmFsc2UsIGNvdW50OiBudWxsIH0pXHJcbiAgICAgIC8vICAgLmVxKCdpZCcsIHVzZXJJZClcclxuICAgICAgLy8gICAuc2luZ2xlKCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBpZiAocHJvZmlsZUVycm9yKSB7XHJcbiAgICAgIC8vICAgY29uc29sZS5lcnJvcignRXJyb3IgY2FyZ2FuZG8gZWwgcGVyZmlsOicsIHByb2ZpbGVFcnJvcik7XHJcbiAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgIC8vICAgc2V0UHJvZmlsZShwcm9maWxlRGF0YSk7XHJcbiAgICAgICAgXHJcbiAgICAgIC8vICAgLy8gTG9hZCBTdHJpcGUgY3VzdG9tZXIgSUQgaWYgaXQgZXhpc3RzXHJcbiAgICAgIC8vICAgaWYgKHByb2ZpbGVEYXRhLnN0cmlwZV9jdXN0b21lcl9pZCkge1xyXG4gICAgICAvLyAgICAgc2V0U3RyaXBlQ3VzdG9tZXJJZChwcm9maWxlRGF0YS5zdHJpcGVfY3VzdG9tZXJfaWQpO1xyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gfVxyXG4gICAgICBcclxuICAgICAgLy8gQ2FyZ2FyIHN1c2NyaXBjaVx1MDBGM25cclxuICAgICAgY29uc3QgeyBkYXRhOiBzdWJzY3JpcHRpb25EYXRhLCBlcnJvcjogc3Vic2NyaXB0aW9uRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgICAgLmZyb20oJ3N1YnNjcmlwdGlvbnMnKVxyXG4gICAgICAgIC5zZWxlY3QoJyonKVxyXG4gICAgICAgIC5lcSgndXNlcl9pZCcsIHVzZXJJZClcclxuICAgICAgICAuZXEoJ3N0YXR1cycsICdhY3RpdmUnKVxyXG4gICAgICAgIC5vcmRlcignY3JlYXRlZF9hdCcsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KVxyXG4gICAgICAgIC5saW1pdCgxKVxyXG4gICAgICAgIC5zaW5nbGUoKTtcclxuICAgICAgXHJcbiAgICAgIGlmIChzdWJzY3JpcHRpb25FcnJvciAmJiBzdWJzY3JpcHRpb25FcnJvci5jb2RlICE9PSAnUEdSU1QxMTYnKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgY2FyZ2FuZG8gbGEgc3VzY3JpcGNpXHUwMEYzbjonLCBzdWJzY3JpcHRpb25FcnJvcik7XHJcbiAgICAgIH0gZWxzZSBpZiAoc3Vic2NyaXB0aW9uRGF0YSkge1xyXG4gICAgICAgIHNldFVzZXJTdWJzY3JpcHRpb24oc3Vic2NyaXB0aW9uRGF0YSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gU2kgbm8gaGF5IHN1c2NyaXBjaVx1MDBGM24gYWN0aXZhLCBhc2lnbmFyIHBsYW4gZ3JhdHVpdG8gcG9yIGRlZmVjdG9cclxuICAgICAgICBjb25zdCB7IGRhdGE6IG5ld1N1YnNjcmlwdGlvbiwgZXJyb3I6IGNyZWF0ZVN1YkVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAgICAgLmZyb20oJ3N1YnNjcmlwdGlvbnMnKVxyXG4gICAgICAgICAgLmluc2VydCh7XHJcbiAgICAgICAgICAgIHVzZXJfaWQ6IHVzZXJJZCxcclxuICAgICAgICAgICAgcGxhbl9pZDogJzEnLCAvLyBQbGFuIGdyYXR1aXRvXHJcbiAgICAgICAgICAgIHN0YXR1czogJ2FjdGl2ZScsXHJcbiAgICAgICAgICAgIHN0YXJ0X2RhdGU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5zZWxlY3QoKVxyXG4gICAgICAgICAgLnNpbmdsZSgpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgaWYgKGNyZWF0ZVN1YkVycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjcmVhbmRvIHN1c2NyaXBjaVx1MDBGM24gcG9yIGRlZmVjdG86JywgY3JlYXRlU3ViRXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZXRVc2VyU3Vic2NyaXB0aW9uKG5ld1N1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBDYXJnYXIgZXN0YWRcdTAwRURzdGljYXMgZGUgdXNvXHJcbiAgICAgIC8vIGNvbnN0IHsgZGF0YTogdXNhZ2VEYXRhLCBlcnJvcjogdXNhZ2VFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLy8gICAuZnJvbSgndXNhZ2Vfc3RhdHMnKVxyXG4gICAgICAvLyAgIC5zZWxlY3QoJyonKVxyXG4gICAgICAvLyAgIC5lcSgndXNlcl9pZCcsIHVzZXJJZClcclxuICAgICAgLy8gICAuc2luZ2xlKCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBpZiAodXNhZ2VFcnJvciAmJiB1c2FnZUVycm9yLmNvZGUgIT09ICdQR1JTVDExNicpIHtcclxuICAgICAgLy8gICBjb25zb2xlLmVycm9yKCdFcnJvciBjYXJnYW5kbyBlc3RhZFx1MDBFRHN0aWNhcyBkZSB1c286JywgdXNhZ2VFcnJvcik7XHJcbiAgICAgIC8vIH0gZWxzZSBpZiAodXNhZ2VEYXRhKSB7XHJcbiAgICAgIC8vICAgc2V0VXNhZ2VTdGF0cyh1c2FnZURhdGEpO1xyXG4gICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAvLyAgIC8vIFNpIG5vIGhheSBlc3RhZFx1MDBFRHN0aWNhcywgY3JlYXIgbnVldmFzXHJcbiAgICAgIC8vICAgY29uc3QgeyBkYXRhOiBuZXdVc2FnZSwgZXJyb3I6IGNyZWF0ZVVzYWdlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgIC8vICAgICAuZnJvbSgndXNhZ2Vfc3RhdHMnKVxyXG4gICAgICAvLyAgICAgLmluc2VydCh7XHJcbiAgICAgIC8vICAgICAgIHVzZXJfaWQ6IHVzZXJJZCxcclxuICAgICAgLy8gICAgICAgYXBpX2NhbGxzOiAwLFxyXG4gICAgICAvLyAgICAgICBzdG9yYWdlX3VzZWQ6IDAsXHJcbiAgICAgIC8vICAgICAgIGxhc3RfYWN0aXZlOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcclxuICAgICAgLy8gICAgIH0pXHJcbiAgICAgIC8vICAgICAuc2VsZWN0KClcclxuICAgICAgLy8gICAgIC5zaW5nbGUoKTtcclxuICAgICAgICAgIFxyXG4gICAgICAvLyAgIGlmIChjcmVhdGVVc2FnZUVycm9yKSB7XHJcbiAgICAgIC8vICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjcmVhbmRvIGVzdGFkXHUwMEVEc3RpY2FzIGRlIHVzbzonLCBjcmVhdGVVc2FnZUVycm9yKTtcclxuICAgICAgLy8gICB9IGVsc2Uge1xyXG4gICAgICAvLyAgICAgc2V0VXNhZ2VTdGF0cyhuZXdVc2FnZSk7XHJcbiAgICAgIC8vICAgfVxyXG4gICAgICAvLyB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjYXJnYW5kbyBkYXRvcyBkZSB1c3VhcmlvOicsIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLy8gQ2FyZ2FyIHBsYW5lcyBkaXNwb25pYmxlc1xyXG4gIC8vIGFzeW5jIGZ1bmN0aW9uIGxvYWRBdmFpbGFibGVQbGFucygpIHtcclxuICAvLyAgIHRyeSB7XHJcbiAgLy8gICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgLy8gICAgICAgLmZyb20oJ3N1YnNjcmlwdGlvbl9wbGFucycpXHJcbiAgLy8gICAgICAgLnNlbGVjdCgnKicpXHJcbiAgLy8gICAgICAgLy8gLm9yZGVyKCdwcmljZV9tb250aGx5JywgeyBhc2NlbmRpbmc6IHRydWUgfSk7XHJcbiAgICAgICAgXHJcbiAgLy8gICAgIGlmIChlcnJvcikge1xyXG4gIC8vICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNhcmdhbmRvIHBsYW5lczonLCBlcnJvcik7XHJcbiAgLy8gICAgIH0gZWxzZSB7XHJcbiAgLy8gICAgICAgc2V0QXZhaWxhYmxlUGxhbnMoZGF0YSB8fCBbXSk7XHJcbiAgLy8gICAgIH1cclxuICAvLyAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgLy8gICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNhcmdhbmRvIHBsYW5lcyBkaXNwb25pYmxlczonLCBlcnJvcik7XHJcbiAgLy8gICB9XHJcbiAgLy8gfVxyXG4gIFxyXG4gIC8vIEluaWNpYXIgc2VzaVx1MDBGM25cclxuICBhc3luYyBmdW5jdGlvbiBzaWduSW4oZW1haWw6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5zaWduSW5XaXRoUGFzc3dvcmQoe1xyXG4gICAgICAgIGVtYWlsLFxyXG4gICAgICAgIHBhc3N3b3JkXHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgaWYgKGVycm9yKSByZXR1cm4geyBlcnJvciB9O1xyXG4gICAgICByZXR1cm4geyBkYXRhIH07XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkdXJhbnRlIGVsIGluaWNpbyBkZSBzZXNpXHUwMEYzbjonLCBlcnJvcik7XHJcbiAgICAgIHJldHVybiB7IGVycm9yIH07XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC8vIENlcnJhciBzZXNpXHUwMEYzblxyXG4gIGFzeW5jIGZ1bmN0aW9uIHNpZ25PdXQoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCBzdXBhYmFzZS5hdXRoLnNpZ25PdXQoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGR1cmFudGUgZWwgY2llcnJlIGRlIHNlc2lcdTAwRjNuOicsIGVycm9yKTtcclxuICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC8vIFJlZ2lzdHJhcnNlXHJcbiAgYXN5bmMgZnVuY3Rpb24gc2lnblVwKGVtYWlsOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHVzZXJuYW1lPzogc3RyaW5nKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLnNpZ25VcCh7XHJcbiAgICAgICAgZW1haWwsXHJcbiAgICAgICAgcGFzc3dvcmQsXHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgaWYgKGVycm9yKSByZXR1cm4geyBlcnJvciB9O1xyXG4gICAgICBcclxuICAgICAgaWYgKGRhdGE/LnVzZXIpIHtcclxuICAgICAgICAvLyBDcmVhdGUgcHJvZmlsZSB3aXRoIHVzZXJuYW1lIGlmIHByb3ZpZGVkXHJcbiAgICAgICAgLy8gaWYgKHVzZXJuYW1lKSB7XHJcbiAgICAgICAgLy8gICBjb25zdCB7IGVycm9yOiBwcm9maWxlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgICAgLy8gICAgIC5mcm9tKCdwcm9maWxlcycpXHJcbiAgICAgICAgLy8gICAgIC51cGRhdGUoeyB1c2VybmFtZSB9KVxyXG4gICAgICAgIC8vICAgICAuZXEoJ2lkJywgZGF0YS51c2VyLmlkKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgLy8gICBpZiAocHJvZmlsZUVycm9yKSB7XHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHVwZGF0aW5nIHByb2ZpbGUgd2l0aCB1c2VybmFtZTonLCBwcm9maWxlRXJyb3IpO1xyXG4gICAgICAgIC8vICAgfVxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4geyB1c2VyOiBkYXRhLnVzZXIgfTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgcmV0dXJuIHsgZXJyb3I6IG5ldyBFcnJvcignUmVnaXN0cmF0aW9uIGZhaWxlZCcpIH07XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkdXJhbnRlIGVsIHJlZ2lzdHJvOicsIGVycm9yKTtcclxuICAgICAgcmV0dXJuIHsgZXJyb3IgfTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLy8gQWN0dWFsaXphciBwZXJmaWwgZGVsIHVzdWFyaW9cclxuICBhc3luYyBmdW5jdGlvbiB1cGRhdGVQcm9maWxlKHVwZGF0ZXM6IFBhcnRpYWw8UHJvZmlsZT4pIHtcclxuICAgIGlmICghdXNlcikgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRoZW50aWNhdGVkIHVzZXInKTtcclxuICAgIFxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgYXV0aFVwZGF0ZXM6IGFueSA9IHt9O1xyXG4gICAgICBjb25zdCBwcm9maWxlVXBkYXRlczogYW55ID0ge307XHJcbiAgXHJcbiAgICAgIC8vIE9ubHkgaW5jbHVkZSBlbWFpbCBpbiBhdXRoIHVwZGF0ZSBpZiBpdCdzIGNoYW5nZWRcclxuICAgICAgaWYgKHVwZGF0ZXMuZW1haWwpIHtcclxuICAgICAgICBhdXRoVXBkYXRlcy5lbWFpbCA9IHVwZGF0ZXMuZW1haWw7XHJcbiAgICAgICAgcHJvZmlsZVVwZGF0ZXMuZW1haWwgPSB1cGRhdGVzLmVtYWlsO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8vIE9ubHkgaW5jbHVkZSB1c2VybmFtZSBpbiB1c2VyIG1ldGFkYXRhIGlmIGl0J3MgY2hhbmdlZFxyXG4gICAgICBpZiAodXBkYXRlcy51c2VybmFtZSkge1xyXG4gICAgICAgIGlmICghYXV0aFVwZGF0ZXMuZGF0YSkgYXV0aFVwZGF0ZXMuZGF0YSA9IHt9O1xyXG4gICAgICAgIGF1dGhVcGRhdGVzLmRhdGEudXNlcm5hbWUgPSB1cGRhdGVzLnVzZXJuYW1lO1xyXG4gICAgICAgIHByb2ZpbGVVcGRhdGVzLnVzZXJuYW1lID0gdXBkYXRlcy51c2VybmFtZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHVwZGF0ZXMuZGlzcGxheV9uYW1lKSB7XHJcbiAgICAgICAgaWYgKCFhdXRoVXBkYXRlcy5kYXRhKSBhdXRoVXBkYXRlcy5kYXRhID0ge307XHJcbiAgICAgICAgYXV0aFVwZGF0ZXMuZGF0YS5kaXNwbGF5X25hbWUgPSB1cGRhdGVzLmRpc3BsYXlfbmFtZTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvLyBPbmx5IGluY2x1ZGUgYXZhdGFyX3VybCBpbiB1c2VyIG1ldGFkYXRhIGlmIGl0J3MgY2hhbmdlZFxyXG4gICAgICBpZiAodXBkYXRlcy5hdmF0YXJfdXJsKSB7XHJcbiAgICAgICAgaWYgKCFhdXRoVXBkYXRlcy5kYXRhKSBhdXRoVXBkYXRlcy5kYXRhID0ge307XHJcbiAgICAgICAgYXV0aFVwZGF0ZXMuZGF0YS5hdmF0YXJfdXJsID0gdXBkYXRlcy5hdmF0YXJfdXJsO1xyXG4gICAgICAgIHByb2ZpbGVVcGRhdGVzLmF2YXRhcl91cmwgPSB1cGRhdGVzLmF2YXRhcl91cmw7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgLy8gVXBkYXRlIGF1dGggdXNlciBpZiB0aGVyZSBhcmUgYXV0aC1yZWxhdGVkIGNoYW5nZXNcclxuICAgICAgaWYgKE9iamVjdC5rZXlzKGF1dGhVcGRhdGVzKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgY29uc3QgeyBkYXRhOiBhdXRoRGF0YSwgZXJyb3I6IGF1dGhFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC51cGRhdGVVc2VyKGF1dGhVcGRhdGVzKTtcclxuICAgICAgICBpZiAoYXV0aEVycm9yKSB0aHJvdyBhdXRoRXJyb3I7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgLy8gQWx3YXlzIGluY2x1ZGUgdXBkYXRlZF9hdCBpbiBwcm9maWxlIHVwZGF0ZXNcclxuICAgICAgcHJvZmlsZVVwZGF0ZXMudXBkYXRlZF9hdCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcclxuICBcclxuICAgICAgLy8gVXBkYXRlIHByb2ZpbGUgaW4gZGF0YWJhc2VcclxuICAgICAgLy8gY29uc3QgeyBlcnJvcjogcHJvZmlsZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAvLyAgIC5mcm9tKCdwcm9maWxlcycpXHJcbiAgICAgIC8vICAgLnVwZGF0ZShwcm9maWxlVXBkYXRlcylcclxuICAgICAgLy8gICAuZXEoJ2lkJywgdXNlci5pZCk7XHJcbiAgICAgICAgXHJcbiAgICAgIC8vIGlmIChwcm9maWxlRXJyb3IpIHRocm93IHByb2ZpbGVFcnJvcjtcclxuICAgICAgXHJcbiAgICAgIC8vIFVwZGF0ZSBwcm9maWxlIGluIHN0YXRlXHJcbiAgICAgIGlmIChwcm9maWxlKSB7XHJcbiAgICAgICAgc2V0UHJvZmlsZSh7XHJcbiAgICAgICAgICAuLi5wcm9maWxlLFxyXG4gICAgICAgICAgLi4ucHJvZmlsZVVwZGF0ZXNcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gVXBkYXRlIFN0cmlwZSBjdXN0b21lciBpZiBuYW1lIHdhcyBjaGFuZ2VkXHJcbiAgICAgIC8vIGlmIChzdHJpcGVDdXN0b21lcklkICYmIHVwZGF0ZXMuZGlzcGxheV9uYW1lKSB7XHJcbiAgICAgIC8vICAgdHJ5IHtcclxuICAgICAgLy8gICAgIGF3YWl0IHN0cmlwZVNlcnZpY2UudXBkYXRlQ3VzdG9tZXIoc3RyaXBlQ3VzdG9tZXJJZCwge1xyXG4gICAgICAvLyAgICAgICBuYW1lOiB1cGRhdGVzLmRpc3BsYXlfbmFtZVxyXG4gICAgICAvLyAgICAgfSk7XHJcbiAgICAgIC8vICAgfSBjYXRjaCAoc3RyaXBlRXJyb3IpIHtcclxuICAgICAgLy8gICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHVwZGF0aW5nIFN0cmlwZSBjdXN0b21lcjonLCBzdHJpcGVFcnJvcik7XHJcbiAgICAgIC8vICAgfVxyXG4gICAgICAvLyB9XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4geyBlcnJvcjogbnVsbCB9O1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgdXBkYXRpbmcgcHJvZmlsZTonLCBlcnJvcik7XHJcbiAgICAgIHJldHVybiB7IGVycm9yIH07XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC8vIEFjdHVhbGl6YXIgc3VzY3JpcGNpXHUwMEYzbiBjb24gU3RyaXBlIGludGVncmF0aW9uXHJcbiAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3Vic2NyaXB0aW9uKHBsYW5JZDogc3RyaW5nKSB7XHJcbiAgICBpZiAoIXVzZXIpIHRocm93IG5ldyBFcnJvcignVXN1YXJpbyBubyBhdXRlbnRpY2FkbycpO1xyXG4gICAgXHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBSZWRpcmVjdCB0byBTdHJpcGUgQ2hlY2tvdXQgZm9yIHBheW1lbnRcclxuICAgICAgYXdhaXQgcmVkaXJlY3RUb0NoZWNrb3V0KHBsYW5JZCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBhY3R1YWxpemFuZG8gc3VzY3JpcGNpXHUwMEYzbjonLCBlcnJvcik7XHJcbiAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICAvLyBSZWZyZXNoIHN1YnNjcmlwdGlvbiBkYXRhIGZyb20gU3RyaXBlIGFuZCB1cGRhdGUgbG9jYWwgc3RhdGVcclxuICAvLyBhc3luYyBmdW5jdGlvbiByZWZyZXNoU3Vic2NyaXB0aW9uRGF0YSgpIHtcclxuICAvLyAgIGlmICghdXNlciB8fCAhc3RyaXBlQ3VzdG9tZXJJZCkgcmV0dXJuO1xyXG4gICAgXHJcbiAgLy8gICB0cnkge1xyXG4gIC8vICAgICAvLyBHZXQgc3Vic2NyaXB0aW9uIGZyb20gU3RyaXBlXHJcbiAgLy8gICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBhd2FpdCBzdHJpcGVTZXJ2aWNlLmdldEN1c3RvbWVyU3Vic2NyaXB0aW9ucyhzdHJpcGVDdXN0b21lcklkKTtcclxuICAgICAgXHJcbiAgLy8gICAgIGlmIChzdWJzY3JpcHRpb25zICYmIHN1YnNjcmlwdGlvbnMuZGF0YSAmJiBzdWJzY3JpcHRpb25zLmRhdGEubGVuZ3RoID4gMCkge1xyXG4gIC8vICAgICAgIC8vIEdldCB0aGUgbW9zdCByZWNlbnQgYWN0aXZlIHN1YnNjcmlwdGlvblxyXG4gIC8vICAgICAgIGNvbnN0IGFjdGl2ZVN1YnNjcmlwdGlvbiA9IHN1YnNjcmlwdGlvbnMuZGF0YS5maW5kKHN1YiA9PiBcclxuICAvLyAgICAgICAgIHN1Yi5zdGF0dXMgPT09ICdhY3RpdmUnIHx8IHN1Yi5zdGF0dXMgPT09ICd0cmlhbGluZycgfHwgc3ViLnN0YXR1cyA9PT0gJ3Bhc3RfZHVlJ1xyXG4gIC8vICAgICAgICk7XHJcbiAgICAgICAgXHJcbiAgLy8gICAgICAgaWYgKGFjdGl2ZVN1YnNjcmlwdGlvbikge1xyXG4gIC8vICAgICAgICAgLy8gR2V0IHBsYW4gSUQgZnJvbSBwcmljZSBJRFxyXG4gIC8vICAgICAgICAgY29uc3QgcHJpY2VJZCA9IGFjdGl2ZVN1YnNjcmlwdGlvbi5pdGVtcy5kYXRhWzBdPy5wcmljZS5pZDtcclxuICAvLyAgICAgICAgIGNvbnN0IHBsYW5JZCA9IFBSSUNFX1RPX1BMQU5fTUFQW3ByaWNlSWRdIHx8IFBMQU5fSURTLkZSRUU7XHJcbiAgICAgICAgICBcclxuICAvLyAgICAgICAgIC8vIFVwZGF0ZSBTdXBhYmFzZSBzdWJzY3JpcHRpb24gcmVjb3JkXHJcbiAgLy8gICAgICAgICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gIC8vICAgICAgICAgICAuZnJvbSgnc3Vic2NyaXB0aW9ucycpXHJcbiAgLy8gICAgICAgICAgIC51cHNlcnQoe1xyXG4gIC8vICAgICAgICAgICAgIHVzZXJfaWQ6IHVzZXIuaWQsXHJcbiAgLy8gICAgICAgICAgICAgcGxhbl9pZDogcGxhbklkLFxyXG4gIC8vICAgICAgICAgICAgIHN0YXR1czogYWN0aXZlU3Vic2NyaXB0aW9uLnN0YXR1cyxcclxuICAvLyAgICAgICAgICAgICBzdWJzY3JpcHRpb25faWQ6IGFjdGl2ZVN1YnNjcmlwdGlvbi5pZCxcclxuICAvLyAgICAgICAgICAgICBzdGFydF9kYXRlOiBuZXcgRGF0ZShhY3RpdmVTdWJzY3JpcHRpb24uc3RhcnRfZGF0ZSAqIDEwMDApLnRvSVNPU3RyaW5nKCksXHJcbiAgLy8gICAgICAgICAgICAgY3VycmVudF9wZXJpb2Rfc3RhcnQ6IG5ldyBEYXRlKGFjdGl2ZVN1YnNjcmlwdGlvbi5jdXJyZW50X3BlcmlvZF9zdGFydCAqIDEwMDApLnRvSVNPU3RyaW5nKCksXHJcbiAgLy8gICAgICAgICAgICAgY3VycmVudF9wZXJpb2RfZW5kOiBuZXcgRGF0ZShhY3RpdmVTdWJzY3JpcHRpb24uY3VycmVudF9wZXJpb2RfZW5kICogMTAwMCkudG9JU09TdHJpbmcoKSxcclxuICAvLyAgICAgICAgICAgICBjYW5jZWxfYXRfcGVyaW9kX2VuZDogYWN0aXZlU3Vic2NyaXB0aW9uLmNhbmNlbF9hdF9wZXJpb2RfZW5kLFxyXG4gIC8vICAgICAgICAgICAgIGNhbmNlbGVkX2F0OiBhY3RpdmVTdWJzY3JpcHRpb24uY2FuY2VsZWRfYXQgXHJcbiAgLy8gICAgICAgICAgICAgICA/IG5ldyBEYXRlKGFjdGl2ZVN1YnNjcmlwdGlvbi5jYW5jZWxlZF9hdCAqIDEwMDApLnRvSVNPU3RyaW5nKCkgXHJcbiAgLy8gICAgICAgICAgICAgICA6IG51bGwsXHJcbiAgLy8gICAgICAgICAgICAgdXBkYXRlZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXHJcbiAgLy8gICAgICAgICAgIH0sIHtcclxuICAvLyAgICAgICAgICAgICBvbkNvbmZsaWN0OiAnc3Vic2NyaXB0aW9uX2lkJ1xyXG4gIC8vICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgLy8gICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAvLyAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgdXBkYXRpbmcgc3Vic2NyaXB0aW9uIGluIGRhdGFiYXNlOicsIGVycm9yKTtcclxuICAvLyAgICAgICAgIH0gZWxzZSB7XHJcbiAgLy8gICAgICAgICAgIC8vIFJlbG9hZCB1c2VyIGRhdGEgdG8gZ2V0IHRoZSB1cGRhdGVkIHN1YnNjcmlwdGlvblxyXG4gIC8vICAgICAgICAgICBhd2FpdCBsb2FkVXNlckRhdGEodXNlci5pZCk7XHJcbiAgLy8gICAgICAgICB9XHJcbiAgLy8gICAgICAgfSBlbHNlIGlmICh1c2VyU3Vic2NyaXB0aW9uICYmIHVzZXJTdWJzY3JpcHRpb24uc3Vic2NyaXB0aW9uX2lkKSB7XHJcbiAgLy8gICAgICAgICAvLyBJZiB0aGVyZSdzIGEgc3RvcmVkIHN1YnNjcmlwdGlvbiBidXQgbm8gYWN0aXZlIG9uZSBpbiBTdHJpcGUsIG1hcmsgaXQgYXMgY2FuY2VsZWRcclxuICAvLyAgICAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgLy8gICAgICAgICAgIC5mcm9tKCdzdWJzY3JpcHRpb25zJylcclxuICAvLyAgICAgICAgICAgLnVwZGF0ZSh7XHJcbiAgLy8gICAgICAgICAgICAgc3RhdHVzOiAnY2FuY2VsZWQnLFxyXG4gIC8vICAgICAgICAgICAgIGVuZF9kYXRlOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXHJcbiAgLy8gICAgICAgICAgICAgdXBkYXRlZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXHJcbiAgLy8gICAgICAgICAgIH0pXHJcbiAgLy8gICAgICAgICAgIC5lcSgnc3Vic2NyaXB0aW9uX2lkJywgdXNlclN1YnNjcmlwdGlvbi5zdWJzY3JpcHRpb25faWQpO1xyXG4gICAgICAgICAgICBcclxuICAvLyAgICAgICAgIGlmIChlcnJvcikge1xyXG4gIC8vICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBtYXJraW5nIHN1YnNjcmlwdGlvbiBhcyBjYW5jZWxlZDonLCBlcnJvcik7XHJcbiAgLy8gICAgICAgICB9IGVsc2Uge1xyXG4gIC8vICAgICAgICAgICAvLyBSZWxvYWQgdXNlciBkYXRhXHJcbiAgLy8gICAgICAgICAgIGF3YWl0IGxvYWRVc2VyRGF0YSh1c2VyLmlkKTtcclxuICAvLyAgICAgICAgIH1cclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgIH0gZWxzZSBpZiAodXNlclN1YnNjcmlwdGlvbiAmJiB1c2VyU3Vic2NyaXB0aW9uLnN1YnNjcmlwdGlvbl9pZCkge1xyXG4gIC8vICAgICAgIC8vIElmIHRoZXJlJ3MgYSBzdG9yZWQgc3Vic2NyaXB0aW9uIGJ1dCBub25lIGluIFN0cmlwZSwgbWFyayBpdCBhcyBjYW5jZWxlZFxyXG4gIC8vICAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgLy8gICAgICAgICAuZnJvbSgnc3Vic2NyaXB0aW9ucycpXHJcbiAgLy8gICAgICAgICAudXBkYXRlKHtcclxuICAvLyAgICAgICAgICAgc3RhdHVzOiAnY2FuY2VsZWQnLFxyXG4gIC8vICAgICAgICAgICBlbmRfZGF0ZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxyXG4gIC8vICAgICAgICAgICB1cGRhdGVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcclxuICAvLyAgICAgICAgIH0pXHJcbiAgLy8gICAgICAgICAuZXEoJ3N1YnNjcmlwdGlvbl9pZCcsIHVzZXJTdWJzY3JpcHRpb24uc3Vic2NyaXB0aW9uX2lkKTtcclxuICAgICAgICAgIFxyXG4gIC8vICAgICAgIGlmIChlcnJvcikge1xyXG4gIC8vICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgbWFya2luZyBzdWJzY3JpcHRpb24gYXMgY2FuY2VsZWQ6JywgZXJyb3IpO1xyXG4gIC8vICAgICAgIH0gZWxzZSB7XHJcbiAgLy8gICAgICAgICAvLyBSZWxvYWQgdXNlciBkYXRhXHJcbiAgLy8gICAgICAgICBhd2FpdCBsb2FkVXNlckRhdGEodXNlci5pZCk7XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICB9XHJcbiAgLy8gICB9IGNhdGNoIChlcnJvcikge1xyXG4gIC8vICAgICBjb25zb2xlLmVycm9yKCdFcnJvciByZWZyZXNoaW5nIHN1YnNjcmlwdGlvbiBkYXRhOicsIGVycm9yKTtcclxuICAvLyAgIH1cclxuICAvLyB9XHJcbiAgXHJcbiAgLy8gQ2FuY2VsYXIgc3VzY3JpcGNpXHUwMEYzblxyXG4gIGFzeW5jIGZ1bmN0aW9uIGNhbmNlbFN1YnNjcmlwdGlvbigpIHtcclxuICAgIGlmICghdXNlciB8fCAhdXNlclN1YnNjcmlwdGlvbiB8fCAhdXNlclN1YnNjcmlwdGlvbi5zdWJzY3JpcHRpb25faWQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhY3RpdmUgc3Vic2NyaXB0aW9uIHRvIGNhbmNlbCcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBDYW5jZWwgc3Vic2NyaXB0aW9uIGluIFN0cmlwZVxyXG4gICAgICBpZiAodXNlclN1YnNjcmlwdGlvbi5zdWJzY3JpcHRpb25faWQpIHtcclxuICAgICAgICBhd2FpdCBzdHJpcGVTZXJ2aWNlLmNhbmNlbFN1YnNjcmlwdGlvbih1c2VyU3Vic2NyaXB0aW9uLnN1YnNjcmlwdGlvbl9pZCk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIFVwZGF0ZSBzdWJzY3JpcHRpb24gaW4gZGF0YWJhc2VcclxuICAgICAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgICAuZnJvbSgnc3Vic2NyaXB0aW9ucycpXHJcbiAgICAgICAgLnVwZGF0ZSh7XHJcbiAgICAgICAgICBzdGF0dXM6ICdjYW5jZWxlZCcsXHJcbiAgICAgICAgICBjYW5jZWxfYXRfcGVyaW9kX2VuZDogdHJ1ZSxcclxuICAgICAgICAgIHVwZGF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmVxKCdpZCcsIHVzZXJTdWJzY3JpcHRpb24uaWQpO1xyXG4gICAgICAgIFxyXG4gICAgICBpZiAoZXJyb3IpIHRocm93IGVycm9yO1xyXG4gICAgICBcclxuICAgICAgLy8gUmVjYXJnYXIgZGF0b3MgZGUgc3VzY3JpcGNpXHUwMEYzblxyXG4gICAgICBhd2FpdCBsb2FkVXNlckRhdGEodXNlci5pZCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjYW5jZWxhbmRvIHN1c2NyaXBjaVx1MDBGM246JywgZXJyb3IpO1xyXG4gICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLy8gSW5jcmVtZW50YXIgZWwgY29udGFkb3IgZGUgdXNvIGRlIEFQSVxyXG4gIGFzeW5jIGZ1bmN0aW9uIGluY3JlbWVudEFwaVVzYWdlKCkge1xyXG4gICAgaWYgKCF1c2VyIHx8ICF1c2FnZVN0YXRzKSByZXR1cm47XHJcbiAgICBcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IG5ld0NvdW50ID0gKHVzYWdlU3RhdHMuYXBpX2NhbGxzIHx8IDApICsgMTtcclxuICAgICAgXHJcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgICAgLmZyb20oJ3VzYWdlX3N0YXRzJylcclxuICAgICAgICAudXBkYXRlKHsgXHJcbiAgICAgICAgICBhcGlfY2FsbHM6IG5ld0NvdW50LFxyXG4gICAgICAgICAgbGFzdF9hY3RpdmU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgICAgIHVwZGF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmVxKCdpZCcsIHVzYWdlU3RhdHMuaWQpO1xyXG4gICAgICAgIFxyXG4gICAgICBpZiAoZXJyb3IpIHRocm93IGVycm9yO1xyXG4gICAgICBcclxuICAgICAgLy8gQWN0dWFsaXphciBlc3RhZG8gbG9jYWxcclxuICAgICAgc2V0VXNhZ2VTdGF0cyh7XHJcbiAgICAgICAgLi4udXNhZ2VTdGF0cyxcclxuICAgICAgICBhcGlfY2FsbHM6IG5ld0NvdW50LFxyXG4gICAgICAgIGxhc3RfYWN0aXZlOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXHJcbiAgICAgICAgdXBkYXRlZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaW5jcmVtZW50YW5kbyB1c28gZGUgQVBJOicsIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLy8gQWdyZWdhciB1c28gZGUgYWxtYWNlbmFtaWVudG9cclxuICBhc3luYyBmdW5jdGlvbiBhZGRTdG9yYWdlVXNhZ2UoYnl0ZXNBZGRlZDogbnVtYmVyKSB7XHJcbiAgICBpZiAoIXVzZXIgfHwgIXVzYWdlU3RhdHMpIHJldHVybjtcclxuICAgIFxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgbmV3U3RvcmFnZSA9ICh1c2FnZVN0YXRzLnN0b3JhZ2VfdXNlZCB8fCAwKSArIGJ5dGVzQWRkZWQ7XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAgIC5mcm9tKCd1c2FnZV9zdGF0cycpXHJcbiAgICAgICAgLnVwZGF0ZSh7IFxyXG4gICAgICAgICAgc3RvcmFnZV91c2VkOiBuZXdTdG9yYWdlLFxyXG4gICAgICAgICAgbGFzdF9hY3RpdmU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgICAgIHVwZGF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmVxKCdpZCcsIHVzYWdlU3RhdHMuaWQpO1xyXG4gICAgICAgIFxyXG4gICAgICBpZiAoZXJyb3IpIHRocm93IGVycm9yO1xyXG4gICAgICBcclxuICAgICAgLy8gQWN0dWFsaXphciBlc3RhZG8gbG9jYWxcclxuICAgICAgc2V0VXNhZ2VTdGF0cyh7XHJcbiAgICAgICAgLi4udXNhZ2VTdGF0cyxcclxuICAgICAgICBzdG9yYWdlX3VzZWQ6IG5ld1N0b3JhZ2UsXHJcbiAgICAgICAgbGFzdF9hY3RpdmU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgICB1cGRhdGVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBhY3R1YWxpemFuZG8gdXNvIGRlIGFsbWFjZW5hbWllbnRvOicsIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLy8gVmVyaWZpY2FyIHNpIGVsIHVzdWFyaW8gdGllbmUgYWNjZXNvIGEgZnVuY2lvbmFsaWRhZGVzIHByZW1pdW1cclxuICBmdW5jdGlvbiBoYXNBY2Nlc3MocmVxdWlyZWRQbGFuSWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKCF1c2VyU3Vic2NyaXB0aW9uKSByZXR1cm4gcmVxdWlyZWRQbGFuSWQgPT09ICcxJzsgLy8gT25seSBhbGxvdyBmcmVlIGZlYXR1cmVzXHJcbiAgICBcclxuICAgIHJldHVybiBjaGVja0FjY2Vzcyh1c2VyU3Vic2NyaXB0aW9uLnBsYW5faWQsIHJlcXVpcmVkUGxhbklkKTtcclxuICB9XHJcbiAgXHJcbiAgLy8gVmVyaWZpY2FyIHNpIGVsIHVzdWFyaW8gdGllbmUgYWNjZXNvIGEgdW4gbW9kZWxvIGVzcGVjXHUwMEVEZmljb1xyXG4gIGZ1bmN0aW9uIGhhc01vZGVsQWNjZXNzKG1vZGVsSWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKCF1c2VyU3Vic2NyaXB0aW9uKSByZXR1cm4gZmFsc2U7XHJcbiAgICBcclxuICAgIHJldHVybiBoYXNNb2RlbEFjY2Vzcyhtb2RlbElkKTtcclxuICB9XHJcbiAgXHJcbiAgLy8gUmVmcmVzY2FyIGRhdG9zIGRlIHN1c2NyaXBjaVx1MDBGM25cclxuICBhc3luYyBmdW5jdGlvbiByZWZyZXNoU3Vic2NyaXB0aW9uRGF0YSgpIHtcclxuICAgIGlmICghdXNlcikgcmV0dXJuO1xyXG4gICAgYXdhaXQgbG9hZFVzZXJEYXRhKHVzZXIuaWQpO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVkaXJlY3QgdG8gU3RyaXBlIENoZWNrb3V0XHJcbiAgYXN5bmMgZnVuY3Rpb24gcmVkaXJlY3RUb0NoZWNrb3V0KHBsYW5JZDogc3RyaW5nKSB7XHJcbiAgICBpZiAoIXVzZXIpIHRocm93IG5ldyBFcnJvcignVXNlciBub3QgYXV0aGVudGljYXRlZCcpO1xyXG4gICAgXHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBHZXQgdGhlIHByaWNlIElEIGZvciB0aGUgc2VsZWN0ZWQgcGxhblxyXG4gICAgICBjb25zdCBwcmljZUlkID0gUExBTl9UT19QUklDRV9NQVBbcGxhbklkXTtcclxuICAgICAgXHJcbiAgICAgIGlmICghcHJpY2VJZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwbGFuIElEJyk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIENyZWF0ZSBvciBnZXQgU3RyaXBlIGN1c3RvbWVyXHJcbiAgICAgIGxldCBjdXN0b21lcklkID0gc3RyaXBlQ3VzdG9tZXJJZDtcclxuICAgICAgXHJcbiAgICAgIGlmICghY3VzdG9tZXJJZCAmJiBwcm9maWxlKSB7XHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGN1c3RvbWVyIGluIFN0cmlwZVxyXG4gICAgICAgIGNvbnN0IGN1c3RvbWVyUmVzcG9uc2UgPSBhd2FpdCBzdHJpcGVTZXJ2aWNlLmNyZWF0ZUN1c3RvbWVyKHtcclxuICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsIHx8ICcnLFxyXG4gICAgICAgICAgbmFtZTogcHJvZmlsZS51c2VybmFtZSB8fCB1c2VyLmVtYWlsPy5zcGxpdCgnQCcpWzBdLFxyXG4gICAgICAgICAgbWV0YWRhdGE6IHtcclxuICAgICAgICAgICAgdXNlcl9pZDogdXNlci5pZFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChjdXN0b21lclJlc3BvbnNlICYmIGN1c3RvbWVyUmVzcG9uc2UuaWQpIHtcclxuICAgICAgICAgIGN1c3RvbWVySWQgPSBjdXN0b21lclJlc3BvbnNlLmlkO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBVcGRhdGUgcHJvZmlsZSB3aXRoIFN0cmlwZSBjdXN0b21lciBJRFxyXG4gICAgICAgICAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgICAgICAgLmZyb20oJ3Byb2ZpbGVzJylcclxuICAgICAgICAgICAgLnVwZGF0ZSh7IHN0cmlwZV9jdXN0b21lcl9pZDogY3VzdG9tZXJJZCB9KVxyXG4gICAgICAgICAgICAuZXEoJ2lkJywgdXNlci5pZCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHVwZGF0aW5nIHByb2ZpbGUgd2l0aCBTdHJpcGUgY3VzdG9tZXIgSUQ6JywgZXJyb3IpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2V0U3RyaXBlQ3VzdG9tZXJJZChjdXN0b21lcklkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGlmICghY3VzdG9tZXJJZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGNyZWF0ZSBvciByZXRyaWV2ZSBTdHJpcGUgY3VzdG9tZXInKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gQ3JlYXRlIGNoZWNrb3V0IHNlc3Npb24gYW5kIHJlZGlyZWN0XHJcbiAgICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBzdHJpcGVTZXJ2aWNlLmNyZWF0ZUNoZWNrb3V0U2Vzc2lvbih7XHJcbiAgICAgICAgY3VzdG9tZXJJZCxcclxuICAgICAgICBwcmljZUlkLFxyXG4gICAgICAgIHN1Y2Nlc3NVcmw6IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L3N1YnNjcmlwdGlvbi1zdWNjZXNzP3Nlc3Npb25faWQ9e0NIRUNLT1VUX1NFU1NJT05fSUR9YCxcclxuICAgICAgICBjYW5jZWxVcmw6IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L3ByaWNpbmdgXHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgaWYgKHNlc3Npb24gJiYgc2Vzc2lvbi51cmwpIHtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHNlc3Npb24udXJsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBjaGVja291dCBzZXNzaW9uJyk7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHJlZGlyZWN0aW5nIHRvIGNoZWNrb3V0OicsIGVycm9yKTtcclxuICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC8vIFJlZGlyZWN0IHRvIFN0cmlwZSBDdXN0b21lciBQb3J0YWxcclxuICBhc3luYyBmdW5jdGlvbiByZWRpcmVjdFRvQ3VzdG9tZXJQb3J0YWwoKSB7XHJcbiAgICBpZiAoIXVzZXIgfHwgIXN0cmlwZUN1c3RvbWVySWQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVc2VyIG5vdCBhdXRoZW50aWNhdGVkIG9yIG5vIFN0cmlwZSBjdXN0b21lciBJRCcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBDcmVhdGUgY3VzdG9tZXIgcG9ydGFsIHNlc3Npb24gYW5kIHJlZGlyZWN0XHJcbiAgICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBzdHJpcGVTZXJ2aWNlLmNyZWF0ZUN1c3RvbWVyUG9ydGFsU2Vzc2lvbih7XHJcbiAgICAgICAgY3VzdG9tZXJJZDogc3RyaXBlQ3VzdG9tZXJJZCxcclxuICAgICAgICByZXR1cm5Vcmw6IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L3Byb2ZpbGVgXHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgaWYgKHNlc3Npb24gJiYgc2Vzc2lvbi51cmwpIHtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHNlc3Npb24udXJsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBjdXN0b21lciBwb3J0YWwgc2Vzc2lvbicpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciByZWRpcmVjdGluZyB0byBjdXN0b21lciBwb3J0YWw6JywgZXJyb3IpO1xyXG4gICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFJlc2V0IHBhc3N3b3JkIGZ1bmN0aW9uYWxpdHlcclxuICBhc3luYyBmdW5jdGlvbiByZXNldFBhc3N3b3JkKGVtYWlsOiBzdHJpbmcpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGgucmVzZXRQYXNzd29yZEZvckVtYWlsKGVtYWlsLCB7XHJcbiAgICAgICAgcmVkaXJlY3RUbzogYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0vcmVzZXQtcGFzc3dvcmRgXHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcmVzZXR0aW5nIHBhc3N3b3JkOicsIGVycm9yKTtcclxuICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgcmV0dXJuIHsgZXJyb3I6IG51bGwsIGRhdGEgfTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHJlc2V0dGluZyBwYXNzd29yZDonLCBlcnJvcik7XHJcbiAgICAgIHJldHVybiB7IGVycm9yLCBkYXRhOiBudWxsIH07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiB1cGRhdGVQYXNzd29yZChuZXdQYXNzd29yZDogc3RyaW5nLCBhY2Nlc3NUb2tlbjogc3RyaW5nKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLnVwZGF0ZVVzZXIoe1xyXG4gICAgICAgIHBhc3N3b3JkOiBuZXdQYXNzd29yZFxyXG4gICAgICB9KTtcclxuICAgICAgaWYgKGVycm9yKSB0aHJvdyBlcnJvcjtcclxuICAgICAgcmV0dXJuIHsgZXJyb3I6IG51bGwgfTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHVwZGF0aW5nIHBhc3N3b3JkOicsIGVycm9yKTtcclxuICAgICAgcmV0dXJuIHsgZXJyb3IgfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEFkZGVkIGFsaWFzIGZvciBzaWduT3V0IHRvIG1hdGNoIEFQSSBpbiBjb21wb25lbnRzXHJcbiAgYXN5bmMgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgcmV0dXJuIHNpZ25PdXQoKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVN0cmlwZUN1c3RvbWVyKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgeyB1cmwgfSA9IGF3YWl0IHN0cmlwZVNlcnZpY2UuY3JlYXRlU3RyaXBlQ3VzdG9tZXIoKTtcclxuICAgICAgcmV0dXJuIHsgdXJsIH07XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjcmVhdGluZyBTdHJpcGUgY3VzdG9tZXI6JywgZXJyb3IpO1xyXG4gICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHZhbHVlID0ge1xyXG4gICAgdXNlcixcclxuICAgIHByb2ZpbGUsXHJcbiAgICB1c2VyU3Vic2NyaXB0aW9uLFxyXG4gICAgdXNhZ2VTdGF0cyxcclxuICAgIGF2YWlsYWJsZVBsYW5zLFxyXG4gICAgc2lnbkluLFxyXG4gICAgc2lnbk91dCxcclxuICAgIHNpZ25VcCxcclxuICAgIHJlc2V0UGFzc3dvcmQsXHJcbiAgICB1cGRhdGVQYXNzd29yZCxcclxuICAgIHVwZGF0ZVByb2ZpbGUsXHJcbiAgICB1cGRhdGVTdWJzY3JpcHRpb24sXHJcbiAgICBjYW5jZWxTdWJzY3JpcHRpb24sXHJcbiAgICBpbmNyZW1lbnRBcGlVc2FnZSxcclxuICAgIGFkZFN0b3JhZ2VVc2FnZSxcclxuICAgIGhhc0FjY2VzcyxcclxuICAgIGhhc01vZGVsQWNjZXNzLFxyXG4gICAgZ2V0UGxhbk5hbWU6IChwbGFuSWQ6IHN0cmluZykgPT4gZ2V0UGxhbk5hbWUocGxhbklkIGFzIFBsYW5UeXBlKSxcclxuICAgIHJlZnJlc2hTdWJzY3JpcHRpb25EYXRhLFxyXG4gICAgc3VwYWJhc2UsXHJcbiAgICByZWRpcmVjdFRvQ2hlY2tvdXQsXHJcbiAgICByZWRpcmVjdFRvQ3VzdG9tZXJQb3J0YWwsXHJcbiAgICBsb2dvdXQsXHJcbiAgICBpc0xvYWRpbmcsXHJcbiAgICBzdHJpcGVDdXN0b21lcklkLFxyXG4gICAgaXNMb2dpbk9wZW4sXHJcbiAgICBzZXRJc0xvZ2luT3BlbixcclxuICAgIGNyZWF0ZVN0cmlwZUN1c3RvbWVyXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9PntjaGlsZHJlbn08L0F1dGhDb250ZXh0LlByb3ZpZGVyPjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUF1dGgoKSB7XHJcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aENvbnRleHQpO1xyXG4gIGlmIChjb250ZXh0ID09PSB1bmRlZmluZWQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlQXV0aCBkZWJlIHNlciB1c2FkbyBkZW50cm8gZGUgdW4gQXV0aFByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSmVyZW1cXFxcRGVza3RvcFxcXFxTdGFydFVwXFxcXGFpbGl2ZVxcXFxsaXZlLWNoYXRib3RcXFxcc3JjXFxcXHBhZ2VzXFxcXGFwaVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSmVyZW1cXFxcRGVza3RvcFxcXFxTdGFydFVwXFxcXGFpbGl2ZVxcXFxsaXZlLWNoYXRib3RcXFxcc3JjXFxcXHBhZ2VzXFxcXGFwaVxcXFxjcmVhdGUtc3RyaXBlLWN1c3RvbWVyLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9KZXJlbS9EZXNrdG9wL1N0YXJ0VXAvYWlsaXZlL2xpdmUtY2hhdGJvdC9zcmMvcGFnZXMvYXBpL2NyZWF0ZS1zdHJpcGUtY3VzdG9tZXIudHNcIjtpbXBvcnQgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSAnbmV4dCc7XHJcbmltcG9ydCBzdHJpcGVTZXJ2aWNlIGZyb20gJy4uLy4uL2FwaS9zdHJpcGUtc2VydmljZSc7XHJcbmltcG9ydCB7IHN1cGFiYXNlIH0gZnJvbSAnLi4vLi4vY29udGV4dC9BdXRoQ29udGV4dCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcTogTmV4dEFwaVJlcXVlc3QsIHJlczogTmV4dEFwaVJlc3BvbnNlKSB7XHJcbiAgaWYgKHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgeyBkYXRhOiB7IHVzZXIgfSwgZXJyb3I6IHVzZXJFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKCk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAodXNlckVycm9yIHx8ICF1c2VyPy5pZCkge1xyXG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbih7IG1lc3NhZ2U6ICdVbmF1dGhvcml6ZWQnIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB7IGRhdGE6IHByb2ZpbGUgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgICAgLmZyb20oJ3Byb2ZpbGVzJylcclxuICAgICAgICAuc2VsZWN0KCd1c2VybmFtZScpXHJcbiAgICAgICAgLmVxKCdpZCcsIHVzZXIuaWQpXHJcbiAgICAgICAgLnNpbmdsZSgpO1xyXG5cclxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHVzZXIgaGFzIGEgc3RyaXBlX2N1c3RvbWVyX2lkIGluIHVzZXJfbWV0YWRhdGFcclxuICAgICAgbGV0IHN0cmlwZUN1c3RvbWVySWQgPSB1c2VyLnVzZXJfbWV0YWRhdGE/LnN0cmlwZV9jdXN0b21lcl9pZDtcclxuXHJcbiAgICAgIGlmICghc3RyaXBlQ3VzdG9tZXJJZCkge1xyXG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBTdHJpcGUgY3VzdG9tZXJcclxuICAgICAgICBjb25zdCBjdXN0b21lciA9IGF3YWl0IHN0cmlwZVNlcnZpY2UuY3JlYXRlQ3VzdG9tZXIoe1xyXG4gICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwgfHwgJycsXHJcbiAgICAgICAgICBuYW1lOiBwcm9maWxlPy51c2VybmFtZSB8fCAnJyxcclxuICAgICAgICAgIG1ldGFkYXRhOiB7XHJcbiAgICAgICAgICAgIHVzZXJfaWQ6IHVzZXIuaWQsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdHJpcGVDdXN0b21lcklkID0gY3VzdG9tZXIuaWQ7XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgdXNlciBpbiBTdXBhYmFzZSB3aXRoIHRoZSBzdHJpcGVfY3VzdG9tZXJfaWRcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC51cGRhdGVVc2VyKHtcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgIHN0cmlwZV9jdXN0b21lcl9pZDogc3RyaXBlQ3VzdG9tZXJJZCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciB1cGRhdGluZyB1c2VyIG1ldGFkYXRhOicsIGVycm9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogJ0ZhaWxlZCB0byB1cGRhdGUgdXNlciBtZXRhZGF0YScgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHVwZGF0aW5nIHVzZXIgbWV0YWRhdGE6JywgZXJyb3IpO1xyXG4gICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogJ0ZhaWxlZCB0byB1cGRhdGUgdXNlciBtZXRhZGF0YScgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzdHJpcGVDdXN0b21lcklkJywgc3RyaXBlQ3VzdG9tZXJJZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHN0cmlwZSA9IHJlcXVpcmUoJ3N0cmlwZScpKCdza190ZXN0XzUxUWZPdE0wN1NlejltMDZKQVRURldhaERDTGw4WHphalIxblFnZ2hBSmhNRDdjVGlqQTZHalBMQ2hCV3hZZ1ZTYTNWS09rM1VpMkhrdk0zSWs5SzVuQng5MDBYTVpkSVVheScpO1xyXG4gICAgICBjb25zdCBwb3J0YWxTZXNzaW9uID0gYXdhaXQgc3RyaXBlLmJpbGxpbmdQb3J0YWwuc2Vzc2lvbnMuY3JlYXRlKHtcclxuICAgICAgICBjdXN0b21lcjogc3RyaXBlQ3VzdG9tZXJJZCxcclxuICAgICAgICByZXR1cm5fdXJsOiBgJHtyZXEuaGVhZGVycy5vcmlnaW59L3N1YnNjcmlwdGlvbmAsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gUmV0dXJuIHRoZSBVUkwgb2YgdGhlIFN0cmlwZSBiaWxsaW5nIHBvcnRhbCBzZXNzaW9uXHJcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgdXJsOiBwb3J0YWxTZXNzaW9uLnVybCB9KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGNyZWF0ZS9saW5rIFN0cmlwZSBjdXN0b21lcicgfSk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHJlcy5zZXRIZWFkZXIoJ0FsbG93JywgJ1BPU1QnKTtcclxuICAgIHJlcy5zdGF0dXMoNDA1KS5lbmQoJ01ldGhvZCBOb3QgQWxsb3dlZCcpO1xyXG4gIH1cclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEplcmVtXFxcXERlc2t0b3BcXFxcU3RhcnRVcFxcXFxhaWxpdmVcXFxcbGl2ZS1jaGF0Ym90XFxcXHNyY1xcXFxhcGlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEplcmVtXFxcXERlc2t0b3BcXFxcU3RhcnRVcFxcXFxhaWxpdmVcXFxcbGl2ZS1jaGF0Ym90XFxcXHNyY1xcXFxhcGlcXFxcZGVlcHNlZWstcHJveHkudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0plcmVtL0Rlc2t0b3AvU3RhcnRVcC9haWxpdmUvbGl2ZS1jaGF0Ym90L3NyYy9hcGkvZGVlcHNlZWstcHJveHkudHNcIjsvKipcclxuICogRGV2ZWxvcG1lbnQgcHJveHkgZm9yIERlZXBTZWVrIEFQSSByZXF1ZXN0c1xyXG4gKiBcclxuICogVGhpcyBmaWxlIHNpbXVsYXRlcyB0aGUgQ2xvdWRmbGFyZSBXb3JrZXIgQUkgZnVuY3Rpb25hbGl0eSBkdXJpbmcgbG9jYWwgZGV2ZWxvcG1lbnRcclxuICogc2luY2UgQ2xvdWRmbGFyZSBiaW5kaW5ncyBhcmUgbm90IGF2YWlsYWJsZSBpbiB0aGUgbG9jYWwgZW52aXJvbm1lbnQuXHJcbiAqL1xyXG5cclxuLy8gQ2hlY2sgaWYgcmVxdWVzdCBpbmNsdWRlcyBBUEkga2V5IChmb3IgZGV2ZWxvcG1lbnQgb25seSlcclxuY29uc3QgdmFsaWRhdGVBcGlLZXkgPSAoYXBpS2V5Pzogc3RyaW5nKTogYm9vbGVhbiA9PiB7XHJcbiAgLy8gSW4gZGV2ZWxvcG1lbnQsIGFjY2VwdCBhbnkgbm9uLWVtcHR5IEFQSSBrZXlcclxuICByZXR1cm4gISFhcGlLZXlcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogUmVxdWVzdCkge1xyXG4gIHRyeSB7XHJcbiAgICAvLyBQYXJzZSByZXF1ZXN0IGJvZHlcclxuICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKVxyXG4gICAgY29uc3QgeyBtZXNzYWdlcyB9ID0gYm9keVxyXG4gICAgXHJcbiAgICAvLyBHZXQgQVBJIGtleSBmcm9tIGhlYWRlcnNcclxuICAgIGNvbnN0IGFwaUtleSA9IHJlcXVlc3QuaGVhZGVycy5nZXQoJ1gtQVBJLUtleScpXHJcbiAgICBcclxuICAgIC8vIFZhbGlkYXRlIHJlcXVlc3RcclxuICAgIGlmICghbWVzc2FnZXMgfHwgIUFycmF5LmlzQXJyYXkobWVzc2FnZXMpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0ludmFsaWQgcmVxdWVzdC4gTWVzc2FnZXMgYXJyYXkgaXMgcmVxdWlyZWQuJyB9KSxcclxuICAgICAgICB7IHN0YXR1czogNDAwLCBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSB9XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICAvLyBJZiBBUEkga2V5IGlzIHByb3ZpZGVkLCB2YWxpZGF0ZSBpdFxyXG4gICAgaWYgKGFwaUtleSAmJiAhdmFsaWRhdGVBcGlLZXkoYXBpS2V5KSkge1xyXG4gICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6ICdVbmF1dGhvcml6ZWQuIEludmFsaWQgQVBJIGtleS4nIH0pLFxyXG4gICAgICAgIHsgc3RhdHVzOiA0MDEsIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9IH1cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENyZWF0ZSBhIHRleHQgZW5jb2RlciBmb3IgdGhlIHN0cmVhbVxyXG4gICAgY29uc3QgZW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigpXHJcbiAgICBcclxuICAgIC8vIENyZWF0ZSBhIHJlYWRhYmxlIHN0cmVhbVxyXG4gICAgY29uc3Qgc3RyZWFtID0gbmV3IFJlYWRhYmxlU3RyZWFtKHtcclxuICAgICAgYXN5bmMgc3RhcnQoY29udHJvbGxlcikge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAvLyBTaW11bGF0ZSB0aGlua2luZyB0aW1lXHJcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTAwKSlcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gRXh0cmFjdCB0aGUgbGFzdCB1c2VyIG1lc3NhZ2UgZm9yIHRoZSByZXNwb25zZVxyXG4gICAgICAgICAgY29uc3QgbGFzdFVzZXJNZXNzYWdlID0gbWVzc2FnZXNcclxuICAgICAgICAgICAgLmZpbHRlcigobTogYW55KSA9PiBtLnJvbGUgPT09ICd1c2VyJylcclxuICAgICAgICAgICAgLnBvcCgpPy5jb250ZW50IHx8ICcnXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIEdlbmVyYXRlIGEgc2ltdWxhdGVkIHJlc3BvbnNlXHJcbiAgICAgICAgICBjb25zdCBzaW11bGF0ZWRSZXNwb25zZSA9IGBUaGlzIGlzIGEgc2ltdWxhdGVkIHJlc3BvbnNlIGluIGRldmVsb3BtZW50IG1vZGUgZm9yOiBcIiR7bGFzdFVzZXJNZXNzYWdlfVwiLiBcclxuICAgICAgICAgICAgXHJcbkluIHByb2R1Y3Rpb24gd2l0aCBDbG91ZGZsYXJlIFdvcmtlcnMsIHRoaXMgd291bGQgY29ubmVjdCB0byB0aGUgRGVlcFNlZWstUjEtRGlzdGlsbC1Rd2VuLTMyQiBtb2RlbC5cclxuXHJcbktleSBmZWF0dXJlcyBvZiB0aGlzIG1vZGVsOlxyXG4tIDgwLDAwMCB0b2tlbiBjb250ZXh0IHdpbmRvd1xyXG4tIFN0YXRlLW9mLXRoZS1hcnQgcGVyZm9ybWFuY2UgZm9yIGRlbnNlIG1vZGVsc1xyXG4tIEV4Y2VscyBhdCByZWFzb25pbmcgYW5kIGNyZWF0aXZlIHRhc2tzXHJcbi0gT3V0cGVyZm9ybXMgT3BlbkFJLW8xLW1pbmkgYWNyb3NzIGJlbmNobWFya3NcclxuXHJcblRvIHVzZSB0aGUgYWN0dWFsIG1vZGVsLCBkZXBsb3kgdG8gQ2xvdWRmbGFyZSBXb3JrZXJzIHdpdGggdGhlIEFJIGJpbmRpbmcgY29uZmlndXJlZC5gXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIFNlbmQgcmVzcG9uc2UgaW4gY2h1bmtzIHRvIHNpbXVsYXRlIHN0cmVhbWluZ1xyXG4gICAgICAgICAgbGV0IGN1cnJlbnRQb3NpdGlvbiA9IDBcclxuICAgICAgICAgIGNvbnN0IGNodW5rU2l6ZSA9IDEwXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHdoaWxlIChjdXJyZW50UG9zaXRpb24gPCBzaW11bGF0ZWRSZXNwb25zZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgY2h1bmsgPSBzaW11bGF0ZWRSZXNwb25zZS5zbGljZShcclxuICAgICAgICAgICAgICBjdXJyZW50UG9zaXRpb24sIFxyXG4gICAgICAgICAgICAgIE1hdGgubWluKGN1cnJlbnRQb3NpdGlvbiArIGNodW5rU2l6ZSwgc2ltdWxhdGVkUmVzcG9uc2UubGVuZ3RoKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBGb3JtYXQgYXMgU1NFXHJcbiAgICAgICAgICAgIGNvbnN0IHNzZURhdGEgPSBgZGF0YTogJHtKU09OLnN0cmluZ2lmeSh7IHJlc3BvbnNlOiBjaHVuayB9KX1cXG5cXG5gXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZW5xdWV1ZShlbmNvZGVyLmVuY29kZShzc2VEYXRhKSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGN1cnJlbnRQb3NpdGlvbiArPSBjaHVua1NpemVcclxuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDUwKSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gRW5kIHRoZSBzdHJlYW1cclxuICAgICAgICAgIGNvbnRyb2xsZXIuZW5xdWV1ZShlbmNvZGVyLmVuY29kZSgnZGF0YTogW0RPTkVdXFxuXFxuJykpXHJcbiAgICAgICAgICBjb250cm9sbGVyLmNsb3NlKClcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgY29udHJvbGxlci5lcnJvcihlcnJvcilcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICBcclxuICAgIC8vIFJldHVybiB0aGUgc3RyZWFtIHdpdGggdGhlIGNvcnJlY3QgaGVhZGVyc1xyXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShzdHJlYW0sIHtcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9ldmVudC1zdHJlYW0nLFxyXG4gICAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJyxcclxuICAgICAgICAnQ29ubmVjdGlvbic6ICdrZWVwLWFsaXZlJyxcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgaW4gRGVlcFNlZWsgcHJveHk6JywgZXJyb3IpXHJcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKFxyXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IFxyXG4gICAgICAgIGVycm9yOiAnRmFpbGVkIHRvIHByb2Nlc3MgcmVxdWVzdCcsXHJcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAnVW5rbm93biBlcnJvcidcclxuICAgICAgfSksXHJcbiAgICAgIHsgc3RhdHVzOiA1MDAsIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9IH1cclxuICAgIClcclxuICB9XHJcbn0gIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxKZXJlbVxcXFxEZXNrdG9wXFxcXFN0YXJ0VXBcXFxcYWlsaXZlXFxcXGxpdmUtY2hhdGJvdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSmVyZW1cXFxcRGVza3RvcFxcXFxTdGFydFVwXFxcXGFpbGl2ZVxcXFxsaXZlLWNoYXRib3RcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0plcmVtL0Rlc2t0b3AvU3RhcnRVcC9haWxpdmUvbGl2ZS1jaGF0Ym90L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcInVybFwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuLy8gR2V0IGRpcmVjdG9yeSBuYW1lIGluIEVTTVxyXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogMzAwMCxcclxuICAgIGhvc3Q6IHRydWUsXHJcbiAgICBwcm94eToge1xyXG4gICAgICAvLyBQcm94eSBBUEkgcmVxdWVzdHMgaW4gZGV2ZWxvcG1lbnRcclxuICAgICAgJy9hcGkvY3JlYXRlLXN0cmlwZS1jdXN0b21lcic6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnLFxyXG4gICAgICAgIGNvbmZpZ3VyZTogKHByb3h5LCBfb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgcHJveHkub24oJ2Vycm9yJywgKGVyciwgX3JlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncHJveHkgZXJyb3InLCBlcnIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBieXBhc3M6IChyZXEsIHJlcykgPT4ge1xyXG4gICAgICAgICAgaWYgKHJlcS51cmwgPT09ICcvYXBpL2NyZWF0ZS1zdHJpcGUtY3VzdG9tZXInKSB7XHJcbiAgICAgICAgICAgIGltcG9ydCgnLi9zcmMvcGFnZXMvYXBpL2NyZWF0ZS1zdHJpcGUtY3VzdG9tZXInKVxyXG4gICAgICAgICAgICAgIC50aGVuKG1vZHVsZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtb2R1bGUuZGVmYXVsdChyZXEsIHJlcylcclxuICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwcm9jZXNzaW5nIHJlcXVlc3Q6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0ludGVybmFsIHNlcnZlciBlcnJvcicgfSkpO1xyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbXBvcnRpbmcgQVBJIGhhbmRsZXI6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XHJcbiAgICAgICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6ICdGYWlsZWQgdG8gbG9hZCBBUEkgaGFuZGxlcicgfSkpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgICcvYXBpL2RlZXBzZWVrJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXHJcbiAgICAgICAgY29uZmlndXJlOiAocHJveHksIF9vcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICBwcm94eS5vbignZXJyb3InLCAoZXJyLCBfcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwcm94eSBlcnJvcicsIGVycik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFVzZSBjdXN0b20gaGFuZGxlciBmb3IgdGhlIEFQSSBlbmRwb2ludFxyXG4gICAgICAgIGJ5cGFzczogKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVxLnVybCA9PT0gJy9hcGkvZGVlcHNlZWsnKSB7XHJcbiAgICAgICAgICAgIC8vIEltcG9ydCBhbmQgdXNlIHRoZSBkZXZlbG9wbWVudCBwcm94eVxyXG4gICAgICAgICAgICBpbXBvcnQoJy4vc3JjL2FwaS9kZWVwc2Vlay1wcm94eScpXHJcbiAgICAgICAgICAgICAgLnRoZW4obW9kdWxlID0+IHtcclxuICAgICAgICAgICAgICAgIG1vZHVsZS5QT1NUKHJlcSlcclxuICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENvcHkgc3RhdHVzIGFuZCBoZWFkZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSByZXNwb25zZS5zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFN0cmVhbSB0aGUgcmVzcG9uc2UgYm9keVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5ib2R5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWFkZXIgPSByZXNwb25zZS5ib2R5LmdldFJlYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVtcCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLnJlYWQoKS50aGVuKCh7IGRvbmUsIHZhbHVlIH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXMud3JpdGUodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHB1bXAoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzdHJlYW1pbmcgcmVzcG9uc2U6JywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgIHB1bXAoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwcm9jZXNzaW5nIHJlcXVlc3Q6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0ludGVybmFsIHNlcnZlciBlcnJvcicgfSkpO1xyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbXBvcnRpbmcgcHJveHkgbW9kdWxlOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xyXG4gICAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiAnRmFpbGVkIHRvIGxvYWQgQVBJIGhhbmRsZXInIH0pKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFJldHVybiB0cnVlIHRvIGJ5cGFzcyB0aGUgcHJveHlcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpXHJcbiAgICB9XHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgLy8gSW5jcmVhc2UgdGhlIHdhcm5pbmcgbGltaXQgdG8gc3VwcHJlc3MgdGhlIHdhcm5pbmcgbWVzc2FnZVxyXG4gICAgY2h1bmtTaXplV2Fy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QUVBLFFBQVEsQ0FBQyxLQUFLLFFBQVE7QUFDcEIsY0FBSSxJQUFJLFFBQVEsaUJBQWlCO0FBRS9CLDBGQUNHLEtBQUssWUFBVTtBQUNkLHFCQUFPLEtBQUssR0FBRyxFQUNaLEtBQUssY0FBWTtBQUVoQixvQkFBSSxhQUFhLFNBQVM7QUFDMUIseUJBQVMsUUFBUSxRQUFRLENBQUMsT0FBTyxRQUFRO0FBQ3ZDLHNCQUFJLFVBQVUsS0FBSyxLQUFLO0FBQUEsZ0JBQzFCLENBQUM7QUFHRCxvQkFBSSxTQUFTLE1BQU07QUFDakIsd0JBQU0sU0FBUyxTQUFTLEtBQUssVUFBVTtBQUN2Qyx3QkFBTSxPQUFPLE1BQU07QUFDakIsMkJBQU8sS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLE1BQU0sTUFBTSxNQUFNO0FBQ3RDLDBCQUFJLE1BQU07QUFDUiw0QkFBSSxJQUFJO0FBQ1I7QUFBQSxzQkFDRjtBQUNBLDBCQUFJLE1BQU0sS0FBSztBQUNmLDJCQUFLO0FBQUEsb0JBQ1AsQ0FBQyxFQUFFLE1BQU0sU0FBTztBQUNkLDhCQUFRLE1BQU0sNkJBQTZCLEdBQUc7QUFDOUMsMEJBQUksSUFBSTtBQUFBLG9CQUNWLENBQUM7QUFBQSxrQkFDSDtBQUNBLHVCQUFLO0FBQUEsZ0JBQ1AsT0FBTztBQUNMLHNCQUFJLElBQUk7QUFBQSxnQkFDVjtBQUFBLGNBQ0YsQ0FBQyxFQUNBLE1BQU0sV0FBUztBQUNkLHdCQUFRLE1BQU0sNkJBQTZCLEtBQUs7QUFDaEQsb0JBQUksYUFBYTtBQUNqQixvQkFBSSxJQUFJLEtBQUssVUFBVSxFQUFFLE9BQU8sd0JBQXdCLENBQUMsQ0FBQztBQUFBLGNBQzVELENBQUM7QUFBQSxZQUNMLENBQUMsRUFDQSxNQUFNLFdBQVM7QUFDZCxzQkFBUSxNQUFNLGlDQUFpQyxLQUFLO0FBQ3BELGtCQUFJLGFBQWE7QUFDakIsa0JBQUksSUFBSSxLQUFLLFVBQVUsRUFBRSxPQUFPLDZCQUE2QixDQUFDLENBQUM7QUFBQSxZQUNqRSxDQUFDO0FBR0gsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsV0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQSxJQUVMLHVCQUF1QjtBQUFBLEVBQ3pCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
