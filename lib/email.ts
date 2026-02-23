import { Resend } from 'resend'
import type { Order } from '@prisma/client'

export const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.EMAIL_FROM ?? 'Bata Ganik <orders@bataganik.com>'

export async function sendOrderConfirmationEmail(
    email: string,
    order: Order & { items: any[] }
) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    await resend.emails.send({
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
                <span style="color: #1a1a1a; font-size: 14px; font-weight: bold;">₦${item.lineTotal.toLocaleString()}</span>
              </div>
            `).join('')}
            <div style="display: flex; justify-content: space-between; padding-top: 16px; margin-top: 8px;">
              <span style="font-size: 16px; font-weight: bold; color: #1a1a1a;">Total</span>
              <span style="font-size: 16px; font-weight: bold; color: #c9a96e;">₦${order.total.toLocaleString()}</span>
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

export async function sendShippingNotificationEmail(
    email: string,
    orderNumber: string,
    trackingInfo?: string
) {
    await resend.emails.send({
        from: FROM,
        to: email,
        subject: `Your order is on its way — ${orderNumber}`,
        html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1c1c;">
        <div style="background: #1a1a1a; padding: 32px; text-align: center;">
          <h1 style="color: #c9a96e; font-size: 28px; margin: 0; letter-spacing: 4px;">BATA GANIK</h1>
        </div>
        <div style="padding: 40px 32px; background: #faf9f6;">
          <h2 style="font-size: 22px;">Your order is on its way. 🎁</h2>
          <p style="color: #666;">Order <strong>${orderNumber}</strong> has been shipped.</p>
          ${trackingInfo ? `<p style="color: #666;">Tracking: <strong>${trackingInfo}</strong></p>` : ''}
          <p style="color: #666; font-size: 14px;">Allow 2–5 business days for delivery within Nigeria.</p>
        </div>
      </div>
    `,
    })
}
