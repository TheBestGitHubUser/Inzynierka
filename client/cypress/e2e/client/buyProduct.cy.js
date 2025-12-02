describe('buy product', () => {
  it('success', () => {
    cy.clientLogin()
    cy.visit('localhost:3000')
    cy.contains("h3", "shoes")      
        .parent()                        
        .click();
    cy.get("#variantSelect").select(1)
    cy.contains("button","zapłać").click()
    cy.get("#name-input").clear().type('mockName')
    cy.get("#surname-input").clear().type('mockSurname')
    cy.get("#address-input").clear().type('mockAddress')
    cy.get("#bank-input").clear().type(1234566789)

    cy.contains("button","Kup")
    .click()

    
    
  })
})