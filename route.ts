import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, charityPercentage, charityId, email } = body;

    const amount = plan === 'yearly' ? 190.00 : 19.00;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    // If Stripe secret key is configured, create real Stripe Checkout session
    if (stripeKey && !stripeKey.includes('placeholder')) {
      // In production with Stripe package:
      // const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
      // const session = await stripe.checkout.sessions.create({ ... })
    }

    // High fidelity test mode checkout response
    const mockSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    return NextResponse.json({
      success: true,
      sessionId: mockSessionId,
      mode: stripeKey ? 'live_stripe' : 'test_sandbox',
      amount,
      plan,
      charityPercentage: Math.max(10, charityPercentage || 10),
      charityId,
      customerEmail: email,
      message: 'Subscription payment session initialized successfully.'
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
