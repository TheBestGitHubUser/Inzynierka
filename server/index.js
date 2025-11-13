const express = require("express")
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require("jsonwebtoken");
const verifyToken = require('./veryfyToken')


const mysql = require("mysql2")
const db = require("./models")

const {User} = require("./models")
const {Client} = require("./models")
const {Brand} = require("./models")
const {Developer} = require("./models")
const {Product} = require("./models")
const {ProductVariant} = require("./models")
const {Order} = require("./models")
const {Review} = require("./models")
const {Event} = require("./models")
const {Participation} = require("./models")
const {Article} = require("./models")
const {Comment} = require("./models");
const { where } = require("sequelize");

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

//User



app.put("/putUser", (req,res) => {
    User.create({
        name: "bruh",
        email: "bruh@bruh.bruh",
        password: "bruh",
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.delete("/deleteUser/:userID", (req,res) =>{
    User.destroy(
        {
            where: {id: req.params.userID}
        }
    ).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.post("/editProfile/:id", (req,res) =>{
    User.update({
        name: req.body.name,
        email: req.body.email
    },
    {
        where: {id: req.params.id}
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })

})

app.post("/changePassword/:id", (req,res) =>{
    User.update({
        password: req.body.password
    },
    {
        where: {id: req.params.id}
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})
//order

app.put("/putOrder", verifyToken , (req,res) => {
    Order.create({
        clientID: req.body.clientID,
        productID: req.body.productID,
        name: req.body.name,
        surname: req.body.surname,
        size: req.body.size,
        price: req.body.price,
        address: req.body.address,
        status: req.body.status
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.get("/getOrder/:orderID", (req,res) => {
    Order.findOne({
        where: {id: req.params.orderID}
    }).then((order)=> {
        res.send(order)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getBrandOrders/:brandID", verifyToken, (req,res) =>{
    Order.findAll({
        include:[{
            model: Product,
            where: {brandID: req.params.brandID}
        }]

    }).then((orders)=> {
        res.send(orders)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getClientOrders/:clientID", verifyToken ,(req,res) => {
    Order.findAll({
        where: {clientID: req.params.clientID},
        include: [{model: Product,
            include: [{model: Brand,
                include: [{model: User}]
            }]
        }
            
        ]
    }).then((orders)=> {
        res.send(orders)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getBrandOrders/:brandID", (req,res) => {
    Order.findAll({
        include:[{
            model: Product,
            where:{brandID: req.params.brandID}
        }]
    }).then((orders)=> {
        res.send(orders)
    }).catch((err) => {
        console.log(err)
    })
})

app.post("/postOrder", (req,res) => {
    Order.update({
        name: req.body.name,
        surname: req.body.surname,
        price: req.body.price,
        address: req.body.address,
        status: req.body.status},
    {where: {id: req.body.id}})
    .catch((err) => {
        console.log(err)
    })
})

app.delete("/deleteOrder/:orderID", verifyToken, (req,res) => {
    Order.destroy({
        where:{id: req.params.orderID}
    }).catch((err) => {
        console.log(err)
    })
})

//Client

app.put("/putClient", async (req,res) => {
    try{
        const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
    
    const newClient = await Client.create({
        userID: newUser.id,
        birthDate: req.body.birthDate,
        gender: req.body.gender,
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
    }catch (err){
        console.error(err)
    }
})

app.get("/getClients", (req,res) => {
    Client.findAll({include:[{
        model: User,
    }]}).then((clients)=> {
        res.send(clients)
    }).catch((err) => {
        console.log(err)
    })
})

app.post("/loginClient", async (req,res) =>{
    const { email } = req.body.email;
    const { password } = req.body.password;

    const client = await Client.findOne({ include: [{model: User},{where: { email: email }}] });
    

    const token = jwt.sign(
    {
      id: client.id,
      gender: client.gender
    },
    process.env.JWT_SECRET_TOKEN,
    { expiresIn: "1h" }
    );

    res.json({ token });
})
app.get("/profileClient", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    try{
        const client = await Client.findOne({where: { id: decoded.id, gender: decoded.gender }, include: [{model: User}] });
        if (!client) return res.status(404).json({ error: "User not found" });

        res.json(client);
    
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
  });
});
app.get("/client/:email/:password", async (req,res) => {
    const user = await Client.findOne({include:[{
        model: User,
        where: {email:req.params.email,
        }
    }]})

    if(!user || user.User.password !==req.params.password){
        res.json({})
        return
    }

    const token = jwt.sign(
    {
      id: user.id,
      gender: user.gender
    },
    process.env.JWT_SECRET_TOKEN,
    { expiresIn: "1h" }
    );

    res.json({ token , user});


})

app.delete("/deleteClient/:clientID", (req,res) => {
    Client.destroy({
        where: {id: req.params.clientID}
    }).catch((err) => {
        console.log(err)
    })
})
//brand

app.put("/putBrand", async (req,res) => {
    try{
        const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
    
    const newBrand = await Brand.create({
        userID: newUser.id,
        nipNumber: req.body.nipNumber
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
    }catch (err){
        console.error(err)
    }
})

app.get("/getBrand/:brandID", (req,res) =>{
    Brand.findOne({
        where: {id: req.params.brandID},
        include:[{
        model: User
    }]}).then((clients)=> {
        res.send(clients)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getBrands", (req,res) => {
    Brand.findAll({include:[{
        model: User
    }]}).then((clients)=> {
        res.send(clients)
    }).catch((err) => {
        console.log(err)
    })
})


app.get("/brands/getProducts/:brandID", verifyToken,(req,res) => {
    Product.findAll(
        {where: {brandID:req.params.brandID}}
    ).then((products)=> {
        res.send(products)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/brand/:email/:password",async(req,res) => {
    const brand = await Brand.findOne({include:[{
        model: User,
        where: {email:req.params.email
        }
    }]})
    
    if(!brand || brand.User.password !==req.params.password){
        res.json({})
        return
    }
    

    const token = jwt.sign(
    {
      id: brand.id,
      nipNumber: brand.nipNumber
    },
    process.env.JWT_SECRET_TOKEN,
    { expiresIn: "1h" }
    );

    res.json({ token , brand});
})

app.get("/profileBrand", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    try{
        const brand = await Brand.findOne({where: { id: decoded.id, nipNumber: decoded.nipNumber }, include: [{model: User}] });
    
        if (!brand) return res.status(404).json({ error: "User not found" });

        res.json(brand);
    
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
    
  });
});
//product
app.put("/putProduct", verifyToken, (req,res) => {
    Product.create({
        brandID: req.body.brandID,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        imgURL: req.body.imgURL
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.get("/getProducts", (req,res) => {
    Product.findAll().then((products)=> {
        res.send(products)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getProduct/:id", (req,res) => {
    Product.findOne({ where: {id: req.params.id}})
    .then((product)=> {
        res.send(product)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getProductDetails/:productID", (req,res) => {
    Product.findOne({
        where: {id: req.params.productID},
        include: [{model: Brand,
            include: [{model: User}]
        }]
    })
    .then((product)=> {
        res.send(product)
    }).catch((err) => {
        console.log(err)
    })
})

app.post("/postProduct/:productID", verifyToken, (req,res) => {
    Product.update({
        brandID: req.body.brandID,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        imgURL: req.body.imageURL
    },{
        where:{id:req.body.id}
    })
    .catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.delete("/deleteProduct/:productID", verifyToken, (req,res) => {
    Product.destroy({where:{id:req.params.productID}})
    .catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})
//Review

app.put("/putReview", verifyToken ,(req,res) => {
    Review.create({
        clientID: req.body.clientID,
        productID: req.body.productID,
        rating: req.body.rating,
        comment: req.body.comment
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.get("/getReview/:clientID/:productID", (req,res) =>{
    Review.findOne({
        where:{
            clientID: req.params.clientID,
            productID: req.params.productID
        }
    }).then((review)=> {
        res.send(review)
    }).catch((err) => {
        console.log(err)
    })
})

app.get('/getProductReviews/:productID', (req,res) =>{
    Review.findAll(
        {where:{productID: req.params.productID},
        include:[{model: Client,
            include:[{model: User}]
        }]}).then((reviews)=> {
        res.send(reviews)
    }).catch((err) => {
        console.log(err)
    })
})

app.post("/postReview", verifyToken, (req,res) =>{
    Review.update({
        rating: req.body.rating,
        comment: req.body.comment
    },
    {
        where: {id: req.body.id}
    }).catch((err) => {
        console.log(err)
    })
})




//ProductVariant

app.put("/putProductVariant", verifyToken, (req,res) => {
    ProductVariant.create({
        productID: req.body.productID,
        size: req.body.size,
        stock: req.body.stock
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.get("/getProductVariants/:productID",(req,res) =>{
    ProductVariant.findAll({
        where:{productID: req.params.productID}
    }).then((productVariants)=> {
        res.send(productVariants)
    }).catch((err) => {
        console.log(err)
    })
})

app.post("/postProductVariant/:id", verifyToken, (req,res) => {
    ProductVariant.update({stock: req.body.stock},{where: {id:req.params.id}}).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.delete("/deleteVariant/:id", verifyToken, (req,res) => {
    ProductVariant.destroy({where: {id:req.params.id}}).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})
app.get("/getVariant/:variantID", (req,res) => {
    ProductVariant.findOne({where:{id:req.params.variantID}})
    .then((productVariant)=> {
        res.send(productVariant)
    }).catch((err) => {
        console.log(err)
    })
})

//Developer

app.put("/putDeveloper", async (req,res) => {
    try{
        const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
    
    const newDeveloper = await Developer.create({
        userID: newUser.id,
        role: req.body.role,
        salary: req.body.salary
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
    }catch (err){
        console.error(err)
    }
})

app.get("/developerInit/:name/:email/:password",async (req,res) => {
    try{
        const newUser = await User.create({
        name: req.params.name,
        email: req.params.email,
        password: req.params.password,
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
    
    const newDeveloper = await Developer.create({
        userID: newUser.id,
        role: 'admin',
        salary: 0
    }).then((developer)=> {
        res.send('admin created')
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
    }catch (err){
        console.error(err)
    }
    
})

app.get("/developer/:email/:password", async (req,res) => {
    const dev = await Developer.findOne({include:[{
        model: User,
        where: {email:req.params.email,
            password: req.params.password
        }
    }]})

    if(!dev || dev.User.password !==req.params.password){
        res.json({})
        return
    }

     const token = jwt.sign(
    {
      id: dev.id,
      role: dev.role
    },
    process.env.JWT_SECRET_TOKEN,
    { expiresIn: "1h" }
    );

    res.json({ token , dev});
    
})

app.get("/profileDeveloper", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    try{
        const dev = await Developer.findOne({where: { id: decoded.id, role: decoded.role }, include: [{model: User}] });
        if (!dev) return res.status(404).json({ error: "User not found" });

        res.json(dev);
    
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }

  });
});

app.get('/getDevelopers', (req,res) => {
    Developer.findAll({
        include:[{
            model: User
        }]
    }).then((developers)=> {
        res.send(developers)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getDeveloper/:developerID", (req,res) =>{
    Developer.findOne({
        where : {id:req.params.developerID},
        include:[{model: User}]
    }).then((developer)=> {
        res.send(developer)
    }).catch((err) => {
        console.log(err)
    })
})

app.post("/postDeveloper", (req,res) =>{
    Developer.update({
        role: req.body.role,
        salary: req.body.salary
    },
    {
        where:{id:req.body.id}
    }).catch((err) => {
        console.log(err)
    })

    User.update({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    },
    {
        where:{id: req.body.userID}
    }).catch((err) => {
        console.log(err)
    })
})
//Events

app.put("/putEvent", verifyToken, (req,res) => {
    Event.create({
        brandID: req.body.brandID,
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        city: req.body.city,
        address: req.body.address,
        maxCapacity: req.body.maxCapacity,
        status: "upcoming",
        imgURL: req.body.imageURL,
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.post("/postEvent/:eventID", verifyToken, (req,res) => {
    Event.update({
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
        city: req.body.city,
        address: req.body.address,
        maxCapacity: req.body.maxCapacity,
        status: req.body.status,
        imgURL: req.body.imgURL,
    },{
        where:{id: req.params.eventID}
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.delete("/deleteEvent/:id", verifyToken, (req,res) => {
    Event.destroy({
        where:{id: req.params.id}
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.get("/getEvents", (req,res) => {
    Event.findAll().then((events)=> {
        res.send(events)
    }).catch((err) => {
        console.log(err)
    })
})


app.get("/brand/getEvent/:eventID", verifyToken, (req,res) => {
    Event.findOne({ where: {id: req.params.eventID}})
    .then((event)=> {
        res.send(event)
    }).catch((err) => {
        console.log(err)
    })
})
app.get("/brandGetEvents/:brandID", verifyToken , (req,res) => {
    Event.findAll({where:{brandID:req.params.brandID}})
    .then((events)=> {
        res.send(events)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getEvent/:eventID", (req,res) => {
    Event.findOne({where : {id: req.params.eventID} ,include:[{
        model: Brand,
        include:[{
            model: User
        }]
    }]}).then((event)=> {
        res.send(event)
    }).catch((err) => {
        console.log(err)
    })
})


//Participation

app.put("/putParticipation", verifyToken ,(req,res) => {
    Participation.create({
        clientID: req.body.clientID,
        eventID: req.body.eventID,
        placement: 0,
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.post("/postParticipation/:participationID", (req,res) => {
    Participation.update({
        placement: req.body.placement,
    },
    {
        where:{
        id: req.params.participationID
        }
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.delete("/deleteParticipation/:participationID", verifyToken , (req,res) => {
    Participation.destroy({
        where:{
        id: req.params.participationID 
        }
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.get("/getParticipationM/:eventID", (req,res) => {
    Participation.count({where:{
        eventID: req.params.eventID
    },
    include:[{
        model: Client,
        where: { gender:'M'}
    }]}).then((count)=> {
        res.send({count})
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getParticipationF/:eventID", (req,res) => {
    Participation.count({where:{
        eventID: req.params.eventID
    },
    include:[{
        model: Client,
        where: {gender:'F'}
    }]}).then((count)=> {
        res.send({count})
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getParticipation/:clientID/:eventID", (req,res) => {
    Participation.findOne({
        where:{
            clientID: req.params.clientID,
            eventID: req.params.eventID,
        }
    }).then((participation)=> {
        if(participation){
           res.send(participation) 
        }else{
            res.send({})
        }
        
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getEventParticipants/:eventID", (req,res) => {
    Participation.findAll({
        where:{ eventID: req.params.eventID}
        ,
        include:[{
            model: Client,
            include:[{ model: User}]
        }]
    }).then((participations)=> {
        res.send(participations)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getClientParticipation/:clientID", verifyToken , (req, res) => {
    Participation.findAll({
        where: {clientID: req.params.clientID},
        include:[{ model: Event}]
    }).then((participations)=> {
        res.send(participations)
    }).catch((err) => {
        console.log(err)
    })
})



//Articles

app.put("/putArticle", (req,res) => {
    Article.create({
        developerID: req.body.developerID,
        title: req.body.title,
        content: req.body.content,
        imageURL: req.body.imageURL,
        views: 0,
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.post("/postArticle", (req,res) => {
    Article.update({
        title: req.body.title,
        content: req.body.content,
        imgURL: req.body.imgURL,
        views: req.body.views,
    },
    {
        where: {id: req.body.id}
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.post("/increaseViews", (req,res) => {
    const articleID = req.body.id;

    Article.increment({
        views: 1,
    },
    {where: {id: articleID}
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.get("/getArticles", (req,res) => {
    Article.findAll().then((articles)=> {
        res.send(articles)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getArticle/:articleID", (req,res) => {
    Article.findOne({
        where:{id:req.params.articleID}
    }).then((articles)=> {
        res.send(articles)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getDevArticles/:developerID", (req,res) => {
    Article.findAll({
        where:{developerID: req.params.developerID}
    }).then((articles)=> {
        res.send(articles)
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/getArticleDetails/:articleID", (req,res) =>{
    Article.findOne({
        where:{id: req.params.articleID}
    ,
        include:[{model:Developer,
            include:[{model: User}]
        }]
    }).then((article)=> {
        res.send(article)
    }).catch((err) => {
        console.log(err)
    })
})


//Comment

app.put("/putComment", (req,res) => {
    Comment.create({
        clientID: req.body.clientID,
        articleID: req.body.articleID,
        content: req.body.content,
    }).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.get("/getComments/:articleID", (req,res) => {
    Comment.findAll({
        where: {articleID: req.params.articleID},
        include:[{model: Client, 
            include:[{model: User}]
        }]
    }).then((comment)=> {
        res.send(comment)
    }).catch((err) => {
        console.log(err)
    })  
})

db.sequelize.sync().then((req) => {
    app.listen(3001, () => {
    console.log("listening on port 3001");
    });
})
