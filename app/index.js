
// Import dependencies
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const sessions = require('express-session')
const cookieParser = require('cookie-parser');

// Import classes
const {DataBase} = require('./utils/database');

// Required preparations
const publicPath = path.join(__dirname, '../public')
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const sessionMiddleware = sessions({
    secret: "llll",
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24
             },
    saveUninitialized: true
});

app.use(sessionMiddleware);

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parser middleware
app.use(cookieParser());

app.post("/login", (req, res) => {
    req.session.authenticated = true;
    res.status(204).end();
  });

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

// Mongodb setup
var database = new DataBase('calendarDB', "mongodb://localhost:27017/")

app.use(express.static(publicPath));

// Start serve on port 3000
server.listen(3000, () => {
    console.log("Server started on port 3000");
});

var session;
io.on('connection', (socket) => {

    socket.onAny((eventName, ...args) => {
        console.log(eventName + ' ' + {args});
    });

    session = socket.request.session;
    if(session) {
        console.log('session found');
    } else {
        console.log('session not found; sending logging form')
        socket.emit('createSession'); 
    }

    socket.on('sessionCredentials', (data) => {
        database.checkUserCredentials(data.username, data.password)
    });
    
    
    console.log("New connection");
});