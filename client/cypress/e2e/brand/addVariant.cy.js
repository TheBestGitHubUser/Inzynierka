describe('add product', () =>{
    it('successful', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");

        cy.wait(500)

        cy.get("#products").click();
 

        cy.contains("td", "shoes")      
        .parent()                        
        .find('a:contains("dodaj ilość")') 
        .click();
        

        cy.get('#size-input').clear().type('39')
        cy.get('#stock-input').clear().type('99')
        cy.contains("button","dodaj").click();
    })
})