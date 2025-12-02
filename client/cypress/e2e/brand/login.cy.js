describe('login', () => {
  it('login', () => {
    cy.visit('localhost:3000')
    cy.contains("button","zaloguj się").click();
    cy.get("#brand-link").click();

    cy.get('#email').clear().type('mockBrand@mock.com')
    cy.get('#password').clear().type('mockBrand')

    cy.get("#login").click();
  })
})