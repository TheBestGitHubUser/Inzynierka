describe('orders', () => {
  it('change status', () => {
    cy.brandLogin()
    cy.visit('localhost:3000/brand')

    cy.wait(500)
    cy.get("#orders").click()

    cy.contains("td", "1")      
        .parent()                        
        .find('a:contains("edytuj")') 
        .click();

    cy.get("#statusSelect").select("completed")

    cy.contains("button","akceptuj").click()
    
  })
})