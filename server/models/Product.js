module.exports = (sequelize, DataTypes) => {
    const Product= sequelize.define("Product", {
        brandID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        imgURL: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
       

    })

    Product.associate = (models) => {
    
    

    Product.hasMany(models.ProductVariant, {
      foreignKey: "productID",
      onDelete: "CASCADE", 
    });
    Product.hasMany(models.Order, {
      foreignKey: "productID",
      onDelete: "CASCADE", 
    });

    Product.belongsTo(models.Brand, {
        foreignKey: "brandID"
        });

  };

    return Product
}