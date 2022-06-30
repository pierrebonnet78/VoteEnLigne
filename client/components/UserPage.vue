<template>
  <div class="body">
    <h1>Bonjour {{ user.Prenom }}</h1>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      user: {},
    };
  },
  methods: {},
  async created() {
    this.user = JSON.parse(localStorage.getItem("citoyen"));
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
</style>
