import { signUp } from "../../controllers/authController";

const request = {
  body: {
    firstName: "testFirstName",
    lastName: "testLastName",
    userName: "testUser",
    email: "testEmail@test.com",
    password: "testPassword",
  },
};

it("should send a 400 when the user exists", () => {
  signUp(request);
});
