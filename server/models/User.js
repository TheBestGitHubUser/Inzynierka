const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
    const User= sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },},
      {
        hooks: {
          async beforeCreate(user) {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
            async beforeUpdate(user) {
                if (user.changed("password")) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
        }
      })
      
      User.prototype.checkPassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    };

    User.associate = (models) => {
    User.hasOne(models.Client, {
      foreignKey: "userID",
      onDelete: "CASCADE", 
    });
    User.hasOne(models.Brand, {
      foreignKey: "userID",
      onDelete: "CASCADE", 
    });
    User.hasOne(models.Developer, {
      foreignKey: "userID",
      onDelete: "CASCADE", 
    });
  };

    return User
}