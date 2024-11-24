const express = require('express');
const stripe = require('stripe')('sk_test_51QOhDNFp7hwTeJYOy1BL1Ynv6hUGvLQTm84rX3ytXF7VMGKtVnbJszXV6c04MNguN7A4RbR7furxywOJZscdj5bU000rnVS44f'); 
const app = express();

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'php',
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 