describe('register', () => {
  it('register', () => {
    cy.visit('localhost:3000')
    cy.contains("button","zaloguj się").click();
    cy.get("#register-link").click();

    cy.get('#name').clear().type('mockUser')
    cy.get('#email').clear().type('mockUser@mock.com')
    cy.get('#password').clear().type('mockUser')
    cy.get('#re-password').clear().type('mockUser')
    cy.get('#birthdate').clear().type('2002-11-13')
    cy.get('#selectGender').select('M')

    cy.contains("button","Rejestruj").click();
    cy.url().should("include","/login")
  })

  it('name too short', () => {
    cy.visit('localhost:3000')
    cy.contains("button","zaloguj się").click();
    cy.get("#register-link").click();

    cy.get('#name').clear().type('na')
    cy.get('#email').clear().type('newUser@mock.com')
    cy.get('#password').clear().type('mockUser')
    cy.get('#re-password').clear().type('mockUser')
    cy.get('#birthdate').clear().type('2002-11-13')
    cy.get('#selectGender').select('M')


    cy.contains("button","Rejestruj").click();
    cy.contains("Nazwa musi mieć co najmniej 3 znaki")
  })

  it('invalid email', () => {
    cy.visit('localhost:3000')
    cy.contains("button","zaloguj się").click();
    cy.get("#register-link").click();

    cy.get('#name').clear().type('newName')
    cy.get('#email').clear().type('newUsercom')
    cy.get('#password').clear().type('mockUser')
    cy.get('#re-password').clear().type('mockUser')
    cy.get('#birthdate').clear().type('2002-11-13')
    cy.get('#selectGender').select('M')


    cy.contains("button","Rejestruj").click();
    cy.contains("Niepoprawny e-mail")
  })

  it('invalid password', () => {
    cy.visit('localhost:3000')
    cy.contains("button","zaloguj się").click();
    cy.get("#register-link").click();

    cy.get('#name').clear().type('newName')
    cy.get('#email').clear().type('newUser@mock.com')
    cy.get('#password').clear().type('mock')
    cy.get('#re-password').clear().type('mock')
    cy.get('#birthdate').clear().type('2002-11-13')
    cy.get('#selectGender').select('M')


    cy.contains("button","Rejestruj").click();
    cy.contains("hasło zbyt słabe")
  })

  it('passwords does not match', () => {
    cy.visit('localhost:3000')
    cy.contains("button","zaloguj się").click();
    cy.get("#register-link").click();

    cy.get('#name').clear().type('newName')
    cy.get('#email').clear().type('newUser@mock.com')
    cy.get('#password').clear().type('mockBrand')
    cy.get('#re-password').clear().type('mockBran')
    cy.get('#birthdate').clear().type('2002-11-13')
    cy.get('#selectGender').select('M')

    cy.contains("button","Rejestruj").click();
    cy.contains("hasła nie identyczne")
  })
})