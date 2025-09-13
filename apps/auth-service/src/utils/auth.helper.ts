import { randomInt } from "crypto";
import { ValidationError } from "../../../../packages/error-hunlder/index.js";
import { sendEmail } from "../utils//sendMail/index.js";
import redis from "../../../../packages/libs//redis/index.js";
import { NextFunction } from "express";

const emailRegex = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;

export const validateRegistrationData = (data: any, userType: "user" | "seller") => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name?.trim() ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country?.trim()))
  ) {
    return new ValidationError("Missing or invalid required fields!");
  }

  if (!emailRegex.test(email)) {
    return new ValidationError("Invalid email format!");
  }

  if (password.length < 8) {
    return new ValidationError("Password must be at least 8 characters long!");
  }

  if (userType === "seller") {
    if (String(phone_number).length < 10) {
      return new ValidationError("Invalid phone number for seller!");
    }
    if (!country?.trim()) {
      return new ValidationError("Invalid country for seller!");
    }
  }

  return true;
};

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(new ValidationError("Account locked due to multiple failed attempts! Try again later(30 minutes)."));
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(new ValidationError("Too many OTP requests! Try again later(1 hour)."));
  } 
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(new ValidationError("OTP already sent! Please wait before requesting a new one(1min)."));
  }
};

export const sendOtp = async (email: string, name: string, template: string) => {
  const otp = randomInt(1000, 9999).toString();
  await sendEmail(email, "OTP for email Verification", template, { name, otp });
  await redis.set(`otp:${email}`, otp, 'EX', 300); // OTP valid for 5 minutes
  await redis.set(`otp_cooldown:${email}`, "true", 'EX', 60); // Attempts counter valid for 1 minute 
};

export const trackOtpRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600); // Lock for 1 hour
    return next(new ValidationError("Too many OTP requests! Try again later(1 hour)."));
  } 
    await redis.set(otpRequestKey, otpRequests + 1);
    await redis.expire(otpRequestKey, 3600); // Reset count after 1 hour 
};