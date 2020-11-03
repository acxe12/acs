<template>
  <div class="container">
    <div class="row">
      <div class="mrgnbtm">
        <h2>Admin in action</h2>
        <div>User ID: {{ userId }}</div>
        <div>User Name: {{ userName }}</div>
        <div>ThreadId: {{ threadId }}</div>

        <div>
          <textarea
            id="message-area"
            placeholder="chat messages will be here"
            v-model="messagesToShow"
            cols="100"
            rows="20"
            readonly
          />
        </div>
        <div>
          <input
            id="message-input"
            type="text"
            placeholder="Enter you chat message here"
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
#message-area {
  outline: none;
  resize: none;
  overflow: auto;
}
#message-input {
  width: 20rem;
  margin: 1rem;
}
#message-submit {
  width: 5rem;
  height: auto;
  border: 1px solid black;
  border-radius: 4px;
  transition-duration: 1s;
}
#message-submit:hover {
  background-color: #4caf60;
  color: white;
}
</style>