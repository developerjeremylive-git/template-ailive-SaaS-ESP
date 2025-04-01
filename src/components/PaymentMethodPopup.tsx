import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

interface PaymentMethodPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentMethodPopup: React.FC<PaymentMethodPopupProps> = ({ isOpen, onClose }) => {
  const { user, supabase } = useAuth();
  const { isDarkTheme } = useApp();
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardNameError, setCardNameError] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');
  const [expiryDateError, setExpiryDateError] = useState('');
  const [cvvError, setCvvError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [userData, setUserData] = useState<{ email: string; username: string } | null>(null); // Add state for user data
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, []);

  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('users')
          .select('email, username')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to fetch user data: ' + error.message);
        } else {
          console.log('User data fetched successfully:', data);
          setUserData(data);
        }
      }
    };

    fetchUserData();
  }, [user?.id, supabase]);

  const validateCardName = (value: string) => {
    if (value.length > 50) {
      setCardNameError('Name must be less than 50 characters.');
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(value)) {
      setCardNameError('Name must contain only letters and spaces.');
      return false;
    }
    setCardNameError('');
    return true;
  };

  const validateCardNumber = (value: string) => {
    if (!/^\d+$/.test(value)) {
      setCardNumberError('Card number must contain only numbers.');
      return false;
    } else if (value.length !== 16) {
      setCardNumberError('Card number must be 16 digits.');
      return false;
    } else {
      setCardNumberError('');
      return true;
    }
  };

  const validateExpiryDate = (value: string) => {
    // Basic expiry date validation (MM/YY format)
    if (value.length !== 5 || value[2] !== '/') {
      setExpiryDateError('Expiry date must be in MM/YY format.');
      return false;
    } else {
      setExpiryDateError('');
      return true;
    }
  };

  const validateCvv = (value: string) => {
    if (!/^\d+$/.test(value)) {
      setCvvError('CVV must contain only numbers.');
      return false;
    } else if (value.length !== 3) {
      setCvvError('CVV must be 3 digits.');
      return false;
    } else {
      setCvvError('');
      return true;
    }
  };

  const isFormValid = () => {
    const hasValidData = cardName.trim() !== '' && cardNumber.trim() !== '' && expiryDate.trim() !== '' && cvv.trim() !== '';
    const hasNoErrors = cardNameError === '' && cardNumberError === '' && expiryDateError === '' && cvvError === '';
    return hasValidData && hasNoErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError('Please fill in all fields correctly.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Implement logic to add the payment method using the PayPal API
      // This is a placeholder implementation. You will need to implement the actual logic using the PayPal API.
      console.log('Adding payment method:', {
        cardName,
        cardNumber,
        expiryDate,
        cvv,
      });

      if (!user?.id) {
        console.error('User ID is missing.');
        setError('User ID is missing.');
        return;
      }

      // Store the payment method details in Supabase
      const { data, error } = await supabase
        .from('payment_methods')
        .insert([
          {
            user_id: user.id,
            card_name: cardName,
            card_number: cardNumber,
            expiry_date: expiryDate,
            cvv: cvv,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding payment method:', error);
        setError('Failed to add payment method: ' + error.message);
      } else {
        console.log('Payment method added successfully!');
        setShowNotification(true);

        // Set a timeout to close the popup after 3 seconds
        timerIdRef.current = setTimeout(() => {
          setShowNotification(false);
          onClose();
        }, 3000);
      }
    } catch (err) {
      console.error('Error adding payment method:', err);
      setError('Failed to add payment method: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return isOpen ? (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg p-8 w-96 shadow-lg shadow-purple-500/50 relative ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-600 to-violet-600'}`}>
        <button
          className="absolute top-4 right-4 text-violet-200 hover:text-white transition-colors"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Add Payment Method</h2>
        <div className="flex flex-col space-y-4 w-full">
          <button
            className="bg-gradient-to-br from-purple-600 to-violet-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-lg shadow-purple-500/50 hover:bg-purple-200"
            onClick={async () => {
              console.log('Stripe button clicked!');
              try {
                const { createStripeCustomer } = useAuth();
                const customerId = await createStripeCustomer(userData?.email || '', userData?.username || '');
                // window.location.href = url; // There is no URL to redirect to.
              } catch (error) {
                console.error('Error creating Stripe customer:', error);
              }
            }}
          >
            Stripe
          </button>
          <button
            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg w-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={async () => {
              console.log('PayPal button clicked!');
              try {
                const { createPaypalCustomer, redirectToPaypal } = useAuth();

                // Function to call create_partner_referral
                const callCreatePartnerReferral = async () => {
                  // Prepare data for create_partner_referral
                  const referralData = {
                    individual_owners: [
                      {
                        names: [
                          {
                            given_name: userData?.username || 'Unknown',
                            surname: userData?.username || 'Unknown',
                          },
                        ],
                      },
                    ],
                    business_entity: {
                      business_type: {
                        type: 'Business',
                      },
                      business_name: userData?.username || 'Unknown',
                    },
                    email: userData?.email || 'test@example.com',
                  };

                  // Call create_partner_referral
                  const createPartnerReferralResponse = await (window as any).useMcpTool({
                    serverName: 'paypal',
                    toolName: 'create_partner_referral',
                    toolArguments: referralData,
                  });

                  console.log('createPartnerReferralResponse', createPartnerReferralResponse);
                  return createPartnerReferralResponse;
                };

                // Call the function
                const createPartnerReferralResponse = await callCreatePartnerReferral();

                console.log('createPartnerReferralResponse', createPartnerReferralResponse);

                // Prepare data for create_order
                const orderData = {
                  intent: 'CAPTURE',
                  purchase_units: [
                    {
                      amount: {
                        currency_code: 'USD',
                        value: '9.99', // Example price
                      },
                      description: 'Subscription Payment',
                    },
                  ],
                };

                // Call create_order
                const createOrderResponse = await (window as any).useMcpTool({
                  serverName: 'paypal',
                  toolName: 'create_order',
                  toolArguments: orderData,
                });

                console.log('createOrderResponse', createOrderResponse);

                // const response = await createPaypalCustomer(user?.email || '', user?.email?.split('@')[0] || '');
                // if (response?.id) {
                //   const url = await redirectToPaypal(response.id);
                //   if (url) {
                //     window.location.href = url;
                //   }
                // } else {
                //   throw new Error('Failed to create PayPal customer');
                // }
              } catch (error) {
                console.error('Error creating PayPal customer:', error);
              }
            }}
          >
            PayPal
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default PaymentMethodPopup;
