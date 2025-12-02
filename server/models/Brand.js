module.exports = (sequelize, DataTypes) => {
    const Brand= sequelize.define("Brand", {
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        nipNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },

    })

    Brand.associate = (models) => {
    Brand.belongsTo(models.User, {
      foreignKey: "userID",
      onDelete: "CASCADE"
    });
    Brand.hasMany(models.Event, {
      foreignKey: "brandID",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    })
    Brand.hasMany(models.Product, {
      foreignKey: "brandID",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    })};

    return Brand
}