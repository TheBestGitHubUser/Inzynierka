const express = require("express")
const app = express()

require('dotenv').config();
const jwt = require("jsonwebtoken");
const verifyToken = require('../veryfyToken')


const {User} = require("../models")
const {Client} = require("../models")
const {Brand} = require("../models")
const {Developer} = require("../models")
const {Product} = require("../models")
const {ProductVariant} = require("../models")
const {Order} = require("../models")
const {Review} = require("../models")
const {Event} = require("../models")
const {Participation} = require("../models")
const {Article} = require("../models")
const {Comment} = require("../models");


const cors = require('cors');
const bodyParser = require('body-parser');
const { where } = require("sequelize");
const { Op } = require('sequelize')
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

//user

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
    ).then(
        res.status(200).send()
    ).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.post("/editProfile/:id", async (req,res) =>{

     if (!req.body.name || req.body.name.trim().length < 3) {
            return res.status(400).json({ error: "Name must be at least 3 characters long" });
        }

        // email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!req.body.email || !emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingEmail = await User.findOne({ where: { email: req.body.email,
            id: {[Op.ne]: req.params.id}
         } });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // check duplicate name
        const existingName = await User.findOne({ where: { name: req.body.name,
            id: {[Op.ne]: req.params.id}
         } });
        if (existingName) {
            return res.status(400).json({ error: "Name already exists" });
        }


    try{
        await User.update({
            name: req.body.name,
            email: req.body.email
        },
        {
            where: {id: req.params.id}
        })

        res.status(200).send({ message: "Profile updated successfully" })

    }catch (err){
            res.status(400).send({error: 'data update error'})
            console.log(err)
    }
})

