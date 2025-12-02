describe('add developer', () =>{
    it('add', ()=>{
        cy.developerLogin();
        cy.visit("http://localhost:3000/emp");
        cy.get("#employees").click();
        cy.get("#new").click();

        cy.get('#name-input').clear().type('newEmployee')
        cy.get('#email-input').clear().type('newEmployee@mock.com')
        cy.get('#password-input').clear().type('newEmployee')
        cy.get('#re-password-input').clear().type('newEmployee')
        cy.get('#selectRole').select('junior')
        cy.get('#salary-input').type(5000)
        cy.contains("button","Rejestruj").click();
    })
})