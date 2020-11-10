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
import CreateUser from "./CreateUser";
import UserChat from "./UserChat";
import AdminPanel from "./AdminPanel";
import AdminChat from "./AdminChat";
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
        // console.log(JSON.stringify(result));
      });
    },
    checkNotificationAdmin(data) {
      checkNotificationFromSB(data).then((response) => {
        console.log("Polled for Notification: " + JSON.stringify(response));
        if (data.queueName == "users" && response.userId !== "") {
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
  top: 5%;
  left: 20%;
  position: absolute;
  text-align: center;
  color: #2c3e50;
}
#user-container,
#user-wait,
#admin-container {
  width: 40rem;
  font-family: "Montserrat", sans-serif;
  font-size: 2rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  border: 1px solid;
  border-radius: 2rem;
  padding: 10rem;
  background-color: #2c3e50;
  color: white;
}
#firstName {
  background-color: #2c3e50;
  border: 0;
  color: white;
  font-family: "Montserrat", sans-serif;
  font-size: 2rem;
}
.btn-create {
  font-family: "Montserrat", sans-serif;
  font-size: 2rem;
}
.user-info {
  font-size: 0.8rem;
  font-weight: 100;
  margin-bottom: 1;
}
#message-area {
  margin-top: 2rem;
}
#message-canvas {
  width: 40rem;
  height: 20rem;
  overflow-y: auto;
  border: 1px solid white;
  border-radius: 2%;
  font-size: 0.7rem;
  text-align: left;
  display: flex;
  flex-direction: column-reverse;
}
.message-admin {
  color: black;
  background-color: white;
  border: 1px solid white;
  border-radius: 5%;
  clear: both;
  margin: 0.5rem 0.5rem 0.1rem 0.5rem;
  padding: 0.2rem;
}
.message-user {
  color: #336699;
  background-color: burlywood;
  border: 1px solid burlywood;
  border-radius: 5%;
  clear: both;
  margin: 0.5rem 0.2rem 0.1rem 0.5rem;
  padding: 0.2rem;
}
.message-time {
  margin-right: 0.2rem;
}
.message-author {
  clear: right;
  color: darkcyan;
}
.message-text {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-weight: 100;
}
#message-area {
  outline: none;
  resize: none;
  overflow: auto;
  font-family: Verdana, sans-serif;
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
