// import { Sequelize } from 'sequelize'

// const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/mydb', {
//   dialect: 'postgres',
//   // dialect: 'mysql2',
//   logging: false,
// })

// export default sequelize
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

import { Sequelize } from 'sequelize'

// Import models
import User from '../models/user'
import Group from '../models/group'
import Message from '../models/message'

// const sequelize = new Sequelize(process.env.DATABASE_URL || 'mysql://root:449206487!@?mysql@127.0.0.1:3306/demo_chat', {
//   dialect: 'mysql',
//   logging: false, // Disable logging; default: console.log
// })

const demo_chat = "mysql://127.0.0.1:3306/demo_chat";
const social_media_db = "mysql://127.0.0.1:3306/social_media_db";

const sequelize = new Sequelize(social_media_db, {
  password: "449206487!@?mysql",
  username: "root",
  // define: {
  //   freezeTableName: true,
  // },
  logging: false,
  define:{timestamps:false}
});

// Initialize models and associations
// User.initModel(sequelize)
// Group.initModel(sequelize)
// Message.initModel(sequelize)

// User.associateModels()
// Group.associateModels()
// Message.associateModels()

export default sequelize
