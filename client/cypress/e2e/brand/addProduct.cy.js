describe('add product', () =>{
    it('successful', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");
        cy.get("#products").click();
        cy.get("#new").click();

        cy.get('#name-input').clear().type('shoes')
        cy.get('#price-input').clear().type('99')
        cy.get('#description-input').clear().type('great shoes')
        cy.get('#category-input').select('obuwie')
        cy.get('#url-input').clear().type('https://www.mont.com.au/cdn/shop/products/laspo-tarantula-boulder-womens-1_1000x.jpg?v=1671254109')
        cy.contains("button","akceptuj").click();
    })
})