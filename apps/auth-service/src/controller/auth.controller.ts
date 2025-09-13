import { NextFunction, Request, Response } from "express";

import { validateRegistrationData, checkOtpRestrictions, trackOtpRequests, sendOtp } from "../utils/auth.helper.js";
import { ValidationError } from "../../../../packages/error-hunlder/index.js";
import prisma from "../../../../packages/libs/prisma/index.js";

// Register a new user
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "user");

    const { name, email } = req.body;

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      return next(new ValidationError("User already exists with this email!"));
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(email, name, "user-activation-mail");

    res.status(200).json({
      message: "OTP sent to email. Please verify your account.",
    });
  } catch (error) {
    return next(error);
  }
};