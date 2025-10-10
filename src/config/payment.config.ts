import Stripe from "stripe";

// Stripe Client
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil" as any,
});

export const paymentGateway = {
  stripe: stripeClient,
};
