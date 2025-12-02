describe('login', () => {
  it('login', () => {
    cy.visit('localhost:3000')
    cy.contains("button","zaloguj się").click();

    cy.get('#email').clear().type('mockUser@mock.com')
    cy.get('#password').clear().type('mockUser')

    cy.get("#login").click();
  })
})