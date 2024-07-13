import { DataTypes, Model, Sequelize } from 'sequelize'

class Group extends Model {
  public id!: string
  public name!: string

  public static initModel(sequelize: Sequelize) {
    Group.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'group',
    })
  }

  public static associateModels() {
    Group.belongsToMany(require('./user').default, { through: 'GroupMembers' })
    Group.hasMany(require('./message').default, { as: 'messages' })
  }
}

export default Group
