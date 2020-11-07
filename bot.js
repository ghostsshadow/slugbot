require('dotenv').config();
const { MongoClient } = require("mongodb");
const tmi = require('tmi.js');

/**
 * DataBase Functions
 */

// Setup MongoDB
const url = process.env.DB_TOKEN;
const dbclient = new MongoClient(url);

// The database to use
const dbName = "slugs";

async function addSlugBoomer(username) {
  try {
    await dbclient.connect();
    console.log("Connected correctly to server");
    const db = dbclient.db(dbName);

    // Use the collection "boomer"
    const col = db.collection("boomer");

    // Construct a document                                                                                                                                                              
    let slugDocument = {
      "name": username,
      "boomer": true
    }

    // Check for existance
    if (await col.findOne(slugDocument) == null) {
      // Insert a single document, wait for promise so we can read it back
      const p = await col.insertOne(slugDocument);
    }

  } catch (err) {
    console.log(err.stack);
  }
}

async function updateSlugBoomer(username) {
  try {
    await dbclient.connect();
    console.log("Connected correctly to server");
    const db = dbclient.db(dbName);

    // Use the collection "boomer"
    const col = db.collection("boomer");

    // Construct a document                                                                                                                                                              
    let slugDocument = {
      "name": username,
    }

    // Insert a single document, wait for promise so we can read it back
    const p = await col.deleteOne(slugDocument);

  } catch (err) {
    console.log(err.stack);
  }
}

async function checkDB(username) {
  try {
    await dbclient.connect();
    console.log("Connected correctly to server");
    const db = dbclient.db(dbName);

    // Use the collection "boomer"
    const col = db.collection("boomer");

    // Construct a document                                                                                                                                                              
    let slugDocument = {
      "name": username,
      "boomer": true
    }

    // Check for existance
    if (!await col.findOne(slugDocument) == null) {
      return true;
    } else return false;

  } catch (err) {
    console.log(err.stack);
  }
}

/**
 * Chatbot functions
 */

// Define configuration options
const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: ['Sliggytv', 'GhostsShadow03']
});

// Connect to Twitch:
client.connect();

// Called every time a message comes in
client.on('message', (channel, tags, message, self) => {
  if (self || !message.startsWith('!')) return;

  const commandName = message.trim();

  // If the command is known, let's execute it
  if (commandName.slice(0, 4) === '!age') {
    const boomer = isBoomer(parseInt(commandName.slice(5)));
    if (boomer) {
      addSlugBoomer(tags.username);
      client.say(channel, `You're a sliggy1BOOMER.`);
    } else if (!Number.isInteger(parseInt(commandName.slice(5)))){
      return;
    } else {
      updateSlugBoomer(tags.username);
      client.say(channel, `You're a sliggy1SLUG.`);
    }
    console.log(`* Executed ${commandName} command`);
  } else if (commandName === '!dev') {
    client.say(channel, `chatbot by @GhostsShadow03`);
    console.log(`* Executed ${commandName} command`);
  }
  else {
    console.log(`* Unknown command ${commandName}`);
  }
});

// Function called when the "age" command is issued
function isBoomer(age) {
  if (age >= 29) {
    return true;
  } else {
    return false;
  }
}
// Called everytime a Subscription comes in
client.on("subscription", (channel, username, method, message, userstate) => {
  // Check if BoomerSlug
  if (checkDB(username)) {
    client.say(channel, `Give me the sliggy1BOOMER sliggy1BOOMER sliggy1BOOMER for ${username} in the chat!`);
  } else {
    client.say(channel, `Give me the sliggy1SLUG sliggy1SLUG sliggy1SLUG for ${username} in the chat!`);
  }
  console.log(`* Executed Subscription Event`);
});