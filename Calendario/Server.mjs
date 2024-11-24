import { User, Day } from "./public/Calendario.js";
import { MongoClient } from "mongodb";
import express from 'express';
const app = express();
app.use(express.static('public'));

const database = "ProgettoTW";
const collection = "Eventi e note";
const url = "mongodb+srv://bolly1e:Pasword.0@cluster0.03v4v.mongodb.net/";
const client = new MongoClient(url);

async function newUser(name) {
  const user = new User();
  try {
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(collection);
    await coll.insertOne({ User: user, name: [name] });
  } finally {
    await client.close();
  }
}

async function getUser(name) {
  try{
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(collection);
    return await coll.findOne({ name: name });
  } finally {
    await client.close();
  }
}

async function updateNotes(name, day, newNotes) {
  try {
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(collection);
    await coll.updateOne(
      { name: name },
      {
        $set: {
          [`User.grid.decade.${day.y - 2024}.year.${day.m - 1}.month.${
            day.d - 1
          }.note`]: newNotes,
        },
      }
    );
  } finally {
    await client.close();
  }
}

async function updateEvents(name, day, eventi) {
  //array di eventi
  try {
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(collection);
    await coll.updateOne(
      { name: name },
      {
        $set: {
          [`User.grid.decade.${day.y - 2024}.year.${day.m - 1}.month.${
            day.d - 1
          }.eventi`]: eventi,
        },
      }
    );
  } finally {
    await client.close();
  }
}

async function fetchDay(name, day) {
  try {
    await client.connect();
    const db = client.db(database);
    const coll = db.collection(collection);
    var f = await coll.findOne({ name: name });
  } finally {
    await client.close();
  }
  return await f.User.grid.decade[day.y - 2024].year[day.m - 1].month[
    day.d - 1
  ];
}



let d = new Day(24, 11, 2024);
await updateNotes('Lollo', d, 'Ciao');
let u = await getUser('Lollo');

// Endpoint to send dynamic content
app.get("/get-special-content", (req, res) => {
  res.json({ main: u });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});