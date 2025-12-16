describe('register', () => {
  it('register sucessful', () => {
    cy.visit('localhost:3000')
    cy.contains("button","zaloguj się").click();
    cy.get("#brand-link").click();
    cy.get("#register-link").click();

    cy.get('#name').clear().type('mockBrand')
    cy.get('#email').clear().type('mockBrand@mock.com')
    cy.get('#password').clear().type('mockBrand')
    cy.get('#re-password').clear().type('mockBrand')
    cy.get('#nip').clear().type('123987465')

    cy.contains("button","Rejestruj").click();
    cy.url().should("include","/brandLogin")
  })

  it('name too short', () => {
    cy.visit('localhost:3000')
    cy.contains("button","zaloguj się").click();
    cy.get("#brand-link").click();
    cy.get("#register-link").click();

    cy.get('#name').clear().type('na')
    cy.get('#email').clear().type('mockBrand@mock.com')
    cy.get('#password').clear().type('mockBrand')
    cy.get('#re-password').clear().type('mockBrand')
    cy.get('#nip').clear().type('123987465')

    cy.contains("button","Rejestruj").click();
  })
})