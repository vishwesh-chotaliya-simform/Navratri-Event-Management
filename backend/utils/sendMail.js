const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendQRCodeMail = async ({ to, subject, qrCode, event }) => {
  const html = `
    <h2>Your Event Pass for ${event.name}</h2>
    <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
    <p><strong>Location:</strong> ${event.location}</p>
    <p>Your QR code is attached to this email. Please show it at the event.</p>
  `;

  // Extract base64 data from data URL
  const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments: [
      {
        filename: "event-pass-qr.png",
        content: base64Data,
        encoding: "base64",
        contentType: "image/png",
      },
    ],
  });
};
