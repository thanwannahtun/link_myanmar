
// import express from 'express'
// import messageRoutes from './routes/messageRoutes'
// import {webSocketService} from './services/websocket';
// import dotenv from 'dotenv'

// // Load environment variables
// dotenv.config()

// const app = express()
// app.use(express.json())

// // Use the message routes
// app.use('/api', messageRoutes)

// // Start the server
// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`)
//   // webSocketService.start()
//   webSocketService.start(app)
// })
///////////////////////////////////
import express from 'express'
import messageRoutes from './routes/messageRoutes'
import authRoutes from './routes/authRoutes'
import routes from './routes/routes';
import { webSocketService } from './services/websocket'
import sequelize from './utils/db'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
app.use(express.json())

// Use the message routes
app.use('/api/messages', messageRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/routes',routes)

app.use("/home",(req,res) => {
  res.send("Hello World")
})

// Test the database connection and start the server
const PORT = process.env.PORT || 3000

sequelize.authenticate()
  .then(async () => {
    await sequelize.sync({ alter: true }); // use when you wanna sync database 
    console.log('Database connected...')
    const server = app.listen(PORT, () => {
      console.log(`Server listening on port http://localhost:${PORT}`)
      webSocketService.start(server) // Pass the HTTP server to WebSocket service
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })
