import nodemailer from "nodemailer";
import { htmlToText } from "html-to-text";
import { text } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }
  newTransport() {
    // Use Gmail in development
    return nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });
  }
  async send(template, subject) {
    let html = "";

    if (template === "candidateWelcome") {
      html = `
        <p>Hi ${this.firstName},</p>
        <p>Welcome to Fortemove! We're excited to have you.</p>
        <p><a href="${this.url}">Visit your dashboard</a></p>
      `;
    } else if (template === "leadWelcome") {
      html = `
        <p>Hello ${this.firstName},</p>
        <p>Thank you for connecting with Fortemove. We will contact you shortly.</p>
        <p><a href="${this.url}">Visit your profile</a></p>
      `;
    } else if (template === "otp") {
      html = `
        <p>Hi ${this.firstName},</p>
        <p>Your OTP for password reset is: <strong>${this.url}</strong></p>
        <p>This OTP is valid for only 10 minutes.</p>
      `;
    }
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(this.html),
    };
    await this.newTransport().sendMail(mailOptions);
  }
  async sendCandidateWelcome() {
    await this.send("candidateWelcome", "Welcome to Fortemove!");
  }
  async sendLeadWelcome() {
    await this.send("leadWelcome", "Welcome to Fortemove!");
  }
  async sendPasswordReset() {
    await this.send("otp", "Your OTP to reset password (valid for 10 minutes)");
  }
}
