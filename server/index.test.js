process.env.NODE_ENV = "test"

const request = require("supertest");
const routes =  require('./routes/routes')
const db = require('./models')

require('dotenv').config();
const jwt = require("jsonwebtoken");

let tokenClient = '';
let tokenClient2 = '';
let tokenBrand = '';
let tokenDeveloper = ''

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    
    {
        const newClient = {
                name: "clientToken",
                email: "clientToken@mock.com",
                password: "clientToken",
                birthDate: "2002-11-13",
                gender: "M",
            }

            const req = await request(routes)
                .put('/putClient')
                .send(newClient)


    const res = await request(routes)
        .post("/client")
        .send({
            email: "clientToken@mock.com",
            password: "clientToken"
        });

    tokenClient = res.body.token;
    }

    {
        const newClient = {
                name: "clientToken2",
                email: "clientToken2@mock.com",
                password: "clientToken2",
                birthDate: "2002-11-13",
                gender: "M",
            }

            const req = await request(routes)
                .put('/putClient')
                .send(newClient)


    const res = await request(routes)
        .post("/client")
        .send({
            email: "clientToken2@mock.com",
            password: "clientToken2"
        });

    tokenClient2 = res.body.token;
    }

    {
        const newBrand = {
                name: "brandToken",
                email: "brandToken@mock.com",
                password: "brandToken",
                nipNumber: 123456789
            }

            const req = await request(routes)
                .put('/putBrand')
                .send(newBrand)


    const res = await request(routes)
        .post("/brand")
        .send({
            email: "brandToken@mock.com",
            password: "brandToken"
        });

    tokenBrand = res.body.token;
    }
    
    {
        const newDeveloper = {
                name: "developerToken",
                email: "developerToken@mock.com",
                password: "developerToken",
                role: "admin",
                salary: 9000
            }

            const req = await request(routes)
                .put('/putDeveloper')
                .send(newDeveloper)


    const res = await request(routes)
        .post("/developer")
        .send({
            email: "developerToken@mock.com",
            password: "developerToken"
        });

    tokenDeveloper = res.body.token;
    }
});

