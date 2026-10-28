const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'Praveen Rai Portfolio'} <${
        process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER
      }>`,
      to,
      subject,
      text: text || '',
      html: html || text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Sent]: Message ID: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Error]: ${error.message}`);
    // Return error without throwing so server operations can continue gracefully
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
