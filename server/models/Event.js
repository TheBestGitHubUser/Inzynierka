module.exports = (sequelize, DataTypes) => {
    const Event= sequelize.define("Event", {
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
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        maxCapacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
            },
        },
        imgURL: {
            type: DataTypes.STRING,
            allowNull: true,
        },
       

    })

    Event.associate = (models) => {
    Event.belongsTo(models.Brand, {
      foreignKey: "brandID"
    });
    Event.hasMany(models.Participation, {
      foreignKey: "eventID",
      onDelete: "CASCADE",
    });
  };

    return Event
}