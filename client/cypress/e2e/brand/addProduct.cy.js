describe('add product', () =>{
    it('add successful', ()=>{
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

    it('invalid name', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");
        cy.get("#products").click();
        cy.get("#new").click();

        cy.get('#price-input').clear().type('99')
        cy.get('#description-input').clear().type('great shoes')
        cy.get('#category-input').select('obuwie')
        cy.get('#url-input').clear().type('https://www.mont.com.au/cdn/shop/products/laspo-tarantula-boulder-womens-1_1000x.jpg?v=1671254109')
        cy.contains("button","akceptuj").click();
        cy.contains("wprowadź nazwę")
    })

    it('invalid price', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");
        cy.get("#products").click();
        cy.get("#new").click();

        cy.get('#name-input').clear().type('shoes')
        cy.get('#description-input').clear().type('great shoes')
        cy.get('#category-input').select('obuwie')
        cy.get('#url-input').clear().type('https://www.mont.com.au/cdn/shop/products/laspo-tarantula-boulder-womens-1_1000x.jpg?v=1671254109')
        cy.contains("button","akceptuj").click();
        cy.contains("Niepoprawna cena")
    })

    it('invalid description', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");
        cy.get("#products").click();
        cy.get("#new").click();

        cy.get('#name-input').clear().type('shoes')
        cy.get('#price-input').clear().type('99')
        cy.get('#category-input').select('obuwie')
        cy.get('#url-input').clear().type('https://www.mont.com.au/cdn/shop/products/laspo-tarantula-boulder-womens-1_1000x.jpg?v=1671254109')
        cy.contains("button","akceptuj").click();
        cy.contains("wprowadź opis")
    })

    it('invalid category', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");
        cy.get("#products").click();
        cy.get("#new").click();

        cy.get('#name-input').clear().type('shoes')
        cy.get('#price-input').clear().type('99')
        cy.get('#description-input').clear().type('great shoes')
        cy.get('#url-input').clear().type('https://www.mont.com.au/cdn/shop/products/laspo-tarantula-boulder-womens-1_1000x.jpg?v=1671254109')
        cy.contains("button","akceptuj").click();
        cy.contains("wybierz kategorię")
    })

    it('invalid image-url', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");
        cy.get("#products").click();
        cy.get("#new").click();

        cy.get('#name-input').clear().type('shoes')
        cy.get('#price-input').clear().type('99')
        cy.get('#description-input').clear().type('great shoes')
        cy.get('#category-input').select('obuwie')
        cy.contains("button","akceptuj").click();
        cy.contains("Wprowadź link obrazka")
    })
})