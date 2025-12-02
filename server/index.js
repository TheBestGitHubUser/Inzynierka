const server = require('./routes/routes')
const db = require("./models")

db.sequelize.sync().then((req) => {
    server.listen(3001, () => {
    console.log("listening on port 3001");
    });
})
