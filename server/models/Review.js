module.exports = (sequelize, DataTypes) => {
    const Review= sequelize.define("Review", {
        clientID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        productID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    })

    Review.associate = (models) => {
    Review.belongsTo(models.Client, {
      foreignKey: "clientID",
    });
    Review.belongsTo(models.Product, {
      foreignKey: "productID",
      onDelete: "CASCADE",
    });
    };

    return Review
}