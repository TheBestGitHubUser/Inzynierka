describe('add event', () =>{
    it('add event sucessful', ()=>{
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

        cy.url().should("include","/events")
    })

    it('invalid name', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");
        cy.get("#events").click();
        cy.get("#new").click();

        cy.get('#description-input').clear().type('zapraszamy na turniej WLB edycja CRUX')
        cy.get('#date-input').clear().type('2026-12-12T14:00')
        cy.get('#city-input').type('Warszawa')
        cy.get('#address-input').type('al. Krakowska 51')
        cy.get('#maxCapacity-input').type(20)
        cy.get('#imgURL-input').clear().type('https://www.crux.boulder.pl/wp-content/uploads/2022/04/crux1-1-1024x684.jpeg')
        cy.contains("button","akceptuj").click();
        cy.contains("wprowadź nazwę")
    })

    it('invalid description', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");
        cy.get("#events").click();
        cy.get("#new").click();

        cy.get('#name-input').clear().type('WLB CRUX')
        cy.get('#date-input').clear().type('2026-12-12T14:00')
        cy.get('#city-input').type('Warszawa')
        cy.get('#address-input').type('al. Krakowska 51')
        cy.get('#maxCapacity-input').type(20)
        cy.get('#imgURL-input').clear().type('https://www.crux.boulder.pl/wp-content/uploads/2022/04/crux1-1-1024x684.jpeg')
        cy.contains("button","akceptuj").click();
        cy.contains("wprowadź opis")
    })

    it('invalid city', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");
        cy.get("#events").click();
        cy.get("#new").click();

        cy.get('#name-input').clear().type('WLB CRUX')
        cy.get('#description-input').clear().type('zapraszamy na turniej WLB edycja CRUX')
        cy.get('#date-input').clear().type('2026-12-12T14:00')
        cy.get('#address-input').type('al. Krakowska 51')
        cy.get('#maxCapacity-input').type(20)
        cy.get('#imgURL-input').clear().type('https://www.crux.boulder.pl/wp-content/uploads/2022/04/crux1-1-1024x684.jpeg')
        cy.contains("button","akceptuj").click();
        cy.contains("wprowadź miasto")
    })

    it('invalid address', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");
        cy.get("#events").click();
        cy.get("#new").click();

        cy.get('#name-input').clear().type('WLB CRUX')
        cy.get('#description-input').clear().type('zapraszamy na turniej WLB edycja CRUX')
        cy.get('#date-input').clear().type('2026-12-12T14:00')
        cy.get('#city-input').type('Warszawa')
        cy.get('#maxCapacity-input').type(20)
        cy.get('#imgURL-input').clear().type('https://www.crux.boulder.pl/wp-content/uploads/2022/04/crux1-1-1024x684.jpeg')
        cy.contains("button","akceptuj").click();
        cy.contains("wprowadź adres")
    })

    it('invalid capacity', ()=>{
        cy.brandLogin();
        cy.visit("http://localhost:3000/brand");
        cy.get("#events").click();
        cy.get("#new").click();

        cy.get('#name-input').clear().type('WLB CRUX')
        cy.get('#description-input').clear().type('zapraszamy na turniej WLB edycja CRUX')
        cy.get('#date-input').clear().type('2026-12-12T14:00')
        cy.get('#city-input').type('Warszawa')
        cy.get('#address-input').type('al. Krakowska 51')
        cy.get('#imgURL-input').clear().type('https://www.crux.boulder.pl/wp-content/uploads/2022/04/crux1-1-1024x684.jpeg')
        cy.contains("button","akceptuj").click();
        cy.contains("ilość powinno być więcej niż 1")
    })

    it('invalid image-url', ()=>{
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
        cy.contains("button","akceptuj").click();
        cy.contains("Wprowadź link obrazka")
    })
})