<template>
  <div v-if="election" class="content">
    <h1>Statistiques de l'{{ election[0].NomElection }}</h1>
    <p>Nombre de votes total : {{ nbVoteTotal }} ✉️</p>
    <p>Absention : {{ absention }} ⛔</p>
    <p>Pourcentage d'Absention : {{ absentionPourcentage }}</p>

    <div
      v-for="candidat in results"
      :key="candidat.IdCandidat"
      v-if="percentageCalculated"
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
      nbVoteTotal: 0,
      absention: 0,
      absentionPourcentage: 0,
      percentageCalculated: false,
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

      // //get nb total pas voté
      // try {
      //   const res = await axios.get("/api/getAbsention");
      //   this.abstention = res.data[0].nbNonVote;
      //   this.absentionPourcentage = (this.absention / this.nbVoteTotal) * 100;
      // } catch (error) {
      //   this.error = error;
      // }

      this.results.forEach((candidat) => {
        candidat.percentage = (candidat.NbVote / this.nbVoteTotal) * 100;
        this.percentageCalculated = true;
      });

      console.log(this.results);
    },
  },
  created() {
    this.fetchData();
  },
  mounted() {},
};
</script>

<style scoped>
.content h1 {
  font-family: "Open sans", Arial;
  font-size: 40px;
  font-weight: 500;
  text-align: center;
}
</style>
