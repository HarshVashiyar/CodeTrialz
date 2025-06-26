const nodemailer = require('nodemailer');

const otpStorage = {};

const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

const sendOTP = async (email) => {
    const otp = generateOTP();
    const expirationTime = Date.now() + 150 * 1000;
    otpStorage[email] = { otp, expirationTime };

    const content = {
        to: email,
        subject: 'Your One-Time Password (OTP) for Email Verification',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px; background: #f9f9f9;">
                <h2 style="color: #333;">Email Verification</h2>
                <p style="font-size: 18px; color: #555;">Use the following OTP to verify your email address:</p>
                <div style="margin: 30px auto; display: inline-block; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 30px 50px;">
                    <span style="font-size: 48px; letter-spacing: 12px; font-weight: bold; color: #2d8cf0;">${otp}</span>
                </div>
                <p style="color: #888; font-size: 14px; margin-top: 30px;">This OTP will expire in 150 seconds.</p>
            </div>
        `,
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_PASSWORD,
        },
    });

    try {
        const response = await transporter.sendMail(content);
        return { expirationTime };
    } catch (error) {
        console.error(`Error sending OTP to ${email}:`, error);
        throw new Error('Failed to send OTP');
    }
}

const verifyOTP = (email, otp) => {
  const otpData = otpStorage[email];
  if (!otpData) {
    return { success: false, message: "OTP not found!" };
  }
  if (Date.now() > otpData.expirationTime) {
    delete otpStorage[email];
    return { success: false, message: "OTP expired!" };
  }
  if (otpData.otp != otp) {
    return { success: false, message: "Invalid OTP!" };
  }
  delete otpStorage[email];
  return { success: true, message: "OTP verified successfully" };
};

module.exports = {
    sendOTP,
    verifyOTP
}