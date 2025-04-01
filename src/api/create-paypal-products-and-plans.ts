import { NextApiRequest, NextApiResponse } from 'next';

interface PayPalProduct {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  create_time: string;
  links: any[];
}

interface PayPalPlan {
  id: string;
  name: string;
  description: string;
  product_id: string;
  billing_cycles: any[];
  payment_preferences: any;
  create_time: string;
  links: any[];
}

const createPayPalProductsAndPlans = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { accessToken } = req.body;

      // Use the access token to create products and plans on the PayPal server
      console.log('Access Token:', accessToken);

      const products = [
        { name: 'Starter', description: 'Enhanced features for small teams', type: 'SERVICE', category: 'SOFTWARE' },
        { name: 'Professional', description: 'Advanced features for businesses', type: 'SERVICE', category: 'SOFTWARE' },
        { name: 'Enterprise', description: 'Complete access for large organizations', type: 'SERVICE', category: 'SOFTWARE' },
      ];

      const productData: PayPalProduct[] = [];

      for (const product of products) {
        const productResponse = await fetch('https://api-m.sandbox.paypal.com/v1/catalogs/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
          body: JSON.stringify(product),
        });

        const data = await productResponse.json() as PayPalProduct;
        console.log('Product Data:', data);
        productData.push(data);
      }

      const plans = [
        { name: 'Starter Monthly', description: 'Monthly Starter Plan', productId: productData[0].id, price: '9.99', interval_count: 1, interval_unit: 'MONTH', total_cycles: 0 },
        { name: 'Starter Yearly', description: 'Yearly Starter Plan', productId: productData[0].id, price: '99.99', interval_count: 1, interval_unit: 'YEAR', total_cycles: 0 },
        { name: 'Professional Monthly', description: 'Monthly Professional Plan', productId: productData[1].id, price: '19.99', interval_count: 1, interval_unit: 'MONTH', total_cycles: 0 },
        { name: 'Professional Yearly', description: 'Yearly Professional Plan', productId: productData[1].id, price: '199.99', interval_count: 1, interval_unit: 'YEAR', total_cycles: 0 },
        { name: 'Enterprise Monthly', description: 'Monthly Enterprise Plan', productId: productData[2].id, price: '99.99', interval_count: 1, interval_unit: 'MONTH', total_cycles: 0 },
        { name: 'Enterprise Yearly', description: 'Yearly Enterprise Plan', productId: productData[2].id, price: '999.99', interval_count: 1, interval_unit: 'YEAR', total_cycles: 0 },
      ];

      const planData: PayPalPlan[] = [];

      for (const plan of plans) {
        const planResponse = await fetch('https://api-m.sandbox.paypal.com/v1/billing/plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
          body: JSON.stringify({
            product_id: plan.productId,
            name: plan.name,
            description: plan.description,
            billing_cycles: [{
              frequency: { interval_unit: plan.interval_unit, interval_count: plan.interval_count },
              tenure_type: 'REGULAR',
              sequence: 1,
              total_cycles: plan.total_cycles,
              pricing_scheme: { fixed_price: { value: plan.price, currency_code: 'USD' } }
            }],
            payment_preferences: { auto_bill_outstanding: true, setup_fee: { value: '0', currency_code: 'USD' }, payment_failure_threshold: 3 }
          }),
        });

        const data = await planResponse.json() as PayPalPlan;
        console.log('Plan Data:', data);
        planData.push(data);
      }

      res.status(200).json({ message: 'Products and plans created successfully', productData, planData });
    } catch (error) {
      console.error('Error creating products and plans:', error);
      res.status(500).json({ message: 'Error creating products and plans' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default createPayPalProductsAndPlans;
