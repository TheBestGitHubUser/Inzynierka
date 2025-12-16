describe('buy product', () => {
  it('success', () => {
    cy.clientLogin()
    cy.visit('localhost:3000')
    cy.get('#articles').click()
    cy.contains('h3',"Wyniki finału turnieju w Seoulu").click()
    cy.get("#add-comment").clear().type("super artykuł")
    cy.contains("button","dodaj komentarz").click()
  })
})