const http = require('http');
const app = require('./app');
const cors = require('cors');
const { faker } = require('@faker-js/faker');
const { Server } = require('socket.io');
const port = process.env.PORT || 3000;
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Database connection successful");
  }
});

const corsOptions = {
    origin: 'http://localhost:3001', 
    methods: ["GET", "POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  };
app.use(cors(corsOptions));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST","PUT","DELETE"],
      credentials: true
    }
  });

function generateARandomFish() {
        return ({
            fishId: faker.string.uuid(),
            name: faker.commerce.productName(), 
            origin: faker.location.country(),
            species: faker.lorem.word(),
            beauty_score: parseFloat(faker.string.numeric(2, { bannedDigits: ['0'], allowLeadingZeros: false })) / 10
        });
}

function generateARandomTank(){
      return ({
        tankId: faker.string.uuid(),
        location: faker.location.country(),
        TicketPrice : parseInt(faker.string.numeric(2, { bannedDigits: ['0'], allowLeadingZeros: false })) / 10,
        reviews: parseFloat(faker.string.numeric(2, { bannedDigits: ['0'], allowLeadingZeros: false })) / 10
      });
}

function insertFish(fish) {
  const query = 'INSERT INTO fish (fishId, name, origin, species, beauty_score) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [fish.fishId, fish.name, fish.origin, fish.species, fish.beauty_score], (err, result) => {
    if (err) {
      console.error('Error inserting fish:', err);
    } else {
      console.log('Fish inserted successfully:', result);
    }
  });
}

function insertTank(tank) {
  const query = 'INSERT INTO fishtanks (tankId, location, TicketPrice, reviews) VALUES (?, ?, ?, ?)';
  db.query(query, [tank.tankId, tank.location, tank.TicketPrice, tank.reviews], (err, result) => {
    if (err) {
      console.error('Error inserting tank:', err);
    } else {
      console.log('Tank inserted successfully:', result);
    }
  });
}

io.on('connection',(socket) =>{
    console.log('a user connected');

    socket.on('disconnect',() => {
        console.log('user disconnected');
    });

    const intervalId = setInterval(() =>{
        const fishData = generateARandomFish();
        const fishTankData = generateARandomTank();
        io.emit('data',fishData);
        //insertFish(fishData);
       // insertTank(fishTankData);
        console.log('Fish sent succesfully');
    },10000);

    socket.on('disconnect',() => {
        clearInterval(intervalId);
    })
})

server.listen(port);
