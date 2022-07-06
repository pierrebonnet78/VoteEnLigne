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
      <div v-if="isChoiceMade" class="choice">
        <div>
          <p>
            Vous êtes sur le point de voter pour &nbsp
            <p id="bold"> {{ choiceCandidat.PrenomCandidat }} {{ choiceCandidat.NomCandidat }}</p>
          </p>
          <p>
            Pour confirmer votre choix, entrez "confirmer mon choix" ci-dessous
          </p>
        </div>
        <div>
          <input type="text" v-model="confirmChoice" placeholder="Confirmer mon choix"/>
        </div>
        <div>
          <button @click="handleCancel()">❌</button>
          <button @click="handleValidate()" v-if="confirmChoice == 'Confirmer mon choix'">✅</button>
        </div>
      </div>
      <div v-if="isJourDeVote == 1 && user.a_vote == null" class="container">
        <h2>🗳️ Les votes sont ouverts 🗳️</h2>
        <h2>Votez pour votre candidat en cliquant sur celui-ci.</h2>
        <div class="liste-candidat">
          <div
            v-for="candidat in listeCandidat"
            :key="candidat.IdCandidat"
            class="candidat"
            @click="handleClick(candidat)"
          >
            <p id="bold">{{ candidat.PrenomCandidat }} {{ candidat.NomCandidat }}</p>
            <img :src="getUrlPhoto(candidat)" class="img" />
          </div>
        </div>
      </div>
      <div v-if="isJourDeVote == 1 && user.a_vote" class="container-stat">
        <h2 >🗳️ Vous avez déjà voté 🗳️</h2>
        <div>
          <button @click="handleStats()">📊 Accès aux statistiques</button>
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
      isJourDeVote: "", // 0 : vote note yet passed, 1 : vote in progress, 2 : vote passed, 3 : already vote
      listeCandidat: [],
      isChoiceMade: false,
      choiceCandidat: {},
      confirmChoice : ""
    };
  },
  methods: {
    async fetchData() {
      //get election
      this.error = this.election = null;
      try {
        const res = await axios.get("/api/getElection");
        this.election = res.data;
        this.$emit("setelectionstats", this.election);
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
      try {
        const res = await axios.post("/api/getCandidats", this.election[0]);
        this.listeCandidat = res.data;
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
        if(this.user.a_vote == true){
          isJourDeVote = 3 //already vote
        }
        else{
          this.isJourDeVote = 2; // vote passed
        }
        
      }
    },
    getUrlPhoto(candidat) {
      return candidat.UrlPhoto;
    },
    handleClick(candidat) {
      this.isChoiceMade = true;
      this.choiceCandidat = candidat;
      window.scrollTo(0, 0);
    },
    handleCancel() {
      this.isChoiceMade = false;
    },
    async handleValidate(){
      this.$emit("vote", this.user, this.choiceCandidat);
      this.isChoiceMade = false;

      try {
        const res = await axios.post("/api/refreshUser", this.user);
        this.user = res.data[0];
        console.log("response :")
        console.log(res)
      } catch (er) {
        this.error = er;
      }
      
      this.confirmChoice = "";
    },
    refreshUser(){
      console.log(this.user)
      this.$emit("refreshuser", this.user);
      this.user = JSON.parse(localStorage.getItem("citoyen"));
      this.user = JSON.parse(localStorage.getItem("citoyen"));
    },
    handleStats(){
      router.push("StatsPage")
    }
  },
  async created() {
    this.user = JSON.parse(localStorage.getItem("citoyen"));
    console.log("created")
    console.log(this.user)
    this.fetchData();
  },
  beforeUpdate() {
    this.checkDate();
  },
};
</script>

<style scoped>
.content h1 {
  font-family: "Open sans", Arial;
  font-size: 40px;
<<<<<<< HEAD
  text-align: center;
=======
  font-weight: 500;
  text-align: center;
  
>>>>>>> 237c89d56e5d03f5517816d6f6eb9ac0968b9ffe
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
  background-color: #7e91e2;
  margin-top: 60px;
  transition: 0.3s all ease-in-out;
  box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
}
.candidat:hover {
  margin-top: 20px;
}

#bold {
  font-weight: bold;
}
.img {
  width: 200px;
  height: 200px;
}

.choice {
  position: relative;
  width: 500px;
  height: 300px;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background-color: #7e91e2;
  border-radius: 10px;
  flex-direction: column;
  text-align: center;
}

button{
 font-size : large;
 gap: 100px
}

.container-stat{
  max-width: auto;
  height: auto;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  text-align:center;
  margin-bottom: 100px;
}


</style>
