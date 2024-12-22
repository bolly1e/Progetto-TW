import { User, Day, Today, Evento } from "./views/Calendario.js";
import { MongoClient } from "mongodb";
import express from "express";
const app = express();
app.use(express.static("public"));

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
  try {
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

//=============================================================================================

import bodyParser from "body-parser";
const server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.set("view engine", "ejs");

server.get("/views/Mese", (req, res) => {
  res.render("Mese");
});
server.get("/views/Settimana", (req, res) => {
  res.render("Settimana");
});

let user = "Lollo";
let dd = new Day(17, 12, 2024);
let e = new Array(10);
for (let i = 0; i < 10; i++) {
  e[i] = new Evento(i, 5, 6);
}
//await updateEvents(user, dd, e);
let table = await getUser(user);

server.get("/data", (req, res) => {
  res.json({ user: table });
});

server.post("/data", async (req, res) => {
  await updateNotes(user, dd, req.body.note);
  table = await getUser(user);
  res.redirect('/views/Mese');
});

server.use(express.static("."));

server.listen(3000, () => {
  console.log("ready");
});
