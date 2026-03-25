const axios = require("axios");
const { env } = require("../config/env");

const hasTwilioConfig = Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM_NUMBER);

const sendOtpSms = async ({ to, code }) => {
  if (!hasTwilioConfig) {
    throw new Error("SMS provider not configured");
  }

  const target = to.startsWith("+") ? to : `+91${to}`;
  const message = `Your RYVEN OTP is ${code}. It expires in 10 minutes.`;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;

  const params = new URLSearchParams();
  params.append("To", target);
  params.append("From", env.TWILIO_FROM_NUMBER);
  params.append("Body", message);

  await axios.post(url, params, {
    auth: {
      username: env.TWILIO_ACCOUNT_SID,
      password: env.TWILIO_AUTH_TOKEN,
    },
  });
};

module.exports = { sendOtpSms };
