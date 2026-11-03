const{ WebSocketServer } = require("ws") 
const dotenv= require("dotenv")

dotenv.config()

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

wss.off("connection", (ws) => {

    ws.on("error", console.error)
 
    ws.on("message", (data) => {

        wss.clients.forEach((cliente) => cliente.send(data.toString()))

    })

    console.log("client connected")
})