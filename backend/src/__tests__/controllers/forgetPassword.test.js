import { jest } from "@jest/globals";
import { forgetPassword } from "../../controllers/authController.js";
import User from "../../models/userModel.js";
import { generateToken, sendEmail } from "../../utils/index.js";

jest.mock("../../models/userModel.js");
jest.mock("../../utils/index.js");
jest.useFakeTimers();

describe("forgetPassword function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    process.env.BACK_END = "http://localhost:3000";
    jest.clearAllMocks();
  });

  test("should return 400 if user not found", async () => {
    User.findOne.mockResolvedValue(null);

    await forgetPassword(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Sorry, We could not found your account",
    });
  });

  test("should send reset password email and return success message", async () => {
    const mockUser = {
      email: "test@example.com",
      save: jest.fn(),
    };
    User.findOne.mockResolvedValue(mockUser);
    generateToken.mockReturnValue("resetToken123");
    sendEmail.mockResolvedValue(true);

    await forgetPassword(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(generateToken).toHaveBeenCalledWith(mockUser);
    expect(mockUser.resetToken).toBe("resetToken123");
    expect(mockUser.resetTokenExpiration).toBeDefined();
    expect(mockUser.save).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledWith({
      to: "test@example.com",
      subject: "Password Reset",
      html: expect.stringContaining("resetToken123"),
    });

    jest.runAllTimers();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "We've sent a password reset link to your email address",
    });
  });

  test("should return 500 if there is an error", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    await forgetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Database error",
    });
  });
});
