import scenarios from "..//fixtures/admin login.json";
import numberOfMovieViewers from "..//fixtures/seats.json";

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

  numberOfMovieViewers.forEach((numberOf) => {
    it.only(`should booking a movie in an available hall - ${numberOf.name}`, () => {
      const happyPath = scenarios.find((path) => path.name === "happy path");
      cy.visit("http://qamid.tmweb.ru/admin");
      cy.get(".page-header__subtitle").should("be.visible");
      cy.contains("Администраторррская").should("be.visible"); //Администраторррская - опечатка

      cy.get('[for="email"] > .login__input').type(happyPath.email);
      cy.get('[for="pwd"] > .login__input').type(happyPath.password);
      cy.get(".login__button").click();
      cy.contains("Управление залами").should("be.visible");

      let movieTitle;

      cy.get(".conf-step__movie-title")
        .eq(0)
        .invoke("text")
        .then((text) => {
          movieTitle = text;
          cy.visit("/");
          cy.get(".page-nav__day").should("have.length", 7);
          cy.get(".page-nav__day:nth-of-type(3)").click();
          cy.contains(new RegExp(movieTitle, "i")).should("be.visible");
          cy.get(".movie").first().contains("11:00").click();
          numberOf.data.forEach((seat) => {
            cy.get(
              `.buying-scheme__wrapper > :nth-child(${seat.row}) > :nth-child(${seat.seat})`
            ).click();
          });
          cy.get(".acceptin-button").click();
          cy.contains("Вы выбрали билеты:").should("be.visible");
          cy.get(".ticket__details.ticket__chairs")
            .invoke("text")
            .then((text) => {
              numberOf.data.forEach((seat) => {
                const seatText = `${seat.row}/${seat.seat}`;
                cy.wrap(text).should("contain", seatText);
              });
            });
        });
    });
  });
});
