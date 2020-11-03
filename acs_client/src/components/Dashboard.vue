<template>
  <div class="container mrgnbtm">
    <div class="row">
      <div class="">
        <CreateUser
          v-if="!isAdmin"
          v-show="!shouldRenderUser"
          @createUser="userCreate($event)"
        />
        <UserChat
          v-if="shouldRenderUser"
          @sendMessage="MessageSend($event)"
          @receiveMessages="MessagesReceive($event)"
          @checkNotification="checkNotificationAdmin($event)"
          v-bind:userName="userName"
          v-bind:userId="userId"
          v-bind:threadId="threadId"
          v-bind:messages="messages"
          @sendMessageUser="MessageSend($event)"
          @receiveMessagesUser="MessagesReceive($event)"
        />
        <AdminPanel
          v-if="isAdmin"
          v-show="!shouldRenderAdmin"
          @checkNotification="checkNotificationAdmin($event)"
          @createAdmin="adminCreate($event)"
          v-bind:userName="userName"
          v-bind:userId="userId"
        />
        <AdminChat
          v-if="shouldRenderAdmin"
          v-bind:userName="userName"
          v-bind:userId="userId"
          v-bind:threadId="threadId"
          v-bind:messages="messages"
          @sendMessage="MessageSend($event)"
          @receiveMessages="MessagesReceive($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CreateUser from "./createUser";
import UserChat from "./userChat";
import AdminPanel from "./adminPanel";
import AdminChat from "./adminChat";
import {
  createUser,
  checkNotificationFromSB,
  //  createThread,
  sendMessage,
  receiveMessages,
  prettifyMessages,
  //  addMemberToThread,
  createAdmin,
} from "../services/chatService";
export default {
  name: "Dashboard",
  components: {
    CreateUser,
    UserChat,
    AdminPanel,
    AdminChat,
  },
  data() {
    return {
      userName: "",
      name: "",
      userId: "",
      token: "",
      threadId: "",
      shouldRenderUser: false,
      shouldRenderAdmin: false,
      messages: "",
    };
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    userCreate(data) {
      this.shouldRenderAdmin = false;
      this.shouldRenderUser = true;
      createUser(data).then((response) => {
        this.userId = response.userId;
        this.token = response.token;
        this.userName = data.firstName;
      });
    },
    adminCreate() {
      this.shouldRenderAdmin = true;
      let data = {
        firstName: "admin",
        userName: this.userName,
        userId: this.userId,
      };
      createAdmin(data).then((response) => {
        console.log("EXECUTED ADMIN: " + JSON.stringify(response));
        this.threadId = response.threadId;
        this.token = response.token;
        this.name = "admin";
      });
    },
    MessageSend(data) {
      data = {
        token: this.token,
        threadId: this.threadId,
        name: data.name,
        message: data.message,
      };
      sendMessage(data).then((result) => {
        console.log(result);
      });
    },
    MessagesReceive() {
      let data = {
        token: this.token,
        threadId: this.threadId,
      };
      receiveMessages(data).then((result) => {
        this.messages = prettifyMessages(result);
        console.log(JSON.stringify(result));
      });
    },
    checkNotificationAdmin(data) {
      checkNotificationFromSB(data).then((response) => {
        console.log("Polled for Notification: " + JSON.stringify(response));
        if (data.queueName == "users" && this.userId == "") {
          this.userId = response.userId;
          this.userName = response.userName;
        }
        if (
          data.queueName == "threadcreated" &&
          typeof response.threadId != "undefined"
        ) {
          this.threadId = response.threadId;
        }
      });
    },
  },
};
</script>
<style>
.container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
