describe('add product variant', () =>{
    it('add variant successful', ()=>{
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

    it('fill all fields error', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");

        cy.wait(500)

        cy.get("#products").click();
 

        cy.contains("td", "shoes")      
        .parent()                        
        .find('a:contains("dodaj ilość")') 
        .click();
        
        cy.contains("button","dodaj").click();

        cy.contains("wypełnij wszystkie pola")
    })

    it('one-size colision', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");

        cy.wait(500)

        cy.get("#products").click();
 

        cy.contains("td", "shoes")      
        .parent()                        
        .find('a:contains("dodaj ilość")') 
        .click();
        

        cy.get('#size-input').clear().type('one-size')
        cy.get('#stock-input').clear().type('99')
        cy.contains("button","dodaj").click();

        cy.contains("nie można dodać one-size z innymi rozmiarami")
    })

    it('size already exist', ()=>{
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

        cy.contains("rozmiar już istnieje")
    })
    
})