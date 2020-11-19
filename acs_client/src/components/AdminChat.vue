<template>
  <div id="admin-container" class="container">
    <div class="row">
      <div class="mrgnbtm">
        <h2>Admin in action</h2>
        <div class="user-info">
          <div>User ID: {{ userId }}</div>
          <div>User Name: {{ userName }}</div>
          <div>ThreadId: {{ threadId }}</div>
        </div>
        <div id="message-canvas" v-html="messagesToShow"></div>
        <div>
          <input
            id="message-input"
            type="text"
            placeholder="Enter you chat message here"
            autocomplete="off"
            v-on:keyup.enter="sendMessage()"
            v-model="messageToSend"
          />
          <button
            id="message-submit"
            type="button"
            @click="sendMessage()"
            class="btn btn-danger"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "adminChat",
  props: ["userId", "userName", "messages", "threadId"],
  data() {
    return {
      name: "admin",
      adminId: "",
      polling: null,
      messageToSend: "",
      pollingMessages: null,
      messagesToShow: "",
    };
  },
  watch: {
    messages: function (newVal) {
      if (newVal) {
        this.messagesToShow = newVal;
      }
    },
  },
  methods: {
    sendMessage() {
      let data = { message: this.messageToSend, name: "admin" };
      this.messageToSend = "";
      this.$emit("sendMessage", data);
      this.receiveMessages();
    },
    receiveMessages() {
      this.$emit("receiveMessages");
    },
    pollMessages() {
      this.pollingMessages = setInterval(() => {
        this.receiveMessages();
      }, 3000);
    },
  },
  beforeDestroy() {
    clearInterval(this.pollingMessages);
  },
  created() {
    this.pollMessages();
  },
};
</script>
<style scoped>
</style>