app.post("/changePassword/:id",async (req,res) =>{

    // password
    if (!req.body.newPassword || req.body.newPassword.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    const user = await User.findOne({ where: { id: req.params.id } });

    const passwordCheck = await user.checkPassword(req.body.password) 

        if (!user || !passwordCheck) {
            return res.status(400).json({ error: "password change error" });
        }

    try{
        user.password = req.body.newPassword

        await user.save()

        res.status(200).send()
    }catch(err){
        res.status(400).send({error: 'password update error'})
            console.log(err)
        }
    }
)
//order

app.put("/putOrder", verifyToken , async(req,res) => {

    try{
    const variant = await ProductVariant.findOne({where: {id: req.body.productVariantID}})

    if(!variant){
        return res.status(400).json({ error: "variant not found"});
    }

    if(variant.stock<=0){
        return res.status(400).json({ error: "nothing on the stock"});
    }

    if(!req.body.name || !req.body.surname || !req.body.address){
        return res.status(400).json({ error: "informations cant be blank"});
    }

    ProductVariant.update({
        stock: variant.stock-1
    },
    {
        where:{id: req.body.productVariantID}
    })

    Order.create({
        clientID: req.body.clientID,
        productID: req.body.productID,
        name: req.body.name,
        surname: req.body.surname,
        size: variant.size,
        price: req.body.price,
        address: req.body.address,
        status: req.body.status
    })

    res.status(200).send()
    }catch{
        ((err) =>{
            if(err){
                console.log(err)
            }
        })
    }

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
        res.status(200).send(orders)
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
        res.status(200).send(orders)
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
    .then(
        res.status(200).send()
    ).catch((err) => {
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
    try {

        if (!req.body.name || req.body.name.trim().length < 3) {
            return res.status(400).json({ error: "Name must be at least 3 characters long" });
        }

        // email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!req.body.email || !emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // password
        if (!req.body.password || req.body.password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        // birthDate: cannot be in future
        const birth = new Date(req.body.birthDate);
        const now = new Date();
        if (isNaN(birth.getTime()) || birth > now) {
            return res.status(400).json({ error: "Birth date cannot be in the future" });
        }

        const existingEmail = await User.findOne({ where: { email: req.body.email } });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // check duplicate name
        const existingName = await User.findOne({ where: { name: req.body.name } });
        if (existingName) {
            return res.status(400).json({ error: "Name already exists" });
        }

        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });

        await Client.create({
            userID: newUser.id,
            birthDate: req.body.birthDate,
            gender: req.body.gender,
        });

        res.status(200).json({ status: 200 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.get("/getClients", (req,res) => {
    Client.findAll({include:[{
        model: User,
    }]}).then((clients)=> {
        res.status(200).send(clients)
    }).catch((err) => {
        console.log(err)
    })
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

        res.status(200).json(client);
    
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
  });
});
app.post("/client", async (req,res) => {
    const user = await Client.findOne({include:[{
        model: User,
        where: {email:req.body.email,
        }
    }]})

    if(!user){
        res.status(400).json({err: 'client not found'})
        return
    }

    const checkPassword = await user.User.checkPassword(req.body.password)

    if(!checkPassword){
        res.status(400).json({err: 'wrong password'})
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

    res.status(200).json({ token , user});


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

        if (!req.body.name || req.body.name.trim().length < 3) {
            return res.status(400).json({ error: "Name must be at least 3 characters long" });
        }

        // email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!req.body.email || !emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // password
        if (!req.body.password || req.body.password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        const existingEmail = await User.findOne({ where: { email: req.body.email } });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // check duplicate name
        const existingName = await User.findOne({ where: { name: req.body.name } });
        if (existingName) {
            return res.status(400).json({ error: "Name already exists" });
        }

        const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        })
    
        await Brand.create({
        userID: newUser.id,
        nipNumber: req.body.nipNumber
        })

        res.status(200).json({ status: 200 });

    }catch (err){
        console.error(err)
        res.status(500).json({ error: "Something went wrong" });
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
        res.status(200).send(clients)
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

app.post("/brand",async(req,res) => {
    const brand = await Brand.findOne({include:[{
        model: User,
        where: {email:req.body.email
        }
    }]})
    
    if(!brand ){
        res.status(400).json({err: 'brand not found'})
        return
    }

    const checkPassword = await brand.User.checkPassword(req.body.password)
    
    if(!checkPassword){
        res.status(400).json({err: 'wrong password'})
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

    if(req.body.price<=0){
        return res.status(400).send({error: 'price cant be negative'})
    }

    Product.create({
        brandID: req.body.brandID,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        imgURL: req.body.imgURL
    }).then(
        res.status(200).send()
    ).catch((err) =>{
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
    .then(
        res.status(200).send()
    ).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.delete("/deleteProduct/:productID", verifyToken, (req,res) => {
    Product.destroy({where:{id:req.params.productID}})
    .then(
        res.status(200).send()
    ).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})
//Review

app.put("/putReview", verifyToken , async(req,res) => {

     const order = await Order.findOne({ where: { 
        clientID: req.body.clientID,
        productID: req.body.productID
      } });
        if (!order) {
            return res.status(400).json({ error: "you cant review without an order" });
        }

        if(order.status !== 'completed'){
             return res.status(400).json({ error: "cant review uncompleted orders" });
        }
    

    Review.create({
        clientID: req.body.clientID,
        productID: req.body.productID,
        rating: req.body.rating,
        comment: req.body.comment
    }).then((order)=> {
        res.status(200).send(order)
    }).catch((err) =>{
        if(err){
            res.status(400).send()
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

app.put("/putProductVariant", verifyToken, async (req,res) => {

    if(req.body.stock<0){
        return res.status(400).json({
            error: "Stock cant be negative"
        });
    }

    const size = req.body.size

    const variants = await ProductVariant.findAll({where:{productID: req.body.productID}})

    if(size === 'one-size' && variants.length>0){
        return res.status(400).json({
                    error: "Cannot add 'one-size' variant"
        });
    }

    if(size !== 'one-size'){
        const hasOneSize = variants.some(v => v.size === "one-size")
        if (hasOneSize) {
            return res.status(400).json({
                error: "Cannot add sized variant"
            });
        }
    }

    const existingVariant = variants.find(v => v.size === size);

    if(existingVariant){
        return res.status(400).json({
            error: `Variant with size '${size}' already exists for this product.`
        });
    }

    ProductVariant.create({
        productID: req.body.productID,
        size: size,
        stock: req.body.stock
    }).then(
        res.status(200).send()
    ).catch((err) =>{
        if(err){
            res.status(400).send({error: 'error'})
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

app.post("/postProductVariant/:id", verifyToken, async (req,res) => {
    if(req.body.stock<0){
        return res.status(400).send({error: 'stock cant be negative'})
    }

    await ProductVariant.update({stock: req.body.stock},{where: {id:req.params.id}})
    .then(
        res.status(200).send()
    ).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.delete("/deleteVariant/:id", verifyToken, (req,res) => {
    ProductVariant.destroy({where: {id:req.params.id}})
    .then(
        res.status(200).send()
    ).catch((err) =>{
        if(err){
            res.status(400).send()
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

    if (!req.body.name || req.body.name.trim().length < 3) {
            return res.status(400).json({ error: "Name must be at least 3 characters long" });
        }

        // email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!req.body.email || !emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // password
        if (!req.body.password || req.body.password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        const existingEmail = await User.findOne({ where: { email: req.body.email } });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // check duplicate name
        const existingName = await User.findOne({ where: { name: req.body.name } });
        if (existingName) {
            return res.status(400).json({ error: "Name already exists" });
        }

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
    })
    res.status(200).json({ status: 200 });
    
    }catch (err){
        console.error(err)
        res.status(200).json({ error: "Something went wrong" });
    }
})

app.get("/developerInit/:name/:email/:password",async (req,res) => {

    if (!req.params.name || req.params.name.trim().length < 3) {
            return res.status(400).json({ error: "Name must be at least 3 characters long" });
        }

        // email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!req.params.email || !emailRegex.test(req.params.email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // password
        if (!req.params.password || req.params.password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        const existingEmail = await User.findOne({ where: { email: req.params.email } });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // check duplicate name
        const existingName = await User.findOne({ where: { name: req.params.name } });
        if (existingName) {
            return res.status(400).json({ error: "Name already exists" });
        }

    try{
        const newUser = await User.create({
        name: req.params.name,
        email: req.params.email,
        password: req.params.password,
    })
    
    const newDeveloper = await Developer.create({
        userID: newUser.id,
        role: 'admin',
        salary: 0
    })

        res.status(200).send()
    }catch (err){
        res.status(400).send()
        console.error(err)
    }
    
})

app.post("/developer", async (req,res) => {
    const dev = await Developer.findOne({include:[{
        model: User,
        where: {email:req.body.email,
        }
    }]})

    if(!dev){
        res.status(400).json({err: 'developer not found'})
        return
    }

    const checkPassword = await dev.User.checkPassword(req.body.password)

    if(!checkPassword){
        res.status(400).json({err: 'wrong password'})
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

app.get("/getDeveloper/:developerID", verifyToken, (req,res) =>{
    Developer.findOne({
        where : {id:req.params.developerID},
        include:[{model: User}]
    }).then((developer)=> {
        res.send(developer)
    }).catch((err) => {
        console.log(err)
    })
})

app.post("/postDeveloper", verifyToken, (req,res) =>{
    Developer.update({
    role: req.body.role,
    salary: req.body.salary
    },
    {
        where:{id:req.body.id}
    })
    .then(() => {
        res.status(200).send();
    })
    .catch((err) => {
        console.log(err)
        res.status(400).send({ message: "Database update error" }); 
    })

})
//Events

app.put("/putEvent", verifyToken, async (req,res) => {
    try {
        const newEvent = await Event.create({
            brandID: req.body.brandID,
            name: req.body.name,
            description: req.body.description,
            date: req.body.date,
            city: req.body.city,
            address: req.body.address,
            maxCapacity: req.body.maxCapacity,
            status: req.body.status,
            imgURL: req.body.imageURL,
        });
        
        return res.status(200).send(newEvent); 
        
    } catch (err) {
        console.error("Error creating event:", err);
        return res.status(400).json({ 
            error: "Server error or failed to create event."
        });
    }
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
    }).then(
        res.status(200).send()
    ).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.delete("/deleteEvent/:id", verifyToken, (req,res) => {
    Event.destroy({
        where:{id: req.params.id}
    }).then(
        res.status(200).send()
    ).catch((err) =>{
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
        res.status(200).send(events)
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

app.put("/putParticipation", verifyToken , async(req,res) => {

    const event = await Event.findOne({where: {id: req.body.eventID}})

    if(event.status !== 'upcoming'){
        return res.status(400).send({error: "too late to sign up"}) 
    }

    const exists = await Participation.findOne({
        where:{
            clientID: req.body.clientID,
            eventID: req.body.eventID,
        }
    })

    if(exists){
        return res.status(400).send({error: "already signed up"}) 
    }

    const client = await Client.findOne({ where: { id: req.body.clientID } });

    const genderCount = await Participation.count({
            where:{
                eventID: req.body.eventID
            }
            ,
            include: [{
                model: Client,
                where: { gender: client.gender }
            }]
        });

    if(genderCount >= event.maxCapacity){
        return res.status(400).send({error: "limit reached"}) 
    }

    Participation.create({
        clientID: req.body.clientID,
        eventID: req.body.eventID,
        placement: 0,
    }).then(
        res.status(200).send()
    ).catch((err) =>{
        if(err){
            res.status(400).send({error: "unknown error"})
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
    }).then(
        res.status(200).send()
    ).catch((err) =>{
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
    }).then(
        res.status(200).send()
    ).catch((err) =>{
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
        res.status(200).send(participations)
    }).catch((err) => {
        console.log(err)
    })
})


//Articles

app.put("/putArticle", (req,res) => {
    if(req.body.title.length ===0 || req.body.content.length ===0){
        return res.status(400).send({error: 'title and content cant be empty'})
    }

    Article.create({
        developerID: req.body.developerID,
        title: req.body.title,
        content: req.body.content,
        imgURL: req.body.imgURL,
        views: 0,
    }).then(
        res.status(200).send()
    ).catch((err) =>{
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
    },
    {
        where: {id: req.body.id}
    }).then(
        res.status(200).send()
    ).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

app.post("/increaseViews", async (req,res) => {
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

app.get("/getDevArticles/:developerID", verifyToken, (req,res) => {
    Article.findAll({
        where:{developerID: req.params.developerID}
    }).then((articles)=> {
        res.status(200).send(articles)
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

app.delete("/deleteArticle/:id", (req,res) =>{
    Article.destroy(
        {
            where: {id: req.params.id}
        }
    ).then(
        res.status(200).send()
    ).catch((err) =>{
        if(err){
            console.log(err)
        }
    })
})

//Comment

app.put("/putComment", (req,res) => {

    if(req.body.content.length===0){
        return res.status(400).send({error: 'content is empty'})
    }

    Comment.create({
        clientID: req.body.clientID,
        articleID: req.body.articleID,
        content: req.body.content,
    }).then(
        res.status(200).send()
    ).catch((err) =>{
        if(err){
            res.status(400).send()
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

module.exports=app