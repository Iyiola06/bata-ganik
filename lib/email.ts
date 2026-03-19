import { Resend } from 'resend'
import type { Order } from '@prisma/client'

// Lazily initialize — env vars aren't available at module-load time during Next.js build
function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM = process.env.EMAIL_FROM ?? 'Bata Ganik <orders@bataganik.com>'

export async function sendOrderConfirmationEmail(
  email: string,
  order: Order & { items: any[], currency: string }
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  const currencySymbols: Record<string, string> = {
    'NGN': '₦',
    'USD': '$',
    'GBP': '£',
    'EUR': '€'
  }
  const symbol = currencySymbols[order.currency] || '₦'

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Order Confirmed — ${order.orderNumber}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1c1c;">
        <div style="background: #1a1a1a; padding: 32px; text-align: center;">
          <h1 style="color: #c9a96e; font-size: 28px; margin: 0; letter-spacing: 4px;">BATA GANIK</h1>
          <p style="color: #888; margin-top: 8px; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Order Confirmation</p>
        </div>
        <div style="padding: 40px 32px; background: #faf9f6;">
          <h2 style="font-size: 22px; color: #1a1a1a; margin-bottom: 8px;">Thank you for your order.</h2>
          <p style="color: #666; font-size: 15px; margin-bottom: 24px;">
            Your order <strong>${order.orderNumber}</strong> has been received and is being processed.
          </p>
          
          <div style="background: white; border: 1px solid #e8e6e1; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h3 style="font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: #888; margin-bottom: 16px;">Order Summary</h3>
            ${order.items.map((item: any) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0ede8;">
                <span style="color: #1a1a1a; font-size: 14px;">${item.productName} — Size ${item.size} × ${item.quantity}</span>
                <span style="color: #1a1a1a; font-size: 14px; font-weight: bold;">${symbol}${item.lineTotal.toLocaleString()}</span>
              </div>
            `).join('')}
            <div style="display: flex; justify-content: space-between; padding-top: 16px; margin-top: 8px;">
              <span style="font-size: 16px; font-weight: bold; color: #1a1a1a;">Total</span>
              <span style="font-size: 16px; font-weight: bold; color: #c9a96e;">${symbol}${order.total.toLocaleString()}</span>
            </div>
          </div>
          
          <a href="${appUrl}/order-confirmation?orderId=${order.id}" 
             style="display: block; background: #c9a96e; color: white; text-align: center; padding: 16px; border-radius: 4px; text-decoration: none; font-weight: bold; letter-spacing: 1px; font-size: 14px;">
            VIEW YOUR ORDER
          </a>
        </div>
        <div style="background: #1a1a1a; padding: 24px; text-align: center;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            Questions? Email <a href="mailto:support@bataganik.com" style="color: #c9a96e;">support@bataganik.com</a>
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendOrderStatusUpdateEmail(
  email: string,
  firstName: string,
  orderNumber: string,
  newStatus: string
) {
  let statusLabel = newStatus.charAt(0) + newStatus.slice(1).toLowerCase()
  let message = ''
  
  switch (newStatus) {
      case 'PROCESSING':
          statusLabel = 'Confirmed'
          message = 'Good news! Your order has been confirmed and is now being prepared for you.'
          break
      case 'SHIPPED':
          message = 'Exciting news! Your order has been dispatched and is on its way to you.'
          break
      case 'DELIVERED':
          message = 'Your order has been delivered. We hope you love your new luxury footwear!'
          break
      case 'CANCELLED':
          message = 'Your order has been cancelled. If you have any questions, please contact our concierge service.'
          break
      default:
          message = `Your order status has been updated to ${statusLabel}.`
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bata.sulvatech.com'

  await getResend().emails.send({
      from: FROM,
      to: email,
      subject: `Order Update: #${orderNumber} is now ${statusLabel}`,
      html: `
          <div style="font-family: serif; color: #1a2744; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 40px;">
                  <h1 style="text-transform: uppercase; letter-spacing: 2px; margin: 0; color: #1a1a1a;">Bata Ganik</h1>
                  <p style="text-transform: uppercase; font-size: 10px; color: #c9a96e; letter-spacing: 1px; margin-top: 5px;">House of Footwear</p>
              </div>
              <h2 style="font-size: 22px; margin-bottom: 20px; color: #1a1a1a;">Hello ${firstName},</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 30px;">
                  ${message}
              </p>
              <div style="background-color: #faf9f6; padding: 25px; border-radius: 4px; margin: 30px 0; border: 1px solid #f0ede8;">
                  <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888;">Order Status</p>
                  <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #1a1a1a;">${statusLabel}</p>
                  <p style="margin: 20px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888;">Order ID</p>
                  <p style="margin: 5px 0 0; font-size: 15px; color: #1a1a1a; font-weight: medium;">#${orderNumber}</p>
              </div>
              <div style="text-align: center; margin: 40px 0;">
                  <a href="${appUrl}/track-order" style="background-color: #c9a96e; color: white; padding: 16px 32px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; display: inline-block;">Track Your Order</a>
              </div>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0;" />
              <div style="text-align: center; font-size: 11px; color: #999; line-height: 1.5;">
                  <p>© ${new Date().getFullYear()} Bata Ganik. All rights reserved.</p>
                  <p>Victoria Island, Lagos, Nigeria</p>
              </div>
          </div>
      `
  })
}
