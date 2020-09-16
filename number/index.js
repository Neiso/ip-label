//MONGO LOGIC
const MongoClient = require("mongodb").MongoClient;
const connectionString =
  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

//PARSING LOGIC
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

//EXPRESS APP
const express = require("express");
const app = express();
const port = 3000;

//MIDDLEWARE COOKIE
app.use(cookieParser());

/*
    ========================================================================================
      Middleware a l'entrée des routes pour vérifier que le client possède bien un cookie.
      - S'il n'en possède pas, on lui envoie un cookie 
        (l'ID de session ne se trouve pas dans la DB ou pas d'ID de session).
      - S'il en possède un, un continuer pour atteindre l'URL demandée.
    ========================================================================================
*/
app.use(async (req, res, next) => {
  const client = MongoClient(connectionString, {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db("number").collection("number");
    // Si il n'y a pas de cookie pour la session ET que l'id de la session n'est pas dans la base de donnée,
    // On crée un document pour cette ID.
    const cookie = parseInt(req.cookies["session_id"]);
    const document = await db.findOne({
      session_id: cookie,
    });
    if (!document) {
      const session_id = Math.floor(Math.random() * 10000000);
      await db.insertOne({
        session_id,
        creationTimestamp: new Date(),
        list: [],
      });
      res.cookie("session_id", session_id);
      res.json({ msg: "You can start to play with your number list :)" });
    } else {
      next();
    }
  } catch (err) {
    console.error("Error is  : ", err);
    res.send({
      error: true,
      errorMsg: "An error occured please try again later.",
    });
  }
});

/*
    ========================================================================================
      Le / redirect vers l'url print.
    ========================================================================================

*/
app.get("/", async (req, res) => {
  res.redirect("http://localhost:3000/print");
});

/*
    ========================================================================================
      Fonction pour récupérer une session avec une ID de session
      directement dans les paramètres de l'url. On va simplement envoyer un cookie
      avec cette ID.
    ========================================================================================
*/
app.get("/recover", async (req, res) => {
  const client = MongoClient(connectionString, {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db("number").collection("number");
    // Si il n'y a pas de cookie pour la session ET que l'id de la session n'est pas dans la base de donnée,
    // On crée un document pour cette ID.
    const cookie = parseInt(req.query["session_id"]);
    res.cookie("session_id", req.query["session_id"]);
    res.send({
      msg: "Session recovered succesfully.",
    });
  } catch (err) {
    console.error("Error is  : ", err);
    res.send({
      error: true,
      errorMsg: "An error occured please try again later.",
    });
  } finally {
    // await client.close();
  }
});

/*
    ========================================================================================
      On récupère la liste de nombre dans la DB grace a l'ID de session qui est envoyé
      à l'aide d'un cookie (session_id), et on la renvoie.
    ========================================================================================
*/

app.get("/print", async (req, res) => {
  const client = MongoClient(connectionString, {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db("number").collection("number");
    const cookie = parseInt(req.cookies["session_id"]);
    const document = await db.findOne({
      session_id: cookie,
    });
    if (document) {
      res.send(document.list);
    } else {
      res.send([]);
    }
  } catch (err) {
    console.error(err);
    res.send({
      error: true,
      errorMsg: "An error occured please try again later.",
    });
  }
});

/*
    ========================================================================================
      On récupère la liste de nombre dans la DB grace a l'ID de session qui est envoyé
      à l'aide d'un cookie (session_id), et on utilise l'operateur $push pour directement
      ajouter la valeur dans la liste à l'aide d'une update.
    ========================================================================================
*/

app.get("/addValue", async (req, res) => {
  const value = parseInt(req.query["value"]);
  if (value || value == 0) {
    const client = MongoClient(connectionString, {
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      const db = client.db("number").collection("number");
      const cookie = parseInt(req.cookies["session_id"]);
      const document = await db.findOneAndUpdate(
        {
          session_id: cookie,
        },
        {
          $push: {
            list: value,
          },
        }
      );
      res.send({
        msg: "Number added succesfully!",
      });
    } catch (err) {
      console.error(err);
      res.send({
        error: true,
        errorMsg: "An error occured please try again later.",
      });
    }
  } else {
    res.send({
      error: true,
      errorMsg: "Please provide a valid number.",
    });
  }
});

/*
    ========================================================================================
      On update la liste de nombre directement à vide [] a l'aide de l'operateur $set.
    ========================================================================================
*/

app.get("/removeAll", async (req, res) => {
  const client = MongoClient(connectionString, {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db("number").collection("number");
    const cookie = parseInt(req.cookies["session_id"]);
    const document = await db.findOneAndUpdate(
      {
        session_id: cookie,
      },
      {
        $set: {
          list: [],
        },
      }
    );
    res.send({
      msg: "List completly emptied.",
    });
  } catch (err) {
    console.error(err);
    res.send({
      error: true,
      errorMsg: "An error occured please try again later.",
    });
  }
});

/*
    ========================================================================================
      On récupère la liste de nombre, on trouve l'index correspondant a la valeur demandée
      qui se trouve en paramètre de l'URL (value), on supprimer l'élément et on update
      la liste dans la DB. 
    ========================================================================================
*/

app.get("/removeOne", async (req, res) => {
  const value = parseInt(req.query["value"]);
  const client = MongoClient(connectionString, {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db("number").collection("number");
    const cookie = parseInt(req.cookies["session_id"]);
    const document = await db.findOne({
      session_id: cookie,
    });
    const index = document.list.indexOf(value);
    if (index != -1) {
      document.list.splice(index, 1);
      await db.findOneAndUpdate(
        {
          session_id: cookie,
        },
        {
          $set: {
            list: document.list,
          },
        }
      );
      res.send({
        msg: "Removed one element",
      });
    } else {
      res.send({
        msg: "Value not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.send({
      error: true,
      errorMsg: "An error occured please try again later.",
    });
  }
});

/*
    ========================================================================================
      On récupère la liste de nombre, on calcule la moyenne de celle-ci et on renvoie
      le résulat.
    ========================================================================================
*/

app.get("/mean", async (req, res) => {
  const client = MongoClient(connectionString, {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db("number").collection("number");
    const cookie = parseInt(req.cookies["session_id"]);
    const document = await db.findOne({
      session_id: cookie,
    });
    let total = 0;
    if (document.list.length) {
      const sum = document.list.reduce((total, value, index) => {
        return (total += value);
      });
      res.send({
        msg: `Mean is ${sum / document.list.length}`,
      });
    } else {
      res.send({
        msg: "List is empty, can't find mean",
      });
    }
  } catch (err) {
    console.error(err);
    res.send({
      error: true,
      errorMsg: "An error occured please try again later.",
    });
  }
});

/*
    ========================================================================================
      On récupère la liste de nombre, on calcule la moyenne de celle-ci et on renvoie
      le résulat.
    ========================================================================================
*/

app.get("/medianMean", async (req, res) => {
  const client = MongoClient(connectionString, {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db("number").collection("number");
    const cookie = parseInt(req.cookies["session_id"]);
    const document = await db.findOne({
      session_id: cookie,
    });
    document.list.sort((a, b) => a - b);
    const mid = Math.floor(document.list.length / 2);
    document.list.sort((a, b) => a - b);
    let median = 0;
    if (document.list.length > 0) {
      median =
        document.list.length % 2 !== 0
          ? document.list[mid]
          : (document.list[mid - 1] + document.list[mid]) / 2;
      res.send({
        msg: `Median is ${median}`,
      });
    } else {
      res.send({
        msg: "List is empty, can't find median",
      });
    }
  } catch (err) {
    console.error(err);
    res.send({
      error: true,
      errorMsg: "An error occured please try again later.",
    });
  }
});

/*
    ========================================================================================
      On va utiliser un paramètre d'url (:type), pour savoir quelle opération le client
      souhaite effectuer, on récupère la liste de nombre dans la DB, on applique 
      l'opération et on update la liste. On renvoie également le résultat.
    ========================================================================================
*/

app.get("/operation/:type", async (req, res) => {
  const client = MongoClient(connectionString, {
    useUnifiedTopology: true,
  });
  const value = parseInt(req.query["value"]);
  const operators = ["substraction", "addition", "multiplication", "division"];
  const type = req.params["type"];
  if (operators.find((item, index) => req.params["type"] == item)) {
    if (value || value == 0) {
      try {
        await client.connect();
        const db = client.db("number").collection("number");
        const cookie = parseInt(req.cookies["session_id"]);
        const document = await db.findOne({
          session_id: cookie,
        });
        const updated_list = document.list.map((item, index) => {
          if (type == "substraction") {
            return item - value;
          } else if (type == "addition") {
            return item + value;
          } else if (type == "multiplication") {
            return item * value;
          } else {
            return item / value;
          }
        });
        await db.findOneAndUpdate(
          {
            session_id: cookie,
          },
          {
            $set: {
              list: updated_list,
            },
          }
        );
        res.send(updated_list);
      } catch (err) {
        console.error(err);
        res.send({
          error: true,
          errorMsg: "An error occured please try again later.",
        });
      }
    } else {
      res.send({
        error: true,
        errorMsg: "Please provide a proper value.",
      });
    }
  } else {
    res.send({
      error: true,
      errorMsg: "Please provide a proper operation.",
    });
  }
});

// 404 NOT FOUND HANDLER

app.get("*", function (req, res) {
  res.status(404).json({ error: true, errorMsg: "404 Not found." });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
