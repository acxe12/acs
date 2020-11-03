
<template>
  <div class="container">
    <div class="row">
      <div class="col-md-7 mrgnbtm">
        <h2>Your Name</h2>
        <form>
          <div class="row">
            <label for="exampleInputFirstName">Name</label>
            <input
              type="text"
              class="form-control"
              v-model="firstName"
              name="firstname"
              id="firstname"
              aria-describedby="emailHelp"
              placeholder="First Name"
            />
          </div>
          <button type="button" @click="createUser()" class="btn btn-danger">
            Create
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CreateUser",
  data() {
    return {
      firstName: "",
      polling: null
    };
  },
  methods: {
    createUser() {
      const payload = {
        firstName: this.firstName,
      };
      this.$emit("createUser", payload);
      this.clearForm();
    },
    clearForm() {
      this.firstName = "";
    },
  },
};
</script>