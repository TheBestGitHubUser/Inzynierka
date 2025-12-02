describe('buy product', () => {
  it('success', () => {
    cy.clientLogin()
    cy.visit('localhost:3000')
    cy.contains("button", "mój profil")                             
        .click();
    cy.contains("button", "historia zakupów")                             
        .click();
    cy.contains("td", "dodaj recenzję")                             
        .click();
    cy.get("#rating-input").clear().type(5)
    cy.get("#comment-input").clear().type('super')

    cy.contains("button","akceptuj")
    .click()

    
    
  })
})