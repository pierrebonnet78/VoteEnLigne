<template>
  <div class="content">
    <div v-if="loading" class="loading">
      <h3>Loading...</h3>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="election" class="content">
      <h1>{{ election[0].NomElection }}</h1>
      <h4>Date : {{ dayElection }} 🗓️</h4>
      <h4>Ouverture des votes : {{ debutElection }} 📭</h4>
      <h4>Fermeture des votes : {{ finElection }} 📪</h4>

      <h2 v-if="!isJourDeVote">⌚ Vous ne pouvez pas encore voter ⌚</h2>
      <h2 v-if="isJourDeVote == 2">📫 Les votes sont fermés 📫</h2>
      <div v-if="isJourDeVote == 1" class="container">
        <h2>🗳️ Les votes sont ouverts 🗳️</h2>
        <h2>Votez pour votre candidat en cliquant sur celui-ci.</h2>
        <div class="liste-candidat">
          <div
            v-for="candidat in listeCandidat"
            :key="candidat.IdCandidat"
            class="candidat"
          >
            <p>{{ candidat.PrenomCandidat }} {{ candidat.NomCandidat }}</p>
            <img :src="getUrlPhoto(candidat)" class="img" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      user: {},
      election: {},
      error: null,
      loading: true,
      dayElection: "",
      debutElection: "",
      finElection: "",
      isJourDeVote: "", // 0 : vote note yet passed, 1 : vote in progress, 2 : vote passed
      listeCandidat: [],
    };
  },
  methods: {
    async fetchData() {
      //get election
      this.error = this.election = null;
      try {
        const res = await axios.get("/api/getElection");
        this.election = res.data;
        //this.loading = false;
      } catch (error) {
        this.error = error;
        return;
      }
      // set start date/time of the election
      this.dayElection = this.election[0].Debut.substring(0, 10);
      this.debutElection = this.election[0].Debut.substring(11, 16);
      this.finElection = this.election[0].Fin.substring(11, 16);

      this.debutElection =
        this.election[0].Debut.substring(0, 10) +
        " " +
        this.election[0].Debut.substring(11, 16);
      this.debutElection = this.debutElection.replaceAll("-", "/");
      // set end date/time of the election
      this.finElection =
        this.election[0].Fin.substring(0, 10) +
        " " +
        this.election[0].Fin.substring(11, 16);
      this.finElection = this.finElection.replaceAll("-", "/");

      // get candidates list
      console.log(this.election);
      try {
        const res = await axios.post("/api/getCandidats", this.election[0]);
        this.listeCandidat = res.data;
        console.log(this.listeCandidat);
        this.loading = false;
      } catch (error) {
        this.error = error;
        return;
      }

      return;
    },
    checkDate() {
      var currentDate = new Date().toLocaleString(); //get current date/time
      currentDate =
        currentDate.substring(6, 10) +
        currentDate.substring(2, 6) +
        currentDate.substring(0, 2) +
        currentDate.substring(10, 19);

      if (currentDate > this.debutElection && currentDate < this.finElection) {
        this.isJourDeVote = 1; // time to vote
      } else if (currentDate < this.debutElection) {
        this.isJourDeVote = 0; // vote not yet passed
      } else {
        this.isJourDeVote = 2; // vote passed
      }
    },
    getUrlPhoto(candidat) {
      console.log(candidat.UrlPhoto);
      return candidat.UrlPhoto;
    },
  },
  async created() {
    this.user = JSON.parse(localStorage.getItem("citoyen"));
    this.fetchData();
  },
  beforeUpdate() {
    this.checkDate();
    console.log("jour de vote ", this.isJourDeVote);
  },
};
</script>

<style scoped>
.content h1 {
  font-family: "Open sans", Arial;
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  text-decoration: underline;
}

.content h2 {
  text-align: center;
}

.container {
  position: relative;
  width: 50%;
  height: auto;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.liste-candidat {
  align-content: center;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-around;
  text-align: center;
  gap: 5px;
  margin-bottom: 200px;
}
.candidat {
  flex: 0 1 25%;
  border-radius: 10px;
  background-color: #5873e7;
  margin-top: 60px;
  transition: 0.3s all ease-in-out;
}
.candidat:hover {
  margin-top: 20px;
}

.img {
  width: 200px;
  height: 200px;
}
</style>
