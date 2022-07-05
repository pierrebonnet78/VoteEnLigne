<template>
  <div class="container">
    <h1>
      Liste Electorale de {{ currentAdmin.Nom }} {{ currentAdmin.CodePostal }}
    </h1>

    <div v-if="loading" class="loading">
      <h3>Loading...</h3>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="listeelectorale" class="content">
      <table class="tg">
        <thead>
          <tr>
            <th class="tg-0lax"><span style="font-weight: bold">Nom</span></th>
            <th class="tg-0lax">
              <span style="font-weight: bold">Prénom</span>
            </th>
            <th class="tg-0lax">
              <span style="font-weight: bold">Date de naissance</span>
            </th>

            <th class="tg-0lax">
              <span style="font-weight: bold">Ville de naissance</span>
            </th>
            <th class="tg-0lax">
              <span style="font-weight: bold">N° électeur</span>
            </th>
            <th class="tg-0lax">
              <span style="font-weight: bold">N° passeport</span>
            </th>
            <th class="tg-0lax">
              <span style="font-weight: bold">N° carte d'identité</span>
            </th>
            <th class="tg-zv4m">
              <span style="font-weight: bold"></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="citoyen in listeelectorale"
            :key="listeelectorale.IdCitoyen"
          >
            <td class="tg-0lax">{{ citoyen.Nom }}</td>
            <td class="tg-0lax">{{ citoyen.Prenom }}</td>
            <td class="tg-0lax">{{ citoyen.DateNaissance }}</td>
            <td class="tg-0lax">
              {{ citoyen.NomVille }} {{ citoyen.CodePostal }}
            </td>
            <td class="tg-0lax">{{ citoyen.NumeroElecteur }}</td>
            <td class="tg-0lax">{{ citoyen.NumeroPasseport }}</td>
            <td class="tg-0lax">{{ citoyen.NumeroIdentite }}</td>
            <td class="tg-zv4m">
              <div>
                <button @click="fillUpdateCitoyen(citoyen)">✏️</button>
                <button @click="deleteCitoyen(citoyen)">❌</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <form id="myform">
      <input
        type="text"
        v-model="newCitoyen.nom"
        placeholder="Nom"
        class="input-text"
      /><br />
      <input
        type="text"
        v-model="newCitoyen.prenom"
        placeholder="Prénom"
        class="input-text"
      /><br />
      <input
        type="date"
        v-model="newCitoyen.date_naissance"
        placeholder="Date de naissance"
        class="input-text"
      /><br />
      <input
        type="text"
        v-model="newCitoyen.lieu_naissance"
        placeholder="Ville de naissance"
        class="input-text"
        @click="handleClickInput()"
        @focus="handleClickInput()"
      /><br />
      <div v-if="searching">
        <table class="table">
          <tbody>
            <tr
              v-for="(ville, index) in filteredVille"
              v-if="index < 10"
              @click="handleClickVille(ville)"
              :key="ville.IdVille"
            >
              <td>{{ ville.NomVille }}</td>
              <td>{{ ville.CodePostal }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <input
        type="text"
        v-model="newCitoyen.numero_electeur"
        placeholder="Numéro d'électeur"
        class="input-text"
      /><br />
      <input
        type="text"
        v-model="newCitoyen.numero_carte_id"
        placeholder="Numéro carte identité"
        class="input-text"
      /><br />
      <input
        type="text"
        v-model="newCitoyen.numero_passeport"
        placeholder="Numéro passeport"
        class="input-text"
      /><br />
      <button v-if="!modifyng" @click="addCitoyen()" class="btn-default">
        Ajouter
      </button>
      <button v-if="modifyng" @click="updateCitoyen()" class="btn-default">
        Modifier
      </button>
      <button v-if="modifyng" @click="handleAnnulerClick()" class="btn-default">
        Annuler
      </button>
    </form>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      listeVille: [],
      newCitoyen: {
        nom: "",
        prenom: "",
        date_naissance: "",
        lieu_naissance: "",
        numero_electeur: "",
        numero_carte_id: "",
        numero_passeport: "",
        lieu_domicile: "",
        id_citoyen: "",
      },
      loading: true,
      error: null,
      currentAdmin: [],
      searching: false,
      modifyng: false,
    };
  },
  methods: {
    async fetchVille() {
      this.error = this.listeVille = null;
      try {
        const res = await axios.get("/api/getville");
        this.listeVille = res.data;
        this.loading = false;
      } catch (er) {
        this.error = er;
      }
    },
    selectVille(ville) {
      this.lieu_naissance = ville.NomVille;
    },
    addCitoyen() {
      this.$emit("addcitoyen", this.newCitoyen);
      document.getElementById("myform").reset();
    },
    async fetchListeElectorale() {
      this.error = this.listeelectorale = null;
      try {
        const res = await axios.post("/api/listeelectorale", this.currentAdmin);
        this.listeelectorale = res.data;
        this.loading = false;
      } catch (er) {
        this.error = er;
      }
    },
    deleteCitoyen(citoyen) {
      this.$emit("deletecitoyen", citoyen);
    },
    fillUpdateCitoyen(citoyen) {
      let date = citoyen.DateNaissance.substring(0, 10);
      this.newCitoyen.nom = citoyen.Nom;
      this.newCitoyen.prenom = citoyen.Prenom;
      this.newCitoyen.date_naissance = date;
      this.newCitoyen.lieu_naissance = citoyen.NomVille;
      this.newCitoyen.numero_electeur = citoyen.NumeroElecteur;
      this.newCitoyen.numero_carte_id = citoyen.NumeroIdentite;
      this.newCitoyen.numero_passeport = citoyen.NumeroPasseport;
      this.newCitoyen.id_citoyen = citoyen.IdCitoyen;
      this.modifyng = true;
    },
    updateCitoyen() {
      this.$emit("updatecitoyen", this.newCitoyen);
      (this.newCitoyen.nom = ""),
        (this.newCitoyen.prenom = ""),
        (this.newCitoyen.date_naissance = ""),
        (this.newCitoyen.lieu_naissance = ""),
        (this.newCitoyen.numero_electeur = ""),
        (this.newCitoyen.numero_carte_id = ""),
        (this.newCitoyen.numero_passeport = ""),
        (this.newCitoyen.lieu_domicile = ""),
        document.getElementById("myform").reset();
      this.modifyng = false;
    },
    handleClickInput() {
      this.searching = true;
    },
    handleClickVille(ville) {
      this.newCitoyen.lieu_naissance = ville.NomVille;
      this.searching = false;
    },
    handleAnnulerClick() {
      (this.newCitoyen.nom = ""),
        (this.newCitoyen.prenom = ""),
        (this.newCitoyen.date_naissance = ""),
        (this.newCitoyen.lieu_naissance = ""),
        (this.newCitoyen.numero_electeur = ""),
        (this.newCitoyen.numero_carte_id = ""),
        (this.newCitoyen.numero_passeport = ""),
        (this.newCitoyen.lieu_domicile = ""),
        document.getElementById("myform").reset();
      this.modifyng = false;
    },
  },
  computed: {
    filteredVille() {
      if (this.listeVille != null) {
        return this.listeVille.filter((p) => {
          return (
            p.NomVille.toLowerCase().indexOf(
              this.newCitoyen.lieu_naissance.toLowerCase()
            ) != -1
          );
        });
      }
    },
  },
  async created() {
    this.currentAdmin = JSON.parse(localStorage.getItem("admin"));
    this.newCitoyen.lieu_domicile = this.currentAdmin.IdVille;
    this.fetchListeElectorale();
    this.fetchVille();
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.btn-default {
  text-align: center;
  background: rgb(151, 149, 149);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  font-size: 15px;
  padding: 12px 36px;
  margin-top: 20px;
}
.input-text {
  background: rgb(252, 252, 252);
  border: 1px solid rgb(0, 0, 0);
  font-size: 18px;
  margin-top: 15px;
}

.citoyen_tableau {
  display: flex;
  justify-content: space-between;
  margin-left: 40px;
  margin-right: 40px;
  margin-bottom: 35px;
}

.livre-content {
  margin: auto;
}

.tg {
  border-collapse: collapse;
  border-spacing: 0;
  margin-left: auto;
  margin-right: auto;
}

.tg td {
  border-color: black;
  border-style: solid;
  border-width: 1px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  overflow: hidden;
  padding: 10px 5px;
  word-break: normal;
}

.tg th {
  border-color: black;
  border-style: solid;
  border-width: 1px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
  overflow: hidden;
  padding: 10px 5px;
  word-break: normal;
}

.tg .tg-0lax {
  text-align: left;
  vertical-align: top;
}

.tg .tg-zv4m {
  border-color: #ffffff;
  text-align: left;
  vertical-align: top;
  padding-left: 30px;
}

.table {
  margin-left: auto;
  margin-right: auto;
}

tr:hover {
  cursor: pointer;
  font-weight: bold;
}
</style>
