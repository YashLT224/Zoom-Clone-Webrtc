const app=require('express')()
const server=require("http").createServer(app);
const cors=require('cors');

app.use(cors());
const io=require('socket.io')(server,{
    cors:{
        origin:"*",
        methods:['GET','POS'],

    }
})
//emit se wo event sabhi ke pas jata h client side pr .jisne start kiya tha uske pas bhi
//boradcast me wo event sabhi ke pas jata h client side pr except jisne start kiya tha.
io.on("connection",(socket)=>{
    console.log("connected",socket.id);
    socket.emit("me", socket.id);
    socket.on('disconnect',()=>{
        socket.broadcast.emit('call ended');
    })
    socket.on('calluser',({userToCall,signalData,from,name})=>{
            io.to(userToCall).emit('calluser',{signal:signalData,from,name})
    })
    socket.on('answercall',(data)=>{
        io.to(data.to).emit('callAccepted',data.signal);
    })

})
const PORT=5001;
app.get('/',(req,res)=>{
    res.send('server is running');
})

server.listen(PORT,()=> console.log('server is listening on Port :5000'))