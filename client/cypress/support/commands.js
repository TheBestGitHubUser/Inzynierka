// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.addAll({
  clientLogin(){
    cy.request("POST", "http://localhost:3001/client", {
    email: "mockUser@mock.com",
    password: "mockUser"
  }).then((res) => {
    window.localStorage.setItem("token", res.body.token);
  });
  }
  ,
  brandLogin(){
    cy.request("POST", "http://localhost:3001/brand", {
    email: "mockBrand@mock.com",
    password: "mockBrand"
  }).then((res) => {
    window.localStorage.setItem("token", res.body.token);
  });
  }
  ,
  developerLogin(){
    cy.request("POST", "http://localhost:3001/developer", {
    email: "mockDeveloper@mock.com",
    password: "mockDeveloper"
  }).then((res) => {
    window.localStorage.setItem("token", res.body.token);
  });
  }
  ,
  developerRegister(){
    cy.request("PUT", "http://localhost:3001/putDeveloper", {
    name: "mockDeveloper",
    email: "mockDeveloper@mock.com",
    password: "mockDeveloper",
    role: "admin",
    salary: 5000
  })
  }
})