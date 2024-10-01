import { jest } from "@jest/globals";
import { signIn } from "../../controllers/authController.js";
import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";

// Mock User model
jest.mock("../../models/userModel.js");

// Mock bcrypt
jest.mock("bcryptjs");

describe("signIn", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should sign in user successfully", async () => {
    const mockUser = { email: "test@example.com", password: "hashedPassword" };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    await signIn(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User signed in successfully",
        data: expect.any(String),
      })
    );
  });

  test("should return 400 if user not found", async () => {
    User.findOne.mockResolvedValue(null);

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  test("should return 400 if password is incorrect", async () => {
    const mockUser = { email: "test@example.com", password: "hashedPassword" };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  test("should return 500 if an error occurs", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });
});
