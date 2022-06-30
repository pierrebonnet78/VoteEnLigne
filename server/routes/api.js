const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Emma2001",
  database: "voteenlignedb",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connecté à la BDD MySQL !");
});

router.post("/inscription", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //hashage du mdp
  (async () => {
    try {
      let hash = await bcrypt.hash(password, await bcrypt.genSalt(10));
      //verifie si le compte n'est pas déja dans la bdd
      var sql =
        "SELECT u.motdepasse FROM citoyen u where u.email = '" + email + "'";
      db.query(sql, function (err, result, fields) {
        if (err) throw err;

        if (result.length != 0) {
          //email present dans la bdd
          res.json(false);
        } else {
          //email pas present dans la bdd
          //créer une nouvelle ligne dans la bdd
          var sql =
            "INSERT INTO citoyen (email,motdepasse,admin) VALUES (" +
            "'" +
            email +
            "'" +
            "," +
            "'" +
            hash +
            "'" +
            "," +
            true +
            ")";
          db.query(sql, function (err, result, fields) {
            if (err) throw err;
          });
          res.json(true);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  })();
});

router.post("/loginAdmin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //verifie si le compte est dans la bdd

  var sql =
    "SELECT * FROM admin a " +
    " inner join Ville v on a.IdVilleMairie = v.IdVille" +
    " where a.email ='" +
    email +
    "';";

  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    if (result.length != 0) {
      //email present dans la bdd
      //verifie si le mdp est bon

      let compare = bcrypt.compareSync(password, result[0].MotDePasseAdmin);
      if (compare && result[0].MotDePasseAdmin) {
        //le mdp est bon
        req.session.currentuser = result;
        //console.log(req.session)
        res.json([1, req.session.currentuser]);
      } else {
        //le mdp n'est pas bon
        res.json([-1, undefined]);
      }
    } else {
      //email pas present dans la bdd
      res.json([0, undefined]);
    }
  });
});

router.post("/loginUser", (req, res) => {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const dateNaissance = req.body.dateNaissance;
  const numElecteur = req.body.numElecteur;
  const numPasseport = req.body.numPasseport;
  const numID = req.body.numID;
  const lieuNaissance = req.body.lieuNaissance;

  //verifie si le compte est dans la bdd

  var sql =  
  "SELECT * FROM Citoyen c " +
  " inner join Ville v on a.IdVilleMairie = v.IdVille" +
  " where a.email ='" +
  email +
  "';";

  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    if (result.length != 0) {
      //email present dans la bdd
      //verifie si le mdp est bon

      let compare = bcrypt.compareSync(password, result[0].MotDePasseAdmin);
      if (compare && result[0].MotDePasseAdmin) {
        //le mdp est bon
        req.session.currentuser = result;
        //console.log(req.session)
        res.json([1, req.session.currentuser]);
      } else {
        //le mdp n'est pas bon
        res.json([-1, undefined]);
      }
    } else {
      //email pas present dans la bdd
      res.json([0, undefined]);
    }
  });
});

