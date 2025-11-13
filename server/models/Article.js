module.exports = (sequelize, DataTypes) => {
    const Article= sequelize.define("Article", {
        developerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        imgURL: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        views: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },

    })

    Article.associate = (models) =>{
        Article.belongsTo(models.Developer,{
            foreignKey: "developerID"
        })
        Article.hasMany(models.Comment, {
        foreignKey: "articleID",
        onDelete: "CASCADE"
        })
    }

    return Article
}