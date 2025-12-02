describe('register event', () => {
  it('success', () => {
    cy.clientLogin()
    cy.visit('localhost:3000')
    cy.get("#events").click();
    cy.contains("h3","WLB CRUX")
    .click()

    cy.contains("button","zapisz się")
    .click()
    
  })
})