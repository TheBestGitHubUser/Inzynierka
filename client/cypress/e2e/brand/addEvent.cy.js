describe('add event', () =>{
    it('add', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");
        cy.get("#events").click();
        cy.get("#new").click();

        cy.get('#name-input').clear().type('WLB CRUX')
        cy.get('#description-input').clear().type('zapraszamy na turniej WLB edycja CRUX')
        cy.get('#date-input').clear().type('2026-12-12T14:00')
        cy.get('#city-input').type('Warszawa')
        cy.get('#address-input').type('al. Krakowska 51')
        cy.get('#maxCapacity-input').type(20)
        cy.get('#imgURL-input').clear().type('https://www.crux.boulder.pl/wp-content/uploads/2022/04/crux1-1-1024x684.jpeg')
        cy.contains("button","akceptuj").click();
    })
})