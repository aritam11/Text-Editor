const io = require("socket.io")(3001 , {
    cors : {
        origin : 'http://localhost:3000',
        methods : ['GET' , 'POST' ]
    }
})

io.on('connection', socket =>{

    socket.on("ID" , id => {
        const data =""
        socket.join(id)
        socket.emit("load",data)
        socket.on("changes", delta =>{
            socket.broadcast.to(id).emit("receive", delta)
        })
    })
})