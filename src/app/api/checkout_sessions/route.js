import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe'

export async function POST(req) {
  try {
  
    const body = await req.json().catch(() => ({}));
    const { email } = body;

  
    const headersList = await headers()
    const origin = headersList.get('origin') || "http://localhost:3000";

  
    const session = await stripe.checkout.sessions.create({
     
      customer_email: email || undefined, 
      line_items: [
        {
          // Provide the exact Price ID of the product you want to sell
          price: 'price_1TkTq4Qcs3NExJMCip3pfzGI',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard/artist/success?session_id={CHECKOUT_SESSION_ID}`,
     
      cancel_url: `${origin}/dashboard/artist/sales-history`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}