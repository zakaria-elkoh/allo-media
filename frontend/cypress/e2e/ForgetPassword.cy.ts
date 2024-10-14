// cypress/e2e/forget-password.cy.ts

describe("ForgetPassword Component", () => {
  beforeEach(() => {
    cy.visit("/forgetpassword"); // Adjust this URL to match your app's routing
  });

  it("renders the forget password form", () => {
    cy.contains("Forget Password").should("be.visible");
    cy.get('input[placeholder="Email"]').should("be.visible");
    cy.contains("button", "Send Reset Email").should("be.visible");
  });

  it("shows error for invalid email", () => {
    cy.get('input[placeholder="Email"]').type("invalidemail");
    cy.contains("button", "Send Reset Email").click();
    cy.contains("Invalid email address").should("be.visible");
  });

  // it("submits form with valid email", () => {
  //   // cy.intercept("POST", "/api/forget-password", { statusCode: 200 }).as(
  //   //   "forgetPassword"
  //   // );

  //   cy.get('input[placeholder="Email"]').type("valid@example.com");
  // cy.contains("button", "Send Reset Email").click();

  //   cy.get('button[type="submit"]').should("be.disabled");
  //   cy.get('button[type="submit"]').should("contain", "Sending...");

  //   cy.wait("@forgetPassword").then((interception) => {
  //     expect(interception.request.body).to.have.property(
  //       "email",
  //       "valid@example.com"
  //     );
  //   });
  // });

  it("navigates back to login page", () => {
    cy.contains("Back to log in").click();
    cy.url().should("include", "/login");
  });
});
