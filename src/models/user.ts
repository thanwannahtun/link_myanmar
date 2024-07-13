import { DataTypes, Model, Sequelize } from 'sequelize'

class User extends Model {
  public id!: string
  public name!: string
  public email!: string
  public passwordHash!: string

  public static initModel(sequelize: Sequelize) {
    User.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'user',
    })
  }

  public static associateModels() {
    User.hasMany(require('./message').default, { as: 'messages' })
    User.belongsToMany(require('./group').default, { through: 'GroupMembers' })
  }
}

export default User
