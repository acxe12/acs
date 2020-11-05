import axios from 'axios'
export const API_BASE_URL = "api"
//process.env.VUE_APP_API_BASE_URL;

export async function createUser(data) {
    try {

        const res = await axios(API_BASE_URL + "/token?name=" + data.firstName);
        console.log("User created: " + res.data.userId);
        return res.data;
    } catch (error) {
        //   console.log("User Create error");
        return { "User Create Error": error }
    }
}
export async function createThread(data) {
    try {
        const res = await axios.post(API_BASE_URL + "/thread", data);
        console.log("Thread created: " + res.data.threadId);
        return res.data;
    } catch (error) {
        //todo: erro handling
        console.log("Thread Create error");
        return { "Thread Create Error": error }
    }
}
export async function addMemberToThread(data) {
    try {
        const res = await axios.post(API_BASE_URL + "/member", data);
        console.log("Member added");
        return res.data;
    } catch (error) {
        //todo: erro handling
        console.log("Thread Create error");
        return { "Thread Create Error": error }
    }
}
export async function checkNotificationFromSB(data) {
    let URI = `/notifications?queueName=` + data.queueName;
    if (typeof data.userId !== 'undefined') { URI = URI + '&userId=' + data.userId }
    try {
        const res = await axios.get(API_BASE_URL + URI);
        return res.data;
    } catch (error) {
        //todo: erro handling
        console.log("Check Notification Failed");
        return { "Check Notification Failed": error }
    }
}
export async function sendNotificationToSB(data) {
    try {
        const res = await axios.post(API_BASE_URL + "/notification", data);
        console.log("Notification Sent");
        return res.data;
    } catch (error) {
        //todo: erro handling
        console.log("Notification Send error");
        return { "Notification Send Error": error }
    }
}
export async function sendMessage(data) {
    try {
        const res = await axios.post(API_BASE_URL + "/message", data);
        console.log("Message Sent");
        return res.data;
    } catch (error) {
        //todo: erro handling
        console.log("Message Send error");
        return { "Message Send Error": error }
    }
}

export async function receiveMessages(data) {
    try {
        const res = await axios.post(API_BASE_URL + "/messages", data);
        console.log("Messages Received");
        return res.data;
    } catch (error) {
        //todo: erro handling
        console.log("Messages Receive error");
        return { "Message Receive Error": error }
    }
}

export async function createAdmin(data) {
    try {
        const chatTopic = "chat with Admin";
        const responseFromUserCreate = await createUser(data);
        console.log("ADMIN RESPONSE: " + JSON.stringify(responseFromUserCreate));
        let requestForThreadCreate = {
            userId: responseFromUserCreate.userId,
            token: responseFromUserCreate.token,
            name: responseFromUserCreate.name,
            topic: chatTopic,
        };
        const responseFromThreadCreate = await createThread(requestForThreadCreate)
        let requestForAddUser = {
            token: responseFromUserCreate.token,
            threadId: responseFromThreadCreate.threadId,
            name: data.userName,
            userId: data.userId
        }
        const responseFromAddUser = await addMemberToThread(requestForAddUser)
        console.log(responseFromAddUser);
        let requestForSendNotificationToSB = {
            queueName: "threadcreated",
            threadId: responseFromThreadCreate.threadId,
            userId: data.userId
        }
        const responseFromSendNotification = await sendNotificationToSB(requestForSendNotificationToSB)
        let requestForSendMessage = {
            token: responseFromUserCreate.token,
            threadId: responseFromThreadCreate.threadId,
            name: data.firstName,
            message: "hello"
        }
        const responseFromSendMessage = await sendMessage(requestForSendMessage)

        const responseFromCreateAdmin = {
            "name": data.firstName,
            "userId": responseFromUserCreate.userId,
            "token": responseFromUserCreate.token,
            "threadId": responseFromThreadCreate.threadId,
            "messageId": responseFromSendMessage.messageId.messageId,
            "message": "hello",
            "notification": responseFromSendNotification
        }

        return responseFromCreateAdmin
    }
    catch (error) {
        return { "Error: ": error }
    }
}

export function prettifyMessages(ar) {
    let str = '';
    for (let i = 0, len = ar.length; i < len; i++) {
        if (ar[i].type == 'Text') {
            let time = new Date(ar[i].createdOn).toLocaleTimeString();
            str = time + ' ' + ar[i].senderDisplayName + ' said ' + ar[i].content + '\n' + str;
        }

    }
    return str;
}