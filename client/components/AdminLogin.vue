<template>
  <div class="body">
    <h1>Portail</h1>
    <h1>Administrateur</h1>
    <form>
      <div id="input-grp">
        <input
          type="email"
          v-model="user.email"
          placeholder="Email"
          required
          class="form-control"
        />
        <input
          type="password"
          v-model="user.password"
          placeholder="Mot de passe"
          required
          class="form-control"
        />
      </div>

      <div id="btn-grp">
        <button @click="login()" class="btn-default">Connexion</button>
      </div>
    </form>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      this.$emit("loginadmin", this.user);
    },
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

form {
  text-align: center;
}

#btn-grp {
  margin-top: 60px;
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

.body .form-control {
  background: rgb(190, 189, 189);
  border: 0;
  font-size: 18px;
}
.body .form-control::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.342);
}
</style>
