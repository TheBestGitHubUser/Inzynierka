module.exports = (sequelize, DataTypes) => {
    const ProductVariant= sequelize.define("ProductVariant", {
        productID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        size: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    })

    ProductVariant.associate = (models) => {
    
    ProductVariant.belongsTo(models.Product, {
      foreignKey: "productID"
    });
  };


    return ProductVariant
}