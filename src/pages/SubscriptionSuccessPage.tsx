import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FiCheckCircle, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import stripeService from '../api/stripe-service';
import Header from '../components/Header';
import AnimatedFooter from '../components/AnimatedFooter';
import { PRICE_TO_PLAN_MAP } from '../utils/subscriptionConstants';

const SubscriptionSuccessPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshSubscriptionData } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paypalSubscriptionId = searchParams.get('subscription_id');
    
    if (!sessionId && !paypalSubscriptionId) {
      setError('No subscription information found');
      setIsLoading(false);
      return;
    }

    // Function to get PayPal access token
    const getPayPalAccessToken = async (): Promise<string> => {
      try {
        const PAYPAL_API_URL = import.meta.env.VITE_PAYPAL_API_URL || 'https://api-m.paypal.com';
        const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
        const PAYPAL_SECRET = import.meta.env.VITE_PAYPAL_CLIENT_SECRET;

        if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
          throw new Error('PayPal client ID or secret not found in environment variables');
        }

        const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`);
        const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`,
          },
          body: 'grant_type=client_credentials',
        });

        if (!response.ok) {
          throw new Error(`PayPal API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.access_token) {
          throw new Error('PayPal token not received');
        }

        return data.access_token;
      } catch (error) {
        console.error('Error getting PayPal access token:', error);
        throw error;
      }
    };
    
    const fetchSubscriptionDetails = async () => {
      try {
        if (sessionId) {
          // Handle Stripe subscription
          const session = await stripeService.getCheckoutSession(sessionId);
          if (session.subscription) {
            const subscriptionData = await stripeService.getSubscription(session.subscription);
            setSubscription(subscriptionData);
          }
        } else if (paypalSubscriptionId) {
          // Handle PayPal subscription
          const accessToken = await getPayPalAccessToken();
          const PAYPAL_API_URL = import.meta.env.VITE_PAYPAL_API_URL || 'https://api-m.paypal.com';
          
          const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions/${paypalSubscriptionId}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to verify PayPal subscription');
          }
          
          const subscriptionData = await response.json();
          setSubscription({
            items: {
              data: [{
                price: {
                  unit_amount: parseFloat(subscriptionData.billing_info.last_payment.amount.value) * 100,
                  id: subscriptionData.plan_id
                }
              }]
            },
            currency: subscriptionData.billing_info.last_payment.amount.currency_code,
            current_period_end: new Date(subscriptionData.billing_info.next_billing_time).getTime() / 1000,
            status: subscriptionData.status
          });
        }
        
        // Refresh the user's subscription data in the context
        await refreshSubscriptionData();
      } catch (err) {
        console.error('Error fetching subscription details:', err);
        setError('Failed to load subscription details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscriptionDetails();
  }, [searchParams, refreshSubscriptionData]);
  
  // Function to get plan name from price ID
  const getPlanFromPriceId = (priceId: string) => {
    const planId = PRICE_TO_PLAN_MAP[priceId];
    
    if (!planId) return 'Unknown Plan';
    
    switch (planId) {
      case '1': return 'Free';
      case '2': return 'Starter';
      case '3': return 'Pro';
      case '4': return 'Enterprise';
      default: return 'Custom Plan';
    }
  };
  
  // Get subscription details
  const subscriptionPriceId = subscription?.items?.data[0]?.price?.id;
  const planName = subscriptionPriceId ? getPlanFromPriceId(subscriptionPriceId) : 'Unknown Plan';
  const amount = subscription?.items?.data[0]?.price?.unit_amount;
  const formattedAmount = amount ? (amount / 100).toFixed(2) : '0.00';
  const currency = subscription?.currency?.toUpperCase() || 'USD';
  const renewalDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end * 1000).toLocaleDateString()
    : 'Unknown';
  
  return (
    <div className="min-h-screen bg-theme-gradient">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <motion.div
          className="max-w-2xl mx-auto bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-t-purple-500 border-white border-opacity-20 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg">{t('loading_subscription')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCreditCard className="w-8 h-8 text-red-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{t('subscription_error')}</h2>
              <p className="text-violet-200 mb-6">{error}</p>
              <button
                onClick={() => navigate('/pricing')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-full transition-colors"
              >
                {t('back_to_pricing')}
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {t('subscription_confirmed')}
                </h2>
                <p className="text-violet-200">
                  {t('subscription_success_message')}
                </p>
              </div>
              
              <div className="bg-white bg-opacity-5 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {t('subscription_details')}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-violet-200">{t('plan')}:</span>
                    <span className="text-white font-medium">{planName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-violet-200">{t('amount')}:</span>
                    <span className="text-white font-medium">${formattedAmount} {currency}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-violet-200">{t('status')}:</span>
                    <span className="text-green-400 font-medium">{t('active')}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-violet-200">{t('next_renewal')}:</span>
                    <span className="text-white font-medium">{renewalDate}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  {t('my_profile')}
                  <FiArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => {
                    // Redirect to the appropriate dashboard based on the plan
                    switch (planName) {
                      case 'Starter':
                        navigate('/starter-dashboard');
                        break;
                      case 'Pro':
                        navigate('/pro-dashboard');
                        break;
                      case 'Enterprise':
                        navigate('/enterprise-dashboard');
                        break;
                      default:
                        navigate('/interactive-demo');
                    }
                  }}
                  className="flex-1 bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-medium py-3 px-6 rounded-full transition-colors"
                >
                  {t('go_to_dashboard')}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </main>
      
      <AnimatedFooter />
    </div>
  );
};

export default SubscriptionSuccessPage;
