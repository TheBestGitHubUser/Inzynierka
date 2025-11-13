module.exports = (sequelize, DataTypes) => {
    const Comment= sequelize.define("Comment", {
        clientID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        articleID: {
            type: DataTypes.INTEGER,
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
    })

    Comment.associate = (models) => {
    Comment.belongsTo(models.Client, {
      foreignKey: "clientID",
    });
    Comment.belongsTo(models.Article, {
      foreignKey: "articleID",
    });
    };

    return Comment
}