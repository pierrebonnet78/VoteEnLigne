const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
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
  var sql = "SELECT * FROM citoyen u where u.email = '" + email + "'";
  db.query(sql, function (err, result, fields) {
    if (err) throw err;

    if (result.length != 0) {
      //email present dans la bdd
      //verifie si le mdp est bon
      let compare = bcrypt.compareSync(password, result[0].MotDePasse);
      if (compare && result[0].Admin) {
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

router.post("/addlivre", (req, res) => {
  const titre = req.body.titre;
  const auteur = req.body.auteur;
  const quantity = parseInt(req.body.quantity);
  const image = req.body.image;

  // vérification de la validité des données d'entrée
  if (
    typeof titre !== "string" ||
    titre === "" ||
    typeof auteur !== "string" ||
    auteur === "" ||
    typeof image !== "string" ||
    image === "" ||
    isNaN(quantity) ||
    quantity <= 0
  ) {
    res.status(400).json({ message: "bad request" });
    return;
  }

  var sql =
    "INSERT INTO livres (titre,auteur,quantity,image) VALUES (" +
    "'" +
    titre +
    "'" +
    ",'" +
    auteur +
    "'," +
    quantity +
    "," +
    "'" +
    image +
    "')";
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json("Livre ajouté");
  });
});

router.post("/listeelectorale", (req, res) => {
  const adminId = req.body.IdCitoyen;
  console.log("Admin id : ", adminId);

  //recupere l'id de la ville et du departement de l'admin
  var sql =
    "select v.IdVille, dep.IdDepartement from citoyen c inner join adresse a on c.IdAdresseDomicile = a.IdAdresse" +
    " inner join Appartient ap on a.IdAdresse = ap.IdAdresse inner join Ville v on" +
    " v.IdVille = ap.IdVille inner join Dans d on  d.IdVille = v.IdVille inner join Departement dep on" +
    " dep.IdDepartement = d.IdDepartement where c.IdCitoyen = " +
    adminId +
    " and c.admin = 1;";
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result[0].IdVille);
    //recupere la liste electrorale (tous les citoyens) de la ville de l'admin.
    var sql2 =
      "select * from citoyen c inner join adresse a on c.IdAdresseDomicile = a.IdAdresse" +
      " inner join Appartient ap on a.IdAdresse = ap.IdAdresse inner join Ville v on" +
      " v.IdVille = ap.IdVille inner join Dans d on  d.IdVille = v.IdVille inner join Departement dep on" +
      " dep.IdDepartement = d.IdDepartement where d.IdVille = " +
      result[0].IdVille +
      " and dep.IdDepartement = " +
      result[0].IdDepartement;

    db.query(sql2, function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    });
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

module.exports = router;
