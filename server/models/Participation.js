module.exports = (sequelize, DataTypes) => {
    const Participation= sequelize.define("Participation", {
        clientID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        eventID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        placement: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    })
    
    Participation.associate = (models) => {
        
    Participation.belongsTo(models.Client, {
      foreignKey: "clientID",
    });
    Participation.belongsTo(models.Event, {
      foreignKey: "eventID",
    });
    };

    return Participation
}