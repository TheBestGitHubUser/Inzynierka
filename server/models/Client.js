module.exports = (sequelize, DataTypes) => {
    const Client= sequelize.define("Client", {
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        birthDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },

    })

    Client.associate = (models) => {
    Client.belongsTo(models.User, {
      foreignKey: "userID",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    Client.hasMany(models.Participation, {
      foreignKey: "clientID",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    })
    Client.hasMany(models.Order, {
      foreignKey: "clientID",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    })
    Client.hasMany(models.Comment, {
      foreignKey: "clientID",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    })
    Client.hasMany(models.Review, {
      foreignKey: "clientID",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    })

    };

    return Client
}