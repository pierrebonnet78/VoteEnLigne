const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
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
  const date_naissance = req.body.date_naissance;
  const lieu_naissance = req.body.lieu_naissance;
  const numero_electeur = req.body.numero_electeur;
  const numero_carte_id = req.body.numero_carte_id;
  const numero_passeport = req.body.numero_passeport;
  const id_lieu_domicile = req.body.id_lieu_domicile;
  const connection_type = req.body.connection_type;

  var sql =
    "SELECT IdVille FROM Ville where NomVille ='" + lieu_naissance + "';";

  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    if (result.length === 0) {
      res.json([400, undefined]);
      return;
    }
    if (connection_type) {
      var sql2 =
        "SELECT * FROM Citoyen c where c.Nom='" +
        nom +
        "' and c.Prenom='" +
        prenom +
        "' and c.DateNaissance='" +
        date_naissance +
        "' and c.IdVilleNaissance='" +
        result[0].IdVille +
        "' and c.IdVilleDomicile=" +
        id_lieu_domicile +
        " and c.NumeroElecteur =" +
        numero_electeur +
        " and c.NumeroIdentite='" +
        numero_carte_id +
        "';";
    } else {
      var sql2 =
        "SELECT * FROM Citoyen c where c.Nom='" +
        nom +
        "' and c.Prenom='" +
        prenom +
        "' and c.DateNaissance='" +
        date_naissance +
        "' and c.IdVilleNaissance='" +
        result[0].IdVille +
        "' and c.IdVilleDomicile=" +
        id_lieu_domicile +
        " and c.NumeroPasseport ='" +
        numero_passeport +
        "' and c.NumeroElecteur =" +
        numero_electeur +
        ";";
    }
    db.query(sql2, function (err, result2, fields) {
      if (err) throw err;

      if (result2.length == 0) {
        res.json([400, undefined]);
        return;
      }
      res.json([200, result2]);
    });
  });
});

router.post("/refreshUser", (req, res) => {
  const IdCitoyen = req.body.IdCitoyen;

  var sql = "Select * from citoyen where IdCitoyen = " + IdCitoyen;
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
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
    isNaN(numero_electeur)
  ) {
    res.json([400, undefined]);
    return;
  }
  var sql =
    "SELECT IdVille FROM Ville where NomVille ='" + lieu_naissance + "';";

  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    if (result.length === 0) {
      res.json([400, undefined]);
      return;
    }
    var sql3 =
      "Insert into Citoyen (Nom,Prenom,DateNaissance,NumeroElecteur,NumeroPasseport,NumeroIdentite,IdVilleNaissance,IdVilleDomicile) " +
      "VALUES ('" +
      nom +
      "','" +
      prenom +
      "','" +
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

router.post("/updateCitoyen", (req, res) => {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const date_naissance = req.body.date_naissance;
  const lieu_naissance = req.body.lieu_naissance;
  const numero_electeur = req.body.numero_electeur;
  const numero_carte_id = req.body.numero_carte_id;
  const numero_passeport = req.body.numero_passeport;
  const id_lieu_domicile = req.body.lieu_domicile;
  const id_citoyen = req.body.id_citoyen;

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
    isNaN(numero_electeur)
  ) {
    res.json([400, undefined]);
    return;
  }
  var sql =
    "SELECT IdVille FROM Ville where NomVille ='" + lieu_naissance + "';";

  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    if (result.length === 0) {
      res.json([400, undefined]);
      return;
    }
    var sql3 =
      "Update citoyen c set c.Nom='" +
      nom +
      "' , c.Prenom='" +
      prenom +
      "' , c.DateNaissance='" +
      date_naissance +
      "' , c.NumeroElecteur=" +
      numero_electeur +
      " , c.NumeroPasseport='" +
      numero_passeport +
      "' , c.NumeroIdentite='" +
      numero_carte_id +
      "' , c.IdVilleNaissance=" +
      result[0].IdVille +
      " , c.IdVilleDomicile=" +
      id_lieu_domicile +
      " where c.IdCitoyen=" +
      id_citoyen +
      ";";
    db.query(sql3, function (err, result, fields) {
      if (err) throw err;
    });
    res.json("Citoyen Updaté");
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
      "select *, Ville.NomVille from citoyen inner join Ville" +
      " on citoyen.IdVilleNaissance = Ville.IdVille where citoyen.IdVilleDomicile = " +
      result[0].IdVilleMairie +
      ";";
    db.query(sql2, function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    });
  });
});

router.get("/getville", (req, res) => {
  var sql = "Select * from Ville ORDER BY CodePostal;";
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

router.post("/getCandidats", (req, res) => {
  const IdElection = req.body.IdElection;

  var sql =
    "Select * from candidat where IdElectionCandidature = " + IdElection;
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

router.get("/getElection", (req, res) => {
  var sql = "Select * from election where Actif=true;";
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

router.post("/deletecitoyen", (req, res) => {
  const citoyenId = req.body.IdCitoyen;
  var sql = "DELETE FROM citoyen WHERE IdCitoyen = " + citoyenId + ";";
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(true);
  });
});

router.post("/vote", (req, res) => {
  const IdCitoyen = req.body.citoyen.IdCitoyen;
  const IdCandidat = req.body.candidat.IdCandidat;

  var sql = "UPDATE Citoyen set a_vote = true where IdCitoyen =" + IdCitoyen;
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
  });
  sql = "UPDATE Candidat SET NbVote = NbVote+1 where IdCandidat =" + IdCandidat;
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json("Vote enregistré");
  });
});

router.post("/getResults", (req, res) => {
  const IdElection = req.body.IdElection;

  var sql =
    "select * from Candidat where IdElectionCandidature =" +
    IdElection +
    "  order by NbVote DESC";
  console.log(sql);
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

router.get("/getNbVote", (req, res) => {
  var sql = "select count(*) as nbVoteTotal from citoyen where a_vote = 1 ";
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

router.get("/getAbsention", (req, res) => {
  var sql = "select count(*) as nbNonVote from citoyen where a_vote = 0 ";
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

module.exports = router;
