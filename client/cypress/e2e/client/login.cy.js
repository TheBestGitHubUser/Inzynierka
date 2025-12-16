describe('login', () => {
  it('login sucessful', () => {
    cy.visit('localhost:3000')
    cy.contains("button","zaloguj się").click();

    cy.get('#email').clear().type('mockUser@mock.com')
    cy.get('#password').clear().type('mockUser')

    cy.get("#login").click();
  })

  it('require all', () => {
    cy.visit('localhost:3000')
    cy.contains("button","zaloguj się").click();

    cy.get("#login").click();
    cy.contains("Wszystkie pola są wymagane")
  })

  

  it('wrong login or password', () => {
    cy.visit('localhost:3000')
    cy.contains("button","zaloguj się").click();

    cy.get('#email').clear().type('mockUser@moc.com')
    cy.get('#password').clear().type('mockUse')

    cy.get("#login").click();
    cy.contains("Niepoprawny e_mail lub hasło")
  })


})