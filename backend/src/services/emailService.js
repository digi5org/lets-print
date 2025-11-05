/**
 * Email Service
 * 
 * This service handles sending emails for the application.
 * Currently configured for development mode (console logging).
 * 
 * For production:
 * 1. Install nodemailer: npm install nodemailer
 * 2. Uncomment the nodemailer implementation below
 * 3. Configure SMTP settings in .env file
 * 4. Update the sendEmail function to use nodemailer
 */

// For production, uncomment these lines and install nodemailer:
// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: process.env.SMTP_PORT || 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

/**
 * Send verification email to new user
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} verificationUrl - URL for email verification
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (email, name, verificationUrl) => {
  const subject = 'Complete Your Registration - LetsPrint';
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Complete Your Registration</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; padding: 12px 30px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to LetsPrint!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Your account has been created by the administrator. To complete your registration and activate your account, please set your password by clicking the button below:</p>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Set Your Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
          <p><strong>Important:</strong> This link will expire in 48 hours for security reasons.</p>
          <p>If you didn't expect this email, please contact your administrator.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} LetsPrint. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Hi ${name},

Your account has been created by the administrator. To complete your registration and activate your account, please set your password by visiting this link:

${verificationUrl}

Important: This link will expire in 48 hours for security reasons.

If you didn't expect this email, please contact your administrator.

© ${new Date().getFullYear()} LetsPrint. All rights reserved.
  `;

  // Development mode: Log email to console
  if (process.env.NODE_ENV === 'development') {
    console.log('\n=================================');
    console.log('📧 EMAIL WOULD BE SENT:');
    console.log('=================================');
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`\n${textContent}`);
    console.log('=================================\n');
    return;
  }

  // Production mode: Send actual email using nodemailer
  // Uncomment this block when ready for production:
  /*
  try {
    await transporter.sendMail({
      from: `"${process.env.APP_NAME || 'LetsPrint'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject,
      text: textContent,
      html: htmlContent,
    });
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
  */
};

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} resetUrl - URL for password reset
 * @returns {Promise<void>}
 */
export const sendPasswordResetEmail = async (email, name, resetUrl) => {
  // Similar implementation for password reset
  // TODO: Implement when password reset feature is needed
  console.log(`Password reset email would be sent to ${email}: ${resetUrl}`);
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
