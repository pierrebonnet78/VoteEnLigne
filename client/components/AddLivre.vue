<template>
    <form @submit.prevent="addLivre">
      <h2>Nouveau livre à ajouter</h2>
      <input type="text" v-model="newLivre.titre" placeholder="Titre du livre" required class="input-text">
      <input type="text" v-model="newLivre.auteur" placeholder="Auteur du livre" required class="input-text">
      <input type="number" v-model="newLivre.quantity" placeholder="Quantité" required class="input-text">
      <input type="text" v-model="newLivre.image" placeholder="Lien vers l'image" class="input-text">
      <button type="submit">Ajouter</button>
    </form>
</template>

<script>
module.exports = {
  data () {
    return {
      newLivre: {
        titre: '',
        auteur: '',
        quantity: 0,
        image: '',
      }
    }
  },
  methods: {
    addLivre () {
        this.$emit('add-livre', this.newLivre)
    }
  }
}
</script>

<style scoped>
form{
    background: rgb(190, 189, 189); 
    border: 0; 
    font-size:18px;
}

button{
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.8);
    color: rgba(255,255,255,.8);
    font-size: 15px;
    padding: 12px 36px;
}

.input-text{
    background: #6b038dbe  bottom center; 
    border: 0; 
    color: white; 
    font-size:18px;
}
</style>