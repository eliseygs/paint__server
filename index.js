var express = require('express');
var app = express();
var WSServer = require('express-ws')(app);
const aWss = WSServer.getWss()

const PORT = process.env.PORT || 5000
app.ws('/', (ws, req) => {
  ws.on('message',(msg) => {
      msg= JSON.parse(msg)
      switch( msg.method){
        case 'connection':
            connetionHandler(ws, msg)
            break
        case 'draw':
            broadcastConnection(ws, msg)
            break
      }
  })
});

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));

const connetionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if(client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}