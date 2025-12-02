describe('login', () => {
    

  it('login', () => {
    cy.visit('localhost:3000')
    cy.contains("button","zaloguj się").click();
    cy.get("#developer-link").click();

    cy.get('#email').clear().type('mockDeveloper@mock.com')
    cy.get('#password').clear().type('mockDeveloper')

    cy.contains("button","zaloguj się").click();
  })
})