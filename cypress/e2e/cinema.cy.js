import scenarios from "..//fixtures/admin login.json";

describe("tickets sale page", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("main page, shows 7 days", () => {
    cy.get(".page-nav__day").should("have.length", 7);
  });

  scenarios.forEach((path) => {
    it(`should be logged into the admin - ${path.name}`, () => {
      cy.visit("http://qamid.tmweb.ru/admin");
      cy.get(".page-header__subtitle").should("be.visible");
      cy.contains("Администраторррская").should("be.visible"); //Администраторррская - опечатка

      cy.get('[for="email"] > .login__input').type(path.email);
      cy.get('[for="pwd"] > .login__input').type(path.password);
      cy.get(".login__button").click();

      cy.get("body").then(($body) => {
        if ($body.find("Управление залами").length > 0) {
          cy.contains("Управление залами").should("be.visible");
        } else if ($body.find("Ошибка авторизации").length > 0) {
          cy.contains("Ошибка авторизации").should("be.visible");
        }
      });
    });
  });

  it.only("should booking a movie in an available hall", () => {
    const happyPath = scenarios.find((path) => path.name === "happy path");
    cy.visit("http://qamid.tmweb.ru/admin");
    cy.get(".page-header__subtitle").should("be.visible");
    cy.contains("Администраторррская").should("be.visible"); //Администраторррская - опечатка

    cy.get('[for="email"] > .login__input').type(happyPath.email);
    cy.get('[for="pwd"] > .login__input').type(happyPath.password);
    cy.get(".login__button").click();
    cy.contains("Управление залами").should("be.visible");
  });
});
