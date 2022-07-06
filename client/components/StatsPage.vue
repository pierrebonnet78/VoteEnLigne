<template>
  <div v-if="election" class="content">
    <h1>Statistiques de l'{{ election[0].NomElection }}</h1>
    <form>
      <div id="input-grp">
        <p>Filtrer les résultats :</p>

        <div>
          <div class="div-button">
            <button @click="handleFiltreRegionClick()">Par région</button>
            <button @click="handleFiltreDepartementClick()">
              Par département
            </button>
            <button @click="handleFiltreVilleClick()">Par ville</button>
          </div>
          <input
            type="text"
            v-if="filtreRegion"
            placeholder="Chercher région"
            class="form-control"
            v-model="searchText"
          />
          <input
            type="text"
            v-if="filtreDepartement"
            v-model="searchText"
            placeholder="Chercher département"
            class="form-control"
          />
          <input
            type="text"
            v-if="filtreVille"
            placeholder="Chercher ville"
            class="form-control"
            v-model="searchText"
          />
          <table class="table">
            <tbody>
              <tr
                v-for="(region, index) in filteredRegion"
                v-if="filtreRegion && searchText"
                :key="region.IdRegion"
                @click="handleRegionClick(region)"
              >
                <td>{{ region.NomRegion }}</td>
              </tr>
            </tbody>
          </table>
          <table class="table">
            <tbody>
              <tr
                v-for="(departement, index) in filteredDepartement"
                v-if="filtreDepartement && searchText"
                :key="departement.IdDepartement"
                @click="handleDepartementClick(departement)"
              >
                <td>{{ departement.NomDepartement }}</td>
              </tr>
            </tbody>
          </table>
          <table class="table">
            <tbody>
              <tr
                v-for="(ville, index) in filteredVille"
                v-if="filtreVille && searchText"
                :key="ville.IdVille"
                @click="handleVilleClick(ville)"
              >
                <td>{{ ville.NomVille }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div id="btn-grp" style="margin-top: 10px">
        <button @click="handleReinitialiser()" class="btn-default">
          Réinitialiser
        </button>
        <button @click="handleSearch()" class="btn-default">Rechercher</button>
      </div>
    </form>
    <p>Nombre de votes total : {{ nbVoteTotal }} ✉️</p>
    <p>Abstention : {{ abstention }} ⛔</p>
    <p>Pourcentage d'Abstention : {{ abstentionPourcentage }} %</p>

    <div
      v-for="candidat in results"
      :key="candidat.IdCandidat"
      v-if="percentageCalculated && !filtreActivate"
    >
      <p>
        {{ candidat.PrenomCandidat }} {{ candidat.NomCandidat }} :
        {{ candidat.percentage }} % <br />
      </p>
    </div>
  </div>
</template>
<script>
module.exports = {
  data() {
    return {
      election: {},
      results: {},
      regions: [],
      departements: [],
      villes: [],
      nbVoteTotal: 0,
      abstention: 0,
      abstentionPourcentage: 0,
      percentageCalculated: false,
      filtreRegion: false,
      filtreDepartement: false,
      filtreVille: false,
      filtreActivate: false,
      searchText: "",
      selection: {
        id: 0,
      },
    };
  },
  methods: {
    async fetchData() {
      //get election
      this.error = this.election = null;
      try {
        const res = await axios.get("/api/getElection");
        this.election = res.data;
        console.log(this.election);
      } catch (error) {
        this.error = error;
        return;
      }

      //get results
      try {
        const res = await axios.post("/api/getResults", this.election[0]);
        this.results = res.data;
      } catch (error) {
        this.error = error;
      }

      //get nb total vote
      try {
        const res = await axios.get("/api/getNbVote");
        this.nbVoteTotal = res.data[0].nbVoteTotal;
      } catch (error) {
        this.error = error;
      }

      //get nb total pas voté
      try {
        const res = await axios.get("/api/getAbstention");
        this.abstention = res.data[0].nbNonVote;
        this.abstentionPourcentage = (
          (this.abstention / this.nbVoteTotal) *
          100
        ).toFixed(2);
      } catch (error) {
        this.error = error;
      }
      //add percentage for each candidate
      this.results.forEach((candidat) => {
        candidat.percentage = (
          (candidat.NbVote / this.nbVoteTotal) *
          100
        ).toFixed(2);
        this.percentageCalculated = true;
      });

      //get list of region
      try {
        const res = await axios.get("/api/getRegions");
        this.regions = res.data;
      } catch (error) {
        this.error = error;
      }

      //get list of departement
      try {
        const res = await axios.get("/api/getDepartements");
        this.departements = res.data;
      } catch (error) {
        this.error = error;
      }

      //get list of ville
      try {
        const res = await axios.get("/api/getVilles");
        this.villes = res.data;
      } catch (error) {
        this.error = error;
      }
    },
    handleFiltreRegionClick() {
      this.filtreRegion = true;
      this.filtreDepartement = this.filtreVille = false;
      this.searchText = "";
    },
    handleFiltreDepartementClick() {
      this.filtreDepartement = true;
      this.filtreRegion = this.filtreVille = false;
      this.searchText = "";
    },
    handleFiltreVilleClick() {
      this.filtreVille = true;
      this.filtreRegion = this.filtreDepartement = false;
      this.searchText = "";
    },
    handleSelectInput(text) {
      this.searchText = text.NomRegion;
    },
    handleVilleClick(ville) {
      this.searchText = ville.NomVille;
      this.selection.id = ville.IdVille;
    },
    handleRegionClick(region) {
      this.searchText = region.NomRegion;
      this.selection.id = region.IdRegion;
    },
    handleDepartementClick(departement) {
      this.searchText = departement.NomDepartement;
      this.selection.id = departement.IdDepartement;
    },
    async handleReinitialiser() {
      this.fetchData();
      this.filtreActivate =
        this.filtreRegion =
        this.filtreDepartement =
        this.filtreVille =
          false;
    },
    async handleSearch() {
      this.filtreActivate = true;

      try {
        if (this.filtreVille) {
          var res = await axios.post("/api/getNbVoteByVille", this.selection);
        } else if (this.filtreRegion) {
          var res = await axios.post("/api/getNbVoteByRegion", this.selection);
        } else {
          var res = await axios.post(
            "/api/getNbVoteByDepartement",
            this.selection
          );
        }
        this.nbVoteTotal = res.data[0].nbVoteTotal;
      } catch (error) {
        this.error = error;
        return;
      }
      try {
        if (this.filtreVille) {
          var res = await axios.post(
            "/api/getAbstentionByVille",
            this.selection
          );
        } else if (this.filtreRegion) {
          var res = await axios.post(
            "/api/getAbstentionByRegion",
            this.selection
          );
        } else {
          var res = await axios.post(
            "/api/getAbstentionByDepartement",
            this.selection
          );
        }
        this.abstention = res.data[0].nbNonVote;
        this.abstentionPourcentage = (
          (this.abstention / this.nbVoteTotal) *
          100
        ).toFixed(2);
      } catch (error) {
        this.error = error;
        return;
      }
    },
  },
  created() {
    this.fetchData();
  },
  computed: {
    filteredVille() {
      if (this.villes != null) {
        return this.villes.filter((p) => {
          return (
            p.NomVille.toLowerCase().indexOf(this.searchText.toLowerCase()) !=
            -1
          );
        });
      }
    },
    filteredRegion() {
      if (this.regions != null) {
        return this.regions.filter((p) => {
          return (
            p.NomRegion.toLowerCase().indexOf(this.searchText.toLowerCase()) !=
            -1
          );
        });
      }
    },
    filteredDepartement() {
      if (this.departements != null) {
        return this.departements.filter((p) => {
          return (
            p.NomDepartement.toLowerCase().indexOf(
              this.searchText.toLowerCase()
            ) != -1
          );
        });
      }
    },
  },
};
</script>

<style scoped>
.content h1 {
  font-family: "Open sans", Arial;
  font-size: 40px;
  font-weight: 500;
  text-align: center;
}
form {
  text-align: center;
}
#btn-grp {
  margin-top: 600px;
}

#input-grp {
  margin-top: 50px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.div-button {
  display: flex;
  flex-direction: row;
  gap: 15px;
}
.btn-default {
  text-align: center;
  background: rgb(151, 149, 149);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  font-size: 25px;
  padding: 5px 15px;
  margin-top: 20px;
}

input {
  margin-top: 15px;
}

tr:hover {
  cursor: pointer;
  font-weight: bold;
}

table {
  margin: auto;
}
</style>
