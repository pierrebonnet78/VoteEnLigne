<template>
  <div class="body" style="text-align: center" v-if="villeselected">
    <h1>Portail Electeur ville de {{ villeselected.NomVille }}</h1>
    <form>
      <div id="input-grp">
        <input
          type="text"
          v-model="citoyen.nom"
          placeholder="Nom"
          required
          class="form-control"
        />
        <input
          type="text"
          v-model="citoyen.prenom"
          placeholder="Prénom"
          required
          class="form-control"
        />
        <input
          type="date"
          v-model="citoyen.date_naissance"
          placeholder="Date de naissance"
          required
          class="form-control"
        />
        <input
          type="text"
          v-model="searchText"
          placeholder="Lieu de naissance"
          style="font-size: 15px"
          required
          class="form-control"
          @click="handleClick()"
        />
        <div v-if="villes" class="content">
          <table class="table">
            <tbody>
              <tr
                v-if="searchText"
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
        <input
          type="text"
          v-model="citoyen.numero_electeur"
          placeholder="Numéro d'électeur"
          required
          class="form-control"
        />
        <p>Choisissez votre méthode d'indentification :</p>
        <button @click="handlePasseportClick()" style="font-size: 16px">
          Numéro de passeport
        </button>
        <button @click="handleIdClick()" style="font-size: 16px">
          Numéro de carte d'identité
        </button>
        <br />

        <input
          type="text"
          v-if="connectionWithPasseport"
          v-model="citoyen.numero_passeport"
          placeholder="Numéro de passeport"
          required
          class="form-control, input-numero"
        />
        <input
          type="text"
          v-if="connectionWithId"
          v-model="citoyen.numero_carte_id"
          placeholder="Numéro d'identité"
          required
          class="form-control, input-numero"
        />
      </div>

      <div id="btn-grp" style="margin-top: 15px">
        <button @click="loginUser()" class="btn-default">Connexion</button>
      </div>
    </form>
  </div>
</template>

<script>
module.exports = {
  props: {
    villeselected: { type: Object, default: null },
  },
  data() {
    return {
      citoyen: {
        nom: "",
        prenom: "",
        date_naissance: "",
        lieu_naissance: "",
        numero_electeur: "",
        numero_carte_id: "",
        numero_passeport: "",
        id_lieu_domicile: "",
        connection_type: "", // 0 : numéro passeport, 1 : numéro Id
      },
      villes: [],
      searching: false,
      connectionWithPasseport: false,
      connectionWithId: false,
      searchText: "",
    };
  },
  computed: {
    filteredVille() {
      if (this != null) {
        return this.villes.filter((p) => {
          return (
            p.NomVille.toLowerCase().indexOf(this.searchText.toLowerCase()) !=
            -1
          );
        });
      }
    },
  },
  methods: {
    loginUser() {
      this.citoyen.id_lieu_domicile = this.villeselected.IdVille;
      this.$emit("loginuser", this.citoyen);
    },
    handlePasseportClick() {
      this.connectionWithPasseport = !this.connectionWithPasseport;
      this.citoyen.connection_type = 0;
      if (this.connectionWithId) {
        this.connectionWithId = false;
      }
    },
    handleIdClick() {
      this.connectionWithId = !this.connectionWithId;
      this.citoyen.connection_type = 1;
      if (this.connectionWithPasseport) {
        this.connectionWithPasseport = false;
      }
    },
    handleClick() {
      this.searching = true;
    },
    selectVille(ville) {
      this.searchText = ville.NomVille;
      this.citoyen.lieu_naissance = ville.NomVille;
      console.log(this.lieu_naissance);
    },
    async fetchVille() {
      this.villes = null;
      try {
        const res = await axios.get("/api/getVilles");
        this.villes = res.data;
        this.loading = false;
      } catch (er) {
        this.error = er;
      }
    },
  },
  created() {
    if (!this.villeselected) {
      router.push("/");
    }
    console.log(this.villeselected);
    this.fetchVille();
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 40px;
}

#btn-grp {
  margin-top: 600px;
  font-size: 17px;
}

#input-grp {
  margin-top: 50px;
}

.btn-default {
  text-align: center;
  background: rgb(151, 149, 149);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  font-size: 15px;
  padding: 12px 36px;
}

.form-control {
  background: rgb(255, 254, 254);
  border: 1px solid rgb(0, 0, 0);
  border-radius: 2px;
  font-size: 17px;
  position: relative;
  margin-top: 20px;
}
.body .form-control::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.342);
}

tr:hover {
  cursor: pointer;
  font-weight: bold;
}

table {
  margin: auto;
  padding-top: 15px;
}
</style>
