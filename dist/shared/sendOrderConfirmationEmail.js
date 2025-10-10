"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderConfirmationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendOrderConfirmationEmail = (email, order, paymentIntent) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        auth: {
            user: config_1.default.email,
            pass: config_1.default.appPass,
        },
    });
    const mailOptions = {
        from: config_1.default.email,
        to: email,
        subject: `Order Confirmation #${order._id}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            background-color: #f8fafc;
            color: #1e293b;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border-radius: 12px;
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 32px;
            text-align: center;
            color: white;
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.025em;
          }
          
          .header p {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 400;
          }
          
          .content {
            padding: 40px 32px;
          }
          
          .order-summary {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            border-left: 4px solid #667eea;
          }
          
          .order-summary h2 {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
          }
          
          .order-info {
            display: grid;
            gap: 12px;
          }
          
          .order-info-item {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            align-items: center;
            padding: 8px 0;
          }
          
          .order-info-item:not(:last-child) {
            border-bottom: 1px solid #e2e8f0;
          }
          
          .order-info-label {
            font-weight: 500;
            color: #64748b;
            font-size: 14px;
          }
          
          .order-info-value {
            font-weight: 600;
            color: #1e293b;
            font-size: 14px;
          }
          
          .total-amount {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white !important;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 700;
            text-align: center;
            margin: 24px 0;
            letter-spacing: -0.025em;
          }
          
          .section {
            margin-bottom: 32px;
          }
          
          .section h3 {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .items-list {
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          }
          
          .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid #f1f5f9;
          }
          
          .item:last-child {
            border-bottom: none;
          }
          
          .item-details {
            flex: 1;
          }
          
          .item-name {
            font-weight: 600;
            color: #1e293b;
            font-size: 15px;
            margin-bottom: 4px;
          }
          
          .item-quantity {
            color: #64748b;
            font-size: 13px;
            font-weight: 500;
          }
          
          .item-price {
            font-weight: 600;
            color: #059669;
            font-size: 15px;
          }
          
          .address-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 8px;
            padding: 20px;
            border: 1px solid #e2e8f0;
          }
          
          .address-card p {
            margin-bottom: 4px;
            color: #475569;
            font-size: 14px;
            line-height: 1.5;
          }
          
          .payment-info {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-radius: 8px;
            padding: 16px 20px;
            border-left: 4px solid #f59e0b;
            margin: 24px 0;
          }
          
          .payment-info p {
            margin: 0;
            font-size: 14px;
            color: #92400e;
            font-weight: 500;
          }
          
          .payment-id {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 13px;
            background-color: rgba(146, 64, 14, 0.1);
            padding: 4px 8px;
            border-radius: 4px;
            margin-top: 4px;
            display: inline-block;
          }
          
          .footer {
            background-color: #f8fafc;
            padding: 32px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer p {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 16px;
          }
          
          .support-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
            transition: transform 0.2s ease;
          }
          
          .support-button:hover {
            transform: translateY(-1px);
          }
          
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
            margin: 32px 0;
          }
          
          @media only screen and (max-width: 600px) {
            .container {
              margin: 0;
              border-radius: 0;
            }
            
            .header, .content, .footer {
              padding: 24px 20px;
            }
            
            .order-summary {
              padding: 20px;
            }
            
            .item {
              padding: 12px 16px;
            }
            
            .header h1 {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase. Your order is being processed.</p>
          </div>
          
          <!-- Content -->
          <div class="content">
            <!-- Order Summary -->
            <div class="order-summary">
  <h2>Order Summary</h2>
  <div class="order-info">
    <div class="order-info-item">
      <span class="order-info-label">Order ID:-</span>
      <span class="order-info-value">#${order._id}</span>
    </div>
    <div class="order-info-item">
      <span class="order-info-label">Order Date:-</span>
      <span class="order-info-value">${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })}</span>
    </div>
    <div class="order-info-item">
      <span class="order-info-label">Status:-</span>
      <span class="order-info-value">Processing</span>
    </div>
  </div>
</div>

            
            <!-- Total Amount -->
            <div class="total-amount">
              Total: $${order.totalPrice.toFixed(2)}
            </div>
            
            <!-- Items Ordered -->
            <div class="section">
              <h3>Items Ordered</h3>
              <div class="items-list">
                ${order.items
            .map((item) => `
                    <div class="item">
                      <div class="item-details">
                        <div class="item-name">${item.name}-</div>
                        <div class="item-quantity">Quantity: ${item.quantity}</div>
                      </div>
                      <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  `)
            .join("")}
              </div>
            </div>
            
            <!-- Shipping Address -->
            <div class="section">
              <h3>Shipping Address</h3>
              <div class="address-card">
                <p><strong>${order.shippingAddress.name || "Customer"}</strong></p>
                <p>${order.shippingAddress.street}</p>
                <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>
                <p>${order.shippingAddress.country}</p>
              </div>
            </div>
            
            <!-- Payment Information -->
            <div class="payment-info">
              <p><strong>Payment Confirmed</strong></p>
              <span class="payment-id">Payment ID: ${paymentIntent.id}</span>
            </div>
            
            <div class="divider"></div>
            
            <!-- Next Steps -->
            <div class="section">
              <h3>What's Next?</h3>
              <p style="color: #64748b; line-height: 1.6;">
                • You'll receive a shipping confirmation email once your order ships<br>
                • Track your package using the tracking number we'll provide<br>
                • Your order will be delivered within 3-7 business days<br>
                • Questions? Our support team is here to help
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p>Need help with your order? We're here to assist you.</p>
            <a href="#" class="support-button">Contact Support</a>
          </div>
        </div>
      </body>
      </html>
    `,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
