import { jest } from "@jest/globals";
import { signUp } from "../../controllers/authController.js";
import userModel from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/index.js";
import { validateSignUp } from "../../validations/signUpSchema.js";

jest.mock("../../models/userModel.js");
jest.mock("bcryptjs");
jest.mock("../../utils/index.js");
jest.mock("../../validations/signUpSchema.js");

describe("signUp function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        firstName: "test",
        lastName: "last",
        userName: "test00",
        email: "test@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User model's findOne method
    userModel.findOne = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 400 if the user already exists", async () => {
    userModel.findOne.mockResolvedValue({ email: "test@example.com" });

    await signUp(req, res);

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "User is already signed up!",
    });
  });

  test("should return 400 if validation fails", async () => {
    userModel.findOne.mockResolvedValue(null);
    jest.mock("../../validations/signUpSchema.js", () => ({
      validateSignUp: jest.fn(),
    }));

    await signUp(req, res);

    expect(validateSignUp).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid input!!!",
      data: "Validation error",
    });
  });

  test("should hash password and create new user", async () => {
    userModel.findOne.mockResolvedValue(null);
    validateSignUp.mockReturnValue({ error: null });
    bcrypt.genSalt.mockResolvedValue("salt");
    bcrypt.hash.mockResolvedValue("hashedPassword");
    userModel.prototype.save = jest.fn().mockResolvedValue({
      _doc: { email: "test@example.com", password: "hashedPassword" },
    });
    generateToken.mockReturnValue("token");

    await signUp(req, res);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", "salt");
    expect(User.prototype.save).toHaveBeenCalled();
    expect(generateToken).toHaveBeenCalledWith(expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User created successfully",
      data: {
        token: "token",
        user: { email: "test@example.com", password: null },
      },
    });
  });

  test("should return 500 if there is an error", async () => {
    userModel.findOne.mockRejectedValue(new Error("Database error"));

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Database error",
    });
  });
});
