<template>
  <div class="container">
    <div class="title">
      <p>Vote en ligne</p>
    </div>
    <div class="body">
      <div class="selector" v-if="!searching">
        <!-- <router-link to="/LoginUser" class="btn-default"
          >Sélectionner une commune</router-link
        > -->
        <button @click="handleClick()" style="width: 300px;">Sélectionner votre commune</button>
      </div>

      <div v-if="loading" class="loading">
        <h3>Loading...</h3>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="listeVille" class="content">
        <div v-if="searching">
          <input
            type="text"
            v-model="searchText"
            placeholder="Search"
            style="font-size: 15px"
          />
          <br />
          <br />

          <table class="table" v-if="searchText">
            <tbody>
              <tr
                v-for="ville in filteredVille"
                
                @click="selectVille(ville)"
                :key="ville.IdVille"
              >
                <td>{{ ville.NomVille }}</td>
                <td>{{ ville.CodePostal }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <br />
    <br />
    <button style="width: 300px;">
      <!-- <button  @onclick={} class="btn-default">Connexion Admin</button> -->
      <router-link class="boutonAdmin" to="/AdminLogin" >Connexion Admin</router-link>
    </button>
  </div>
</template>

<script>
module.exports = {
  props: {
    villeselected: { type: Object, default: {} },
  },
  data() {
    return {
      listeVille: [],
      searchText: "",
      loading: true,
      error: null,
      searching: false,
    };
  },
  computed: {
    filteredVille() {
      if (this.listeVille != null) {
        return this.listeVille.filter((p) => {
          return (
            p.NomVille.toLowerCase().indexOf(this.searchText.toLowerCase()) !=
            -1
          );
        });
      }
    },
  },
  methods: {
    async fetchVille() {
      this.error = this.listeVille = null;
      try {
        const res = await axios.get("/api/getVilles");
        this.listeVille = res.data;
        this.loading = false;
      } catch (er) {
        this.error = er;
      }
    },
    selectVille(ville) {
      this.searchText = ville.NomVille;

      this.$emit("setvilleselected", ville);
      router.push("LoginUser");
    },
    handleClick() {
      this.searching = true;
    },
  },
  async created() {
    this.fetchVille();
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.header {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  width: 100%;
  height: 5vw;
}

.title {
  font-size: 40px;
}

button {
  color: #090909;
  padding: 0.7em 1.7em;
  font-size: 18px;
  border-radius: 0.5em;
  background: #e8e8e8;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;
}

.boutonAdmin {
  text-decoration: none;
  color: inherit;
}

button:hover {
  border: 1px solid white;
}

button:active {
  box-shadow: 4px 4px 12px #c5c5c5, -4px -4px 12px #ffffff;
}
.button {
  margin-top: 200px;
}

.input-text {
  text-align: center;
}

.inputText {
  border: 0;
  font-size: 18px;
  margin-bottom: 5px;
}

tr:hover {
  cursor: pointer;
  font-weight: bold;
}
</style>
