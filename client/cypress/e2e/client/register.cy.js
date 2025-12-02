describe('register', () => {
  it('register', () => {
    cy.visit('localhost:3000')
    cy.contains("button","zaloguj się").click();
    cy.get("#register-link").click();

    cy.get('#name').clear().type('mockUser')
    cy.get('#email').clear().type('mockUser@mock.com')
    cy.get('#password').clear().type('mockUser')
    cy.get('#re-password').clear().type('mockUser')
    cy.get('#birthdate').clear().type('2002-11-13')
    cy.get('#selectGender').select('M')

    cy.contains("button","Rejestruj").click();
  })
})