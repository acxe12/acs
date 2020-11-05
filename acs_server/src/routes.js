import { Router } from 'express';
import { provideToken } from './routes/provideToken.js';
import { createChatThread } from './routes/createChatThread.js';
import { sendMessage } from './routes/sendMessage.js';
import { getMessages } from './routes/getMessages.js';
import { addMember } from './routes/addMember.js';
import { listMembers } from './routes/listMembers.js';
import { receiveNotification } from './routes/receiveNotification.js';
import { sendNotification } from './routes/sendNotification.js';
import { receiveUserNotification } from './routes/receiveUserNotification.js';
import { sendUserNotification } from './routes/sendUserNotification.js';
const routes = Router();

routes.get('/api', (req, res) => {
    res.status(200).json();
});

// Route to retrieve userID and Token
routes.get('/api/token', async (req, res, next) => {
    const name = req.query.name;
    const { userId, token } = await provideToken(name);
    let response = { "userId": userId, "token": token, "name": name };
    res.status(200).json(response);
});

// Route to create a chat Thread
routes.post('/api/thread', async (req, res, next) => {
    let userId = req.body.userId;
    let token = req.body.token;
    let topic = req.body.topic;
    let name = req.body.name;
    console.log(JSON.stringify(req.body));
    const threadId = await createChatThread(userId, token, topic, name);
    let response = { "threadId": threadId };
    res.status(200).json(response);
});

routes.post('/api/message', async (req, res, next) => {
    let token = req.body.token;
    let threadId = req.body.threadId;
    let name = req.body.name;
    let message = req.body.message;
    const messageId = await sendMessage(token, threadId, name, message);
    console.log(messageId);
    let response = { "messageId": messageId };
    res.status(200).json(response);
});
// TODO: REFACTOR!
routes.post('/api/messages', async (req, res, next) => {
    let token = req.body.token;
    let threadId = req.body.threadId;
    const messages = await getMessages(token, threadId);
    console.log(messages);
    res.status(200).json(messages);
});

routes.post('/api/member', async (req, res, next) => {
    let token = req.body.token;
    let threadId = req.body.threadId;
    let userId = req.body.userId;
    let name = req.body.name;
    const response = await addMember(token, threadId, name, userId);
    console.log(response);
    res.status(200).json(response);
});

routes.post('/api/members', async (req, res, next) => {
    let token = req.body.token;
    let threadId = req.body.threadId;
    const members = await listMembers(token, threadId);
    console.log(members);
    res.status(200).json(members);
});

routes.get('/api/notifications', async (req, res, next) => {
    let queueName = req.query.queueName;
    let userId = req.query.userId || "admin";
    const notification = await receiveNotification(queueName, userId);
    console.log(notification);
    res.status(200).json(notification);
});
routes.post('/api/notification', async (req, res, next) => {
    let queueName = req.body.queueName;
    let data = {
        threadId: req.body.threadId,
        userId: req.body.userId
    }
    let sessionId = req.body.userId;
    const notification = await sendNotification(queueName, sessionId, data);
    console.log(notification);
    res.status(200).json(notification);
});
// routes.post('/api/usernotification', async (req, res, next) => {

//     let queueName = req.body.queueName;
//     let data = {
//         threadId: req.body.threadId,
//         userId: req.body.userId
//     }
//     const notification = await sendNotification(queueName, data);
//     console.log(notification);
//     res.status(200).json(notification);
// });
// routes.get('/api/usernotifications', async (req, res, next) => {
//     let queueName = req.query.queueName;
//     let userId = req.query.userId;
//     const notification = await receiveNotification(queueName, userId);
//     console.log(notification);
//     res.status(200).json(notification);
// });

export default routes;