import { DataTypes, Model, Sequelize } from 'sequelize'

class Message extends Model {
  public id!: string
  public text!: string
  public encrypted!: boolean
  public timestamp!: Date

  public static initModel(sequelize: Sequelize) {
    Message.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      encrypted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, {
      sequelize,
      modelName: 'message',
    })
  }

  public static associateModels() {
    Message.belongsTo(require('./user').default, { as: 'user' })
    Message.belongsTo(require('./group').default, { as: 'group' })
    Message.belongsTo(require('./user').default, { as: 'recipient' })
  }
}

export default Message
