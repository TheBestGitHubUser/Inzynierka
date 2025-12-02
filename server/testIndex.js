process.env.NODE_ENV = "test";

const server = require('./routes/routes');
const db = require('./models');

db.sequelize.sync({ force: true }).then(() => {
    server.listen(3001, () => {
        console.log("TEST backend running on port 3001 (inz_mock)");
    });
});