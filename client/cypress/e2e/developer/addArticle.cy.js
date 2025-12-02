describe('add article', () =>{
    it('add', ()=>{
        cy.developerLogin();
        cy.visit("http://localhost:3000/emp");
        cy.get("#articles").click();
        cy.get("#new").click();

        cy.get('#title-input').clear().type('Wyniki finału turnieju w Seoulu')
        cy.get('#content-input').clear().type('cos tam cos tam')
        cy.get('#url-input').clear().type('https://touchstoneclimbing.com/wp-content/uploads/2024/09/DOGPATCH_Pompermayer__228.jpg')
        
        cy.contains("button","akceptuj").click();
    })
})