describe('add review', () => {
  it('wrong rating', () => {
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
  it('invalid rating', () => {
    cy.clientLogin()
    cy.visit('localhost:3000')
    cy.contains("button", "mój profil")                             
        .click();
    cy.contains("button", "historia zakupów")                             
        .click();
    cy.contains("td", "dodaj recenzję")                             
        .click();
    cy.get("#rating-input").clear().type(6)
    cy.get("#comment-input").clear().type('super')

    cy.contains("button","akceptuj")
    .click()

    cy.contains("ocena od 1 do 5")
  })
})