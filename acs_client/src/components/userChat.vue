<template>
  <div class="container">
    <div class="row">
      <div id="user-wait" class="mrgnbtm">
        <h2>User in action</h2>
        <div v-show="enabled">Waiting for admin</div>
        <div v-show="enabled">
          <img src="../assets/loading.gif" />
        </div>
        <div v-show="!enabled" class="user-info">
          <div>User ID: {{ userId }}</div>
          <div>User Name: {{ userName }}</div>
          <div>Thread ID: {{ threadId }}</div>

          <div>
            <textarea
              id="message-area"
              placeholder="chat messages will be here"
              v-model="messagesToShow"
              cols="80"
              rows="20"
              readonly
            />
          </div>
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
  </div>
</template>
<script>
export default {
  name: "userChat",
  props: ["userId", "userName", "messages", "threadId"],
  data() {
    return {
      name: "",
      adminId: "",
      pollingUser: null,
      messageToSend: "",
      enabled: true,
      pollingMessages: null,
      messagesToShow: "",
    };
  },
  watch: {
    threadId: function (newVal) {
      if (newVal) {
        this.enabled = false;
      }
    },
    messages: function (newVal) {
      if (newVal) {
        this.messagesToShow = newVal;
      }
    },
  },
  methods: {
    sendMessage() {
      let data = { message: this.messageToSend, name: this.userName };
      console.log(this.userName + " lalalala");
      this.messageToSend = "";
      this.$emit("sendMessage", data);
      this.receiveMessages();
    },
    receiveMessages() {
      this.$emit("receiveMessages");
    },
    polllNotificationForUser() {
      this.pollingUser = setInterval(() => {
        if (this.threadId == "" || typeof this.threadId == "undefined") {
          this.$emit("checkNotification", {
            queueName: "threadcreated",
            userId: this.userId,
          });
        } else {
          clearInterval(this.pollingUser);
        }
      }, 15000);
    },
    pollMessages() {
      this.pollingMessages = setInterval(() => {
        if (!this.enabled) {
          this.receiveMessages();
        }
      }, 3000);
    },
  },
  beforeDestroy() {
    clearInterval(this.pollingUser);
    clearInterval(this.pollingMessages);
  },
  created() {
    this.polllNotificationForUser();
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