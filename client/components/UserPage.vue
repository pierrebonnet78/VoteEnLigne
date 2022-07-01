<template>
  <div class="body">
    <h1>Bonjour {{ user.Prenom }}</h1>
    <div v-if="loading" class="loading">
      <h3>Loading...</h3>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="listeElection" class="content">
      <table class="tg">
        <thead>
          <tr>
            <th class="tg-0lax">
              <span style="font-weight: bold">Election</span>
            </th>
            <th class="tg-0lax">
              <span style="font-weight: bold">Debut des votes</span>
            </th>
            <th class="tg-0lax">
              <span style="font-weight: bold">Fin des votes</span>
            </th>
            <th class="tg-zv4m">
              <span style="font-weight: bold"></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="election in listeElection" :key="listeElection.IdElection">
            <td class="tg-0lax">{{ election.NomElection }}</td>
            <td class="tg-0lax">{{ election.Debut }}</td>
            <td class="tg-0lax">{{ election.Fin }}</td>
            <td class="tg-zv4m">
              <div>
                <button @click="fillUpdateCitoyen(citoyen)">Modifier</button>
                <button @click="deleteCitoyen(citoyen)">Supprimer</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      user: {},
      listeElection: [],
      error: null,
      loading: true,
    };
  },
  methods: {
    async fetchElection() {
      this.error = this.listeElection = null;
      try {
        const res = await axios.get("/api/listeElection");
        this.listeElection = res.data;
        this.loading = false;
      } catch (error) {
        this.error = error;
      }
      console.log(this.listeElection);
    },
  },
  async created() {
    this.user = JSON.parse(localStorage.getItem("citoyen"));
    this.fetchElection();
    console.log(this.user);
  },
};
</script>

<style scoped>
.body h1 {
  font-family: "Open sans", Arial;
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  text-decoration: underline;
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
