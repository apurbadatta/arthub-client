import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe'

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
 
    const { email, priceId, role, tier } = body;

    const headersList = await headers()
    const origin = headersList.get('origin') || "http://localhost:3000";

 
    const isArtist = role === 'artist';
    
    const successUrl = isArtist 
      ? `${origin}/dashboard/artist/success?session_id={CHECKOUT_SESSION_ID}`
      : `${origin}/dashboard/user/success?session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = isArtist
      ? `${origin}/dashboard/artist/sales-history`
      : `${origin}/dashboard/user/subscription`;

    
    const finalPriceId = priceId || 'price_1TkTq4Qcs3NExJMCip3pfzGI';

    const session = await stripe.checkout.sessions.create({
      customer_email: email || undefined, 
      line_items: [
        {
          price: finalPriceId, 
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        email: email,
        role: role || 'artist',
        tier: tier || 'premium'
      }
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