router.get("/livres", (req, res) => {
  db.query("SELECT * FROM livres", function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

router.post("/addpanier", (req, res) => {
  const userId = req.body.userid;
  const livreId = req.body.livreid;

  //verifie si le livre n'est pas déja dans le panier
  db.query(
    "SELECT * FROM panier p where p.id_user = " +
      userId +
      " and p.id_livre = " +
      livreId,
    function (err, result, fields) {
      if (err) throw err;

      if (result.length == 0) {
        //livre pas dans le panier de l'user
        //on rajoute le livre dans le panier de l'user
        db.query(
          "INSERT INTO panier (id_user,id_livre) VALUES(" +
            userId +
            "," +
            livreId +
            ")",
          function (err, result, fields) {
            if (err) throw err;
            res.json(true);
          }
        );
      } else {
        //livre déjà dans le panier de l'user
        res.json(false);
      }
    }
  );
});

router.post("/deletelivre", (req, res) => {
  const livreId = req.body.livreid;
  //supprime le livre de la table panier
  db.query(
    "DELETE FROM panier p WHERE p.id_livre = " + livreId,
    function (err, result, fields) {
      if (err) throw err;
    }
  );
  //supprime le livre de la table livres
  db.query(
    "DELETE FROM livres l WHERE l.id_livre = " + livreId,
    function (err, result, fields) {
      if (err) throw err;
      res.json(true);
    }
  );
});

router.post("/addCitoyen", (req, res) => {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const date_naissance = req.body.date_naissance;
  const lieu_naissance = req.body.lieu_naissance;
  const numero_electeur = req.body.numero_electeur;
  const numero_carte_id = req.body.numero_carte_id;
  const numero_passeport = req.body.numero_passeport;
  const id_lieu_domicile = req.body.lieu_domicile;

  // vérification de la validité des données d'entrée
  if (
    typeof nom !== "string" ||
    nom === "" ||
    typeof prenom !== "string" ||
    prenom === "" ||
    typeof numero_carte_id !== "string" ||
    numero_carte_id === "" ||
    typeof numero_passeport !== "string" ||
    numero_passeport === "" ||
    typeof lieu_naissance !== "string" ||
    lieu_naissance === "" ||
    // typeof date_naissance !== "string" ||
    // image === "" ||
    isNaN(numero_electeur)
  ) {
    res.json([400, undefined]);
    return;
  }
  var sql = "SELECT IdVille FROM Ville where Nom ='" + lieu_naissance + "';";

  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    //var sql2 = "SELECT IdVille from Ville where Nom ='" + lieu_domicile + "';";
    //db.query(sql2, function (err, result2, fields) {
    var sql3 =
      "Insert into Citoyen (Nom,Prenom,NomParti,DateNaissance,NumeroElecteur,NumeroPasseport,NumeroIdentite,IdVilleNaissance,IdVilleDomicile) " +
      "VALUES ('" +
      nom +
      "','" +
      prenom +
      "'," +
      null +
      ",'" +
      date_naissance +
      "'," +
      numero_electeur +
      ",' " +
      numero_passeport +
      "','" +
      numero_carte_id +
      "'," +
      result[0].IdVille +
      "," +
      id_lieu_domicile +
      ");";
    db.query(sql3, function (err, result, fields) {
      if (err) throw err;
    });
    res.json("Citoyen Ajouté");
    //});
  });
});

router.post("/listeelectorale", (req, res) => {
  const adminEmail = req.body.Email;
  //recupere l'id de la ville et du departement de l'admin

  var sql =
    "select IdVilleMairie from admin where Email = '" + adminEmail + "';";
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    //recupere la liste electrorale (tous les citoyens) de la ville de l'admin.
    var sql2 =
      "select * from citoyen where citoyen.IdVilleDomicile = " +
      result[0].IdVilleMairie +
      ";";
    db.query(sql2, function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    });
  });
});

router.get("/listeelectoralev2", (req, res) => {
  var sql = "select * from citoyen where citoyen.IdVilleDomicile = 1;";
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

router.post("/deletelpanier", (req, res) => {
  const livreId = req.body.livreid;
  const userId = req.body.userid;

  //supprime de la table panier le livre correspond à l'user
  db.query(
    "DELETE FROM panier p WHERE p.id_livre = " +
      livreId +
      " and p.id_user = " +
      userId,
    function (err, result, fields) {
      if (err) throw err;
      res.json(true);
    }
  );
});

router.post("/validatepanier", (req, res) => {
  const userId = req.body.userid;

  //-1 à la quantity des livres qui sont dans le panier
  var sql =
    "UPDATE livres l INNER JOIN panier p on p.id_livre = l.id_livre SET l.quantity = l.quantity - 1 WHERE p.id_user = " +
    userId;
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
  });
  //vide le panier de l'user
  db.query(
    "DELETE FROM panier p WHERE p.id_user = " + userId,
    function (err, result, fields) {
      if (err) throw err;
      res.json(true);
    }
  );
});

router.get("/user", (req, res) => {
  res.json(req.session.currentuser);
});

router.post("/deletecitoyen", (req, res) => {
  const citoyenId = req.body.IdCitoyen;
  var sql = "DELETE FROM citoyen WHERE IdCitoyen = " + citoyenId + ";";
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(true);
  });
});

module.exports = router;
