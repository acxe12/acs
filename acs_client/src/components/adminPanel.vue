<template>
  <div id="admin-container" class="container">
    <div class="row">
      <div class="col-md-7 mrgnbtm">
        <h2>I am admin</h2>
        <div v-show="enabled">Waiting for user</div>
        <div v-show="enabled">
          <img src="../assets/loading.gif" />
        </div>
        <div class="user-info" v-show="!enabled">
          {{ userId }}, {{ userName }}
        </div>
        <form>
          <button
            type="button"
            @click="createAdmin()"
            class="btn btn-danger"
            v-show="!enabled"
          >
            Ready to help
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "adminPanel",
  props: ["userId", "userName"],
  data() {
    return {
      name: "admin",
      adminId: "",
      threadId: "",
      pollingNotification: null,
      pollingMessages: null,
      enabled: true,
    };
  },
  watch: {
    userId: function (newVal) {
      if (newVal) {
        this.enabled = false;
      }
    },
  },
  methods: {
    createAdmin() {
      this.$emit("createAdmin");
    },
    polllNotification() {
      this.pollingNotification = setInterval(() => {
        if (this.userName == "" || typeof this.userName == "undefined") {
          this.$emit("checkNotification", { queueName: "users" });
        } else {
          clearInterval(this.pollingNotification);
        }
      }, 15000);
    },
  },
  beforeDestroy() {
    clearInterval(this.polllingNotification);
  },
  created() {
    this.polllNotification();
  },
  beforeMount() {
    this.$emit("checkNotification", { queueName: "users" });
  },
};
</script>