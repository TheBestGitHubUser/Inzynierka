module.exports = (sequelize, DataTypes) => {
    const Developer= sequelize.define("Developer", {
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        salary: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },

    })
    
    Developer.associate = (models) => {
    Developer.belongsTo(models.User, {
      foreignKey: "userID",
      onDelete: "CASCADE",
    });
    Developer.hasMany(models.Article, {
      foreignKey: "developerID",
      onDelete: "CASCADE"
    })

    };

    

    return Developer
}