describe('Register', () =>{
    describe('Sucess cases',() =>{
            it('create new client', async () => {
            const newClient = {
                name: "mockUser",
                email: "mockUser@mock.com",
                password: "mockUser",
                birthDate: "2002-11-13",
                gender: "M",
            }

            const res = await request(routes)
                .put('/putClient')
                .send(newClient)
                .set("Accept","application/json")

                expect(res.statusCode).toBe(200)
        })

        it('create new brand', async () => {
            const newBrand = {
                name: "mockBrand",
                email: "mockBrand@mock.com",
                password: "mockBrand",
                nipNumber: 212031405,
            }

            const res = await request(routes)
                .put('/putBrand')
                .send(newBrand)
                .set("Accept","application/json")

                expect(res.statusCode).toBe(200)
        })

        it('create new developer', async () => {
            const newDeveloper = {
                name: "mockDeveloper",
                email: "mockDeveloper@mock.com",
                password: "mockDeveloper",
                role: 'junior',
                salary: 7000
            }

            const res = await request(routes)
                .put('/putDeveloper')
                .send(newDeveloper)
                .set("Accept","application/json")

                expect(res.statusCode).toBe(200)
        })
    })
    describe('Errors', () =>{
          it('400 name too short', async () => {
            const newClient = {
                name: "c",
                email: "mockUser1@mock.com",
                password: "mockUser",
                birthDate: "2002-11-13",
                gender: "M",
            }

            const res = await request(routes)
                .put('/putClient')
                .send(newClient)
                .set("Accept","application/json")

                expect(res.statusCode).toBe(400)
                expect(res.body.error).toBe('Name must be at least 3 characters long')
        })

        it('400 invalid email format', async () => {
            const newBrand = {
                name: "mockBrand1",
                email: "mockBrandcom",
                password: "mockBrand",
                nipNumber: 212031405,
            }

            const res = await request(routes)
                .put('/putBrand')
                .send(newBrand)
                .set("Accept","application/json")

                expect(res.statusCode).toBe(400)
                expect(res.body.error).toBe('Invalid email format')
        })

        it('400 password too short', async () => {
            const newDeveloper = {
                name: "mockDeveloper1",
                email: "mockDeveloper1@mock.com",
                password: "mock",
                role: 'junior',
                salary: 7000
            }

            const res = await request(routes)
                .put('/putDeveloper')
                .send(newDeveloper)
                .set("Accept","application/json")

                expect(res.statusCode).toBe(400)
                expect(res.body.error).toBe('Password must be at least 8 characters long')
        })

        it('400 birthday from the future', async () => {
            const newClient = {
                name: "mockUser1",
                email: "mockUser1@mock.com",
                password: "mockUser",
                birthDate: "2052-11-13",
                gender: "M",
            }

            const res = await request(routes)
                .put('/putClient')
                .send(newClient)
                .set("Accept","application/json")

                expect(res.statusCode).toBe(400)
                expect(res.body.error).toBe('Birth date cannot be in the future')
        })

        it('400 same email', async () => {
            const newClient = {
                name: "mockUser1",
                email: "mockUser@mock.com",
                password: "mockUser",
                birthDate: "2022-11-13",
                gender: "M",
            }

            const res = await request(routes)
                .put('/putClient')
                .send(newClient)
                .set("Accept","application/json")

                expect(res.statusCode).toBe(400)
                expect(res.body.error).toBe('Email already exists')
        })

        it('400 same name', async () => {
            const newClient = {
                name: "mockUser",
                email: "mockUser1@mock.com",
                password: "mockUser",
                birthDate: "2022-11-13",
                gender: "M",
            }

            const res = await request(routes)
                .put('/putClient')
                .send(newClient)
                .set("Accept","application/json")

                expect(res.statusCode).toBe(400)
                expect(res.body.error).toBe('Name already exists')
        })

    })
})
describe("Login", () =>{
        describe('Success cases', ()=>{
            it("client login", async() =>{
                const client= {
                    email: "mockUser@mock.com",
                    password: "mockUser"
                }

                const res = await request(routes)
                .post('/client')
                .send(client)
                .set("Accept","application/json")

                expect(res.statusCode).toBe(200)
            })
            it("brand login", async() =>{
                const brand= {
                    email: "mockBrand@mock.com",
                    password: "mockBrand"
                }

                const res = await request(routes)
                .post('/brand')
                .send(brand)
                .set("Accept","application/json")

                expect(res.statusCode).toBe(200)
            })
            it("developer login", async() =>{
                const developer= {
                    email: "mockDeveloper@mock.com",
                    password: "mockDeveloper"
                }

                const res = await request(routes)
                .post('/developer')
                .send(developer)
                .set("Accept","application/json")

                expect(res.statusCode).toBe(200)
            })
        })

        describe('Errors', () =>{
            it('400 user not found', async() =>{
                const client= {
                    email: "wrongEmail@mock.com",
                    password: "mockUser"
                }

                const res = await request(routes)
                .post('/client')
                .send(client)
                .set("Accept","application/json")

                expect(res.statusCode).toBe(400)
                expect(res.body.err).toBe('client not found')
            })
            it('400 wrong password', async() =>{
                const client= {
                    email: "mockUser@mock.com",
                    password: "wrongPassword"
                }

                const res = await request(routes)
                .post('/client')
                .send(client)
                .set("Accept","application/json")

                expect(res.statusCode).toBe(400)
                expect(res.body.err).toBe('wrong password')
            })
        })
    })

describe("JWT authentication", () =>{
    describe("Sucess cases", ()=>{
        it('valid JWT', async()=>{
             const res = await request(routes)
            .get("/profileClient")
            .set("Authorization", `Bearer ${tokenClient}`);

            expect(res.statusCode).toBe(200);
        })
    })
    describe("Errors", ()=>{
        it("401 no token provided", async () => {
        const res = await request(routes).get("/profileClient");

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("No token provided");
    });

    it("403 invalid token", async () => {
        const res = await request(routes)
            .get("/profileClient")
            .set("Authorization", "Bearer BADTOKEN");

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("Invalid token");
    });

     it("404 Client not found", async () => {
        const wrongToken = jwt.sign(
            { id: 999, gender: "F" },
            process.env.JWT_SECRET_TOKEN,
            { expiresIn: "1h" }
        );

        const res = await request(routes)
            .get("/profileClient")
            .set("Authorization", `Bearer ${wrongToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("User not found");
    });
    })
})
describe("Profile edit",()=>{
    describe("Success cases", ()=>{
        it("profile edit", async()=>{
             const profileReq = await request(routes)
            .get("/profileClient")
            .set("Authorization", `Bearer ${tokenClient}`);
        
            expect(profileReq.statusCode).toBe(200);

            const userID = profileReq.body.userID;

            expect(userID).toBeDefined();

            const clientEdit = {
                name: "newName",
                email: "newEmail@email.com"
            }
            
            const req = await request(routes)
                .post('/editProfile/'+userID)
                .send(clientEdit)
                .set("Authorization", `Bearer ${tokenClient}`);

            expect(req.statusCode).toBe(200);

        })
        

        it("change password", async()=>{
             const profileReq = await request(routes)
            .get("/profileClient")
            .set("Authorization", `Bearer ${tokenClient}`);
        
            expect(profileReq.statusCode).toBe(200);

            const userID = profileReq.body.userID;

            expect(userID).toBeDefined();

            const password = {
                password: 'clientToken',
                newPassword: 'newPassword'
            }
            
            const req = await request(routes)
                .post('/changePassword/'+userID)
                .send(password)
                .set("Authorization", `Bearer ${tokenClient}`);

            expect(req.statusCode).toBe(200);

        })


    })
})

describe("PUT commands",()=>{
        it('put event', async()=>{

            const profileReq = await request(routes)
            .get("/profileBrand")
            .set("Authorization", `Bearer ${tokenBrand}`);
        
            expect(profileReq.statusCode).toBe(200);

            const brandId = profileReq.body.id;

            expect(brandId).toBeDefined();

            const event = {
                brandID: brandId,
                name: 'event',
                description: 'come and climb',
                date: '2025-12-12',
                city: 'Warszawa',
                address: 'al. Krakowska 51',
                maxCapacity: 1,
                status: 'upcoming',
                imgURL: 'c',
            }

            const event2 = {
                brandID: brandId,
                name: 'event2',
                description: 'come and climb',
                date: '2025-12-12',
                city: 'Warszawa',
                address: 'al. Krakowska 51',
                maxCapacity: 20,
                status: 'finished',
                imgURL: 'c',
            }

            const req = await request(routes)
                .put('/putEvent')
                .send(event)
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(200);

            const req2 = await request(routes)
                .put('/putEvent')
                .send(event2)
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req2.statusCode).toBe(200);

        })

        it('put participation', async()=>{

            const profileReq = await request(routes)
            .get("/profileClient")
            .set("Authorization", `Bearer ${tokenClient}`);
        
            expect(profileReq.statusCode).toBe(200);

            const clientID = profileReq.body.id;

            expect(clientID).toBeDefined();

            const participation = {
                clientID : clientID,
                eventID : 1
            }

            const req = await request(routes)
                .put('/putParticipation')
                .send(participation)
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(200);

        })

        it('put product', async()=>{

            const profileReq = await request(routes)
            .get("/profileBrand")
            .set("Authorization", `Bearer ${tokenBrand}`);
        
            expect(profileReq.statusCode).toBe(200);

            const brandId = profileReq.body.id;

            expect(brandId).toBeDefined();

            const product = {
                brandID: brandId,
                name: 'mockShoes',
                description: 'great shoes',
                price: 199,
                category: 'obuwie',
                imgURL: 'picture.jpg',
            }

            const product2 = {
                brandID: brandId,
                name: 'mockShoes2',
                description: 'great shoes',
                price: 199,
                category: 'obuwie',
                imgURL: 'picture.jpg',
            }

             const product3 = {
                brandID: brandId,
                name: 'mockShoes3',
                description: 'great shoes',
                price: 199,
                category: 'obuwie',
                imgURL: 'picture.jpg',
            }

            const req = await request(routes)
                .put('/putProduct')
                .send(product)
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(200);

            const req2 = await request(routes)
                .put('/putProduct')
                .send(product2)
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req2.statusCode).toBe(200);

            const req3 = await request(routes)
                .put('/putProduct')
                .send(product3)
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req3.statusCode).toBe(200);

        })

        it('put product variant', async()=>{

            const productVariant = {
                productID: 1,
                size: 'one-size',
                stock: 10,
            }

            const req = await request(routes)
                .put('/putProductVariant')
                .send(productVariant)
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(200);

            const productVariant2 = {
                productID: 2,
                size: 'M',
                stock: 10,
            }

            const req2 = await request(routes)
                .put('/putProductVariant')
                .send(productVariant2)
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req2.statusCode).toBe(200);

        })

        it('put order', async()=>{

            const profileReq = await request(routes)
            .get("/profileClient")
            .set("Authorization", `Bearer ${tokenClient}`);
        
            expect(profileReq.statusCode).toBe(200);

            const clientID = profileReq.body.id;

            expect(clientID).toBeDefined();

            const order = {
                clientID: clientID,
                productID: 1,
                name: 'Mike',
                surname: 'Wazowski',
                productVariantID: 1,
                price: 199,
                address: 'dom 10',
                status: 'completed'
            }

            const order2 = {
                clientID: clientID,
                productID: 2,
                name: 'Mike',
                surname: 'Wazowski',
                productVariantID: 2,
                price: 199,
                address: 'dom 10',
                status: 'pending'
            }

            const req = await request(routes)
                .put('/putOrder')
                .send(order)
                .set("Authorization", `Bearer ${tokenClient}`);

            expect(req.statusCode).toBe(200);

            const req2 = await request(routes)
                .put('/putOrder')
                .send(order2)
                .set("Authorization", `Bearer ${tokenClient}`);

            expect(req2.statusCode).toBe(200);

        })

        it('put review', async()=>{

            const profileReq = await request(routes)
            .get("/profileClient")
            .set("Authorization", `Bearer ${tokenClient}`);
        
            expect(profileReq.statusCode).toBe(200);

            const clientID = profileReq.body.id;

            expect(clientID).toBeDefined();

            const review = {
                clientID: clientID,
                productID: 1,
                rating: 4,
                comment: 'super',
            }

            const req = await request(routes)
                .put('/putReview')
                .send(review)
                .set("Authorization", `Bearer ${tokenClient}`);

            expect(req.statusCode).toBe(200);

        })

        it('put article', async()=>{

            const profileReq = await request(routes)
            .get("/profileDeveloper")
            .set("Authorization", `Bearer ${tokenDeveloper}`);
        
            expect(profileReq.statusCode).toBe(200);

            const developerID = profileReq.body.id;

            expect(developerID).toBeDefined();

            const article = {
                developerID: developerID,
                title: 'something',
                content: 'something something',
                imgURL: 'img.jpg',
            }

            const req = await request(routes)
                .put('/putArticle')
                .send(article)
                .set("Authorization", `Bearer ${tokenDeveloper}`);

            expect(req.statusCode).toBe(200);

        })

        it('put comment', async()=>{

            const profileReq = await request(routes)
            .get("/profileClient")
            .set("Authorization", `Bearer ${tokenClient}`);
        
            expect(profileReq.statusCode).toBe(200);

            const clientID = profileReq.body.id;

            expect(clientID).toBeDefined();

            const comment = {
                clientID: clientID,
                articleID: 1,
                content: 'something something',
            }

            const req = await request(routes)
                .put('/putComment')
                .send(comment)
                .set("Authorization", `Bearer ${tokenClient}`);

            expect(req.statusCode).toBe(200);
    })  
})

describe('GET commands', () =>{
    it('client get orders', async()=>{
        const profileReq = await request(routes)
        .get("/profileClient")
        .set("Authorization", `Bearer ${tokenClient}`);
    
        expect(profileReq.statusCode).toBe(200);
        const clientID = profileReq.body.id;
        expect(clientID).toBeDefined();
        const req = await request(routes)
            .get('/getClientOrders/'+clientID)
            .set("Authorization", `Bearer ${tokenClient}`);
        expect(req.statusCode).toBe(200);
    })

    it('client get participations', async()=>{
        const profileReq = await request(routes)
        .get("/profileClient")
        .set("Authorization", `Bearer ${tokenClient}`);
    
        expect(profileReq.statusCode).toBe(200);
        const clientID = profileReq.body.id;
        expect(clientID).toBeDefined();
        const req = await request(routes)
            .get('/getClientParticipation/'+clientID)
            .set("Authorization", `Bearer ${tokenClient}`);
        expect(req.statusCode).toBe(200);
    })

    it('brand get product', async()=>{
        const profileReq = await request(routes)
        .get("/profileBrand")
        .set("Authorization", `Bearer ${tokenBrand}`);
    
        expect(profileReq.statusCode).toBe(200);
        const brandID = profileReq.body.id;
        expect(brandID).toBeDefined();
        const req = await request(routes)
            .get('/brands/getProducts/'+brandID)
            .set("Authorization", `Bearer ${tokenBrand}`);
        expect(req.statusCode).toBe(200);
    })

    it('brand get orders', async()=>{
        const profileReq = await request(routes)
        .get("/profileBrand")
        .set("Authorization", `Bearer ${tokenBrand}`);
    
        expect(profileReq.statusCode).toBe(200);
        const brandID = profileReq.body.id;
        expect(brandID).toBeDefined();
        const req = await request(routes)
            .get('/getBrandOrders/'+brandID)
            .set("Authorization", `Bearer ${tokenBrand}`);
        expect(req.statusCode).toBe(200);
    })

    it('brand get events', async()=>{
        const profileReq = await request(routes)
        .get("/profileBrand")
        .set("Authorization", `Bearer ${tokenBrand}`);
    
        expect(profileReq.statusCode).toBe(200);
        const brandID = profileReq.body.id;
        expect(brandID).toBeDefined();
        const req = await request(routes)
            .get('/brandGetEvents/'+brandID)
            .set("Authorization", `Bearer ${tokenBrand}`);
        expect(req.statusCode).toBe(200);
    })

    it('Developer get Clients', async()=>{
        const req = await request(routes)
            .get('/getClients')
            .set("Authorization", `Bearer ${tokenDeveloper}`);
        expect(req.statusCode).toBe(200);
    })

    it('Developer get brands', async()=>{
        const req = await request(routes)
            .get('/getBrands')
            .set("Authorization", `Bearer ${tokenDeveloper}`);
        expect(req.statusCode).toBe(200);
    })
    it('Developer get articles', async()=>{
        const profileReq = await request(routes)
        .get("/profileDeveloper")
        .set("Authorization", `Bearer ${tokenDeveloper}`);
    
        expect(profileReq.statusCode).toBe(200);
        const developerID = profileReq.body.id;
        expect(developerID).toBeDefined();
        const req = await request(routes)
            .get('/getDevArticles/'+developerID)
            .set("Authorization", `Bearer ${tokenDeveloper}`);
        expect(req.statusCode).toBe(200);
    })
})

describe("Integration tests", ()=>{
        it('400 past event', async()=>{

            const profileReq = await request(routes)
            .get("/profileClient")
            .set("Authorization", `Bearer ${tokenClient}`);
        
            expect(profileReq.statusCode).toBe(200);

            const clientID = profileReq.body.id;

            expect(clientID).toBeDefined();

            const participation = {
                clientID : clientID,
                eventID : 2
            }

            const req = await request(routes)
                .put('/putParticipation')
                .send(participation)
                .set("Authorization", `Bearer ${tokenClient}`);

            expect(req.statusCode).toBe(400);
            expect(req.body.error).toBe("too late to sign up");

        })

        it('400 already signed up for', async()=>{

            const profileReq = await request(routes)
            .get("/profileClient")
            .set("Authorization", `Bearer ${tokenClient}`);
        
            expect(profileReq.statusCode).toBe(200);

            const clientID = profileReq.body.id;

            expect(clientID).toBeDefined();

            const participation = {
                clientID : clientID,
                eventID : 1
            }

            const req = await request(routes)
                .put('/putParticipation')
                .send(participation)
                .set("Authorization", `Bearer ${tokenClient}`);

            expect(req.statusCode).toBe(400);
            expect(req.body.error).toBe("already signed up");

        })

        it('400 participations limit reached', async()=>{

            const profileReq = await request(routes)
            .get("/profileClient")
            .set("Authorization", `Bearer ${tokenClient2}`);
        
            expect(profileReq.statusCode).toBe(200);

            const clientID = profileReq.body.id;

            expect(clientID).toBeDefined();

            const participation = {
                clientID : clientID,
                eventID : 1
            }

            const req = await request(routes)
                .put('/putParticipation')
                .send(participation)
                .set("Authorization", `Bearer ${tokenClient2}`);

            expect(req.statusCode).toBe(400);
            expect(req.body.error).toBe("limit reached");

        })

        it('400 negative price', async()=>{

            const profileReq = await request(routes)
            .get("/profileBrand")
            .set("Authorization", `Bearer ${tokenBrand}`);
        
            expect(profileReq.statusCode).toBe(200);

            const brandId = profileReq.body.id;

            expect(brandId).toBeDefined();

            const product = {
                brandID: brandId,
                name: 'mockShoes',
                description: 'great shoes',
                price: -200,
                category: 'obuwie',
                imgURL: 'picture.jpg',
            }

            

            const req = await request(routes)
                .put('/putProduct')
                .send(product)
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(400);
            expect(req.body.error).toBe('price cant be negative');

        })


        it('400 one-size collision', async()=>{

            const productVariant = {
                productID: 1,
                size: 'M',
                stock: 10,
            }

            const req = await request(routes)
                .put('/putProductVariant')
                .send(productVariant)
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(400);
            expect(req.body.error).toBe('Cannot add sized variant');

        })

        it('400 negative stock', async()=>{

            const productVariant = {
                productID: 1,
                size: 'one-size',
                stock: -10,
            }

            const req = await request(routes)
                .put('/putProductVariant')
                .send(productVariant)
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(400);
            expect(req.body.error).toBe('Stock cant be negative');

        })

        it('400 cant review uncompleted order', async()=>{

            const profileReq = await request(routes)
            .get("/profileClient")
            .set("Authorization", `Bearer ${tokenClient}`);
        
            expect(profileReq.statusCode).toBe(200);

            const clientID = profileReq.body.id;

            expect(clientID).toBeDefined();

            const review = {
                clientID: clientID,
                productID: 2,
                rating: 4,
                comment: 'super',
            }

            const req = await request(routes)
                .put('/putReview')
                .send(review)
                .set("Authorization", `Bearer ${tokenClient}`);

            expect(req.statusCode).toBe(400);
            expect(req.body.error).toBe('cant review uncompleted orders');

        })

        it('400 cant review without order', async()=>{

            const profileReq = await request(routes)
            .get("/profileClient")
            .set("Authorization", `Bearer ${tokenClient}`);
        
            expect(profileReq.statusCode).toBe(200);

            const clientID = profileReq.body.id;

            expect(clientID).toBeDefined();

            const review = {
                clientID: clientID,
                productID: 3,
                rating: 4,
                comment: 'super',
            }

            const req = await request(routes)
                .put('/putReview')
                .send(review)
                .set("Authorization", `Bearer ${tokenClient}`);

            expect(req.statusCode).toBe(400);
            expect(req.body.error).toBe('you cant review without an order')

        })

        it('400 article title or content is empty', async()=>{

            const profileReq = await request(routes)
            .get("/profileDeveloper")
            .set("Authorization", `Bearer ${tokenDeveloper}`);
        
            expect(profileReq.statusCode).toBe(200);

            const developerID = profileReq.body.id;

            expect(developerID).toBeDefined();

            const article = {
                developerID: developerID,
                title: '',
                content: '',
                imgURL: 'img.jpg',
            }

            const req = await request(routes)
                .put('/putArticle')
                .send(article)
                .set("Authorization", `Bearer ${tokenDeveloper}`);

            expect(req.statusCode).toBe(400);
            expect(req.body.error).toBe('title and content cant be empty')

        })

        it('400 comment is empty', async()=>{

            const profileReq = await request(routes)
            .get("/profileClient")
            .set("Authorization", `Bearer ${tokenClient}`);
        
            expect(profileReq.statusCode).toBe(200);

            const clientID = profileReq.body.id;

            expect(clientID).toBeDefined();

            const comment = {
                clientID: clientID,
                articleID: 1,
                content: '',
            }

            const req = await request(routes)
                .put('/putComment')
                .send(comment)
                .set("Authorization", `Bearer ${tokenClient}`);

            expect(req.statusCode).toBe(400);
            expect(req.body.error).toBe('content is empty');


    })
    
})

describe('POST commands', ()=>{
    it('post participation', async()=>{
        const req = await request(routes)
                .post('/postParticipation/'+1)
                .send({placement:1})
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(200);
    })
    it('post event', async()=>{
        const req = await request(routes)
                .post('/postEvent/'+1)
                .send({
                    name: 'newName',
                    description: 'new description',
                    date: '2026-12-12',
                    city: 'Krakow',
                    address: 'piekna 20',
                    maxCapacity: '24',
                    status: 'onGoing',
                    imgURL: 'krakow.jpg',
                })
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(200);
    })
    it('post product', async()=>{
        const req = await request(routes)
                .post('/postProduct/'+1)
                .send({
                    brandID: 1,
                    name: 'newName',
                    description: 'new description',
                    price: '199',
                    category: 'shoes',
                    imgURL: 'shoes.jpg'
                })
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(200);
    })
    it('post variant', async()=>{
        const req = await request(routes)
                .post('/postProductVariant/'+1)
                .send({stock:12})
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(200);
    })
    it('post order', async()=>{
        const req = await request(routes)
                .post('/postProductVariant/'+1)
                .send({
                    name: 'Jan',
                    surname: 'Kowalski',
                    price: 199,
                    address: 'Wroclawska 10',
                    status: 'completed',
                })
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(200);
    })
    it('post article', async()=>{
        const req = await request(routes)
                .post('/postProductVariant/'+1)
                .send({
                    title: 'NewTitle',
                    content: 'newContent',
                    imgURL: 'picture.jpg',
                })
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(200);
    })

})

describe('DELETE commands', ()=>{
    it('delete variant', async()=>{
            const req = await request(routes)
                .delete('/deleteVariant/1')
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(200);
    })
    it('delete participation', async()=>{
            const req = await request(routes)
                .delete('/deleteParticipation/1')
                .set("Authorization", `Bearer ${tokenClient}`);

            expect(req.statusCode).toBe(200);
    })
    it('delete article', async()=>{
            const req = await request(routes)
                .delete('/deleteArticle/1')
                .set("Authorization", `Bearer ${tokenDeveloper}`);

            expect(req.statusCode).toBe(200);
    })
    it('delete product', async()=>{
            const req = await request(routes)
                .delete('/deleteProduct/1')
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(200);
    })
    it('delete event', async()=>{
            const req = await request(routes)
                .delete('/deleteEvent/1')
                .set("Authorization", `Bearer ${tokenBrand}`);

            expect(req.statusCode).toBe(200);
    })
    it('delete user', async()=>{
            const req = await request(routes)
                .delete('/deleteUser/1')
                .set("Authorization", `Bearer ${tokenDeveloper}`);

            expect(req.statusCode).toBe(200);
    })       
})

afterAll(async () => {
    await db.sequelize.close()
});