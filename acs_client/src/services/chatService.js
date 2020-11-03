//import { request } from "express";

export async function createUser(data) {
    const response = await fetch(`/api/token?name=` + data.firstName, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    console.log("User Created")
    return await response.json();
}
export async function createThread(data) {
    const response = await fetch(`/api/thread`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    console.log("Thread Created")
    return await response.json();
}
export async function addMemberToThread(data) {
    console.log("New Member added")
    const response = await fetch(`/api/member`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}
export async function checkNotificationFromSB(data) {
    let URI = `/api/notifications?queueName=` + data.queueName;
    if (typeof data.userId !== 'undefined') { URI = URI + '&userId=' + data.userId }
    const response = await fetch(URI, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
}
export async function sendNotificationToSB(data) {
    const response = await fetch(`/api/notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}
export async function sendMessage(data) {
    const response = await fetch(`/api/message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

export async function receiveMessages(data) {
    const response = await fetch(`/api/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

export async function createAdmin(data) {
    const chatTopic = "chat with Admin";
    const responseFromUserCreate = await createUser(data);
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

    return await responseFromCreateAdmin
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