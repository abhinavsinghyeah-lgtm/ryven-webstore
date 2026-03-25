const { transporter } = require("../config/email");
const { env } = require("../config/env");
const { formatPricePaise } = require("../utils/format");

const sendOrderConfirmation = async ({ to, order, user }) => {
  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${item.productName} × ${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${formatPricePaise(item.lineTotalPaise, order.currency)}</td>
        </tr>`,
    )
    .join("");

  const loginSection = `
    <p style="margin-top:24px;font-size:14px;color:#555;">Track orders anytime by logging in with OTP:</p>
    <a href="${env.FRONTEND_URL}/login" style="display:inline-block;margin-top:8px;background:#111;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Log in with OTP →</a>
  `;

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;padding:32px 24px;color:#111;">
      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 8px;">ORDER CONFIRMED</p>
      <h1 style="font-size:26px;font-weight:700;margin:0 0 24px;tracking:tight;">Thank you, ${user.fullName.split(" ")[0]}.</h1>

      <p style="font-size:14px;color:#555;margin:0 0 20px;">Your order <strong>#${order.id}</strong> has been received and payment confirmed.</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${itemRows}
        <tr>
          <td style="padding:12px 0 4px;font-size:12px;color:#888;">Subtotal</td>
          <td style="padding:12px 0 4px;text-align:right;font-size:12px;color:#888;">${formatPricePaise(order.subtotalPaise, order.currency)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:12px;color:#888;">Shipping</td>
          <td style="padding:4px 0;text-align:right;font-size:12px;color:#888;">${order.shippingPaise === 0 ? "Free" : formatPricePaise(order.shippingPaise, order.currency)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0 0;font-weight:700;font-size:15px;">Total</td>
          <td style="padding:8px 0 0;text-align:right;font-weight:700;font-size:15px;">${formatPricePaise(order.totalPaise, order.currency)}</td>
        </tr>
      </table>

      <div style="margin-top:24px;padding:16px;background:#f9f9f7;border-radius:10px;font-size:13px;color:#555;">
        <p style="margin:0 0 4px;"><strong>Shipping to</strong></p>
        <p style="margin:0;">${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState} – ${order.shippingPincode}</p>
      </div>

      ${loginSection}

      <p style="margin-top:32px;font-size:12px;color:#aaa;">RYVEN · Questions? Reply to this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: `Order #${order.id} confirmed — RYVEN`,
    html,
  });
};

const sendOtpEmail = async ({ to, code }) => {
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:420px;margin:0 auto;padding:32px 24px;color:#111;">
      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin:0 0 8px;">LOGIN CODE</p>
      <h1 style="font-size:22px;font-weight:700;margin:0 0 12px;">Your RYVEN OTP</h1>
      <p style="font-size:14px;color:#555;margin:0 0 18px;">Use this one-time code to sign in. It expires in 10 minutes.</p>
      <div style="display:inline-block;background:#111;color:#fff;padding:12px 18px;border-radius:10px;font-size:18px;letter-spacing:0.2em;font-weight:700;">
        ${code}
      </div>
      <p style="margin-top:20px;font-size:12px;color:#aaa;">If you didn’t request this, you can ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "Your RYVEN login code",
    html,
  });
};

module.exports = { sendOrderConfirmation, sendOtpEmail };
