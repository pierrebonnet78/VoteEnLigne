<template>
  <div class="container">
    <h1>Liste Electorale</h1>

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
            <!-- <th class="tg-0lax"><span style="font-weight:bold">Lieu de naissance</span></th> -->
            <th class="tg-0lax">
              <span style="font-weight: bold">N° électeur</span>
            </th>
            <th class="tg-0lax">
              <span style="font-weight: bold">N° passeport</span>
            </th>
            <th class="tg-0lax">
              <span style="font-weight: bold; color: #000"
                >N° carte d'identité</span
              >
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
            <!-- <td class="tg-0lax">{{citoyen.LieuNaissance}}</td> -->
            <td class="tg-0lax">{{ citoyen.NumeroElecteur }}</td>
            <td class="tg-0lax">{{ citoyen.NumeroPasseport }}</td>
            <td class="tg-0lax">{{ citoyen.NumeroIdentite }}</td>
          </tr>
        </tbody>
      </table>
    </div>

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
      placeholder="Lieu de naissance"
      class="input-text"
    /><br />
    <input
      type="text"
      v-model="newCitoyen.numero_electeur"
      placeholder="Numéro d'élécteur"
      class="input-text"
    /><br />
    <input
      type="text"
      v-model="newCitoyen.numero_carte_id"
      placeholder="Numéro carte Identité"
      class="input-text"
    /><br />
    <input
      type="text"
      v-model="newCitoyen.numero_passport"
      placeholder="Numéro passport"
      class="input-text"
    /><br />
    <button type="submit" class="btn-default">Ajouter</button>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      newCitoyen: {
        nom: "",
        prenom: "",
        date_naissance: "",
        lieu_naissance: "",
        numero_electeur: "",
        numero_carte_id: "",
        numero_passport: "",
      },
      loading: true,
      error: null,
      listeElectorale: [],
      currentAdmin: [],
    };
  },
  methods: {
    addCitoyen() {
      this.$emit("add-livre", this.newCitoyen);
    },
    async fetchData() {
      this.error = this.listeelectorale = null;
      try {
        const res = await axios.post("/api/listeelectorale", this.currentAdmin);
        this.listeelectorale = res.data;
        this.loading = false;
      } catch (er) {
        this.error = er;
      }
    },
  },
  async created() {
    this.currentAdmin = JSON.parse(localStorage.getItem("admin"));
    this.fetchData();
  },
  //   computed: {
  //     async update_listeelectoral() {
  //       try {
  //         const res = await axios.post("/api/listeelectorale", this.currentAdmin);
  //         this.loading = false;
  //         return (this.listeelectorale = res.data);
  //       } catch (er) {
  //         this.error = er;
  //       }
  //     },
  //   },

  //   mounted() {
  //     this.$emit("refreshuser");
  //     console.log(this.currentAdmin);

  //     // if (!this.listeelectorale) {
  //     //   const res = await axios.post(
  //     //     "/api/listeelectorale",
  //     //     this.$data.currentAdmin[0]
  //     //   );
  //     //   console.log(res);
  //     //   this.$data.listeelectorale = res.data;
  //     // }
  //   },
};
</script>

<style>
.container {
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
  background: rgb(190, 189, 189);
  border: 0;
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
</style>
