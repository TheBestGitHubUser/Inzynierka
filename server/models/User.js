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
        },

        

    })

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