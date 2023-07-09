describe("pet store", () => {
  it("should create, edit and delete pet", () => {
    cy.request({
      url: "https://petstore.swagger.io/v2/pet",
      method: "POST",
      body: {
        id: 1234,
        name: "Doggie",
        photoUrls: [],
      },
    }).then((response) => {
      cy.log(JSON.stringify(response.body)); //если нужно, чтобы лог выбрасывался в консоль во время отладки
      //так можно проверить код ответа
      expect(response.status).eq(200);
      //дополнительная проверка содержимого
      expect(response.body.name).eq("Doggie");
      //проверка полностью объекта
      expect(response.body).eql({
        //eql делает сравнение deeply equal, то есть не важен порядок в списке содержимого
        id: 1234,
        name: "Doggie",
        photoUrls: [],
        tags: [],
      });

      //можем проверить что по GET по id вернется тот же объект
      cy.request(`https://petstore.swagger.io/v2/pet/${response.body.id}`).then(
        (getResponse) => {
          //так можно проверить код ответа
          expect(response.status).eq(200);
          //дополнительная проверка содержимого
          expect(response.body.name).eq("Doggie");
          //проверка полностью объекта
          expect(response.body).eql({
            //eql делает сравнение deeply equal, то есть не важен порядок в списке содержимого
            id: 1234,
            name: "Doggie",
            photoUrls: [],
            tags: [],
          });
        }
      );

      //Проверка DELETE
      cy.request(
        "DELETE",
        `https://petstore.swagger.io/v2/pet/${response.body.id}`
      ).then((deleteResponse) => {
        expect(deleteResponse.status).eq(200);
      });

      //дополнительная проверка, что после удаления GET запрос вернет 404, т.к. объекта нет
      //в данном примере у нас падает тест, если указан не 2хх или 3хх код. и чтобы получить 404, надо указать параметр failOnStatusCode: false
      cy.request({
        failOnStatusCode: false,
        url: `https://petstore.swagger.io/v2/pet/${response.body.id}`,
      }).then((getResponse) => {
        expect(getResponse.status).eq(404);
      });
    });
  });
});
