import { Router } from 'express';
import { provideToken } from './routes/provideToken.js';
import { createChatThread } from './routes/createChatThread.js';
import { sendMessage } from './routes/sendMessage.js';
import { getMessages } from './routes/getMessages.js';
import { addMember } from './routes/addMember.js';
import { listMembers } from './routes/listMembers.js';
const routes = Router();

routes.get('/', (req, res) => {
    res.status(200).json();
});

// Route to retrieve userID and Token
routes.get('/token', async (req, res, next) => {
    const { userId, token } = await provideToken();
    let response = { "userId": userId, "token": token };
    res.status(200).json(response);
});

// Route to create a chat Thread
routes.post('/thread', async (req, res, next) => {
    let userId = req.body.userId;
    let token = req.body.token;
    let topic = req.body.topic;
    let name = req.body.name;
    const threadId = await createChatThread(userId, token, topic, name);
    console.log(threadId);
    let response = { "threadId": threadId };
    res.status(200).json(response);
});

routes.post('/message', async (req, res, next) => {
    let token = req.body.token;
    let threadId = req.body.threadId;
    let name = req.body.name;
    let message = req.body.message;
    const messageId = await sendMessage(token, threadId, name, message);
    console.log(messageId);
    let response = { "messageId": messageId };
    res.status(200).json(response);
});

routes.post('/messages', async (req, res, next) => {
    let token = req.body.token;
    let threadId = req.body.threadId;
    const messages = await getMessages(token, threadId);
    console.log(messages);
    res.status(200).json(messages);
});

routes.post('/member', async (req, res, next) => {
    let token = req.body.token;
    let threadId = req.body.threadId;
    let userId = req.body.userId;
    let name = req.body.name;
    const response = await addMember(token, threadId, name, userId);
    console.log(response);
    res.status(200).json(response);
});

routes.post('/members', async (req, res, next) => {
    let token = req.body.token;
    let threadId = req.body.threadId;
    const members = await listMembers(token, threadId);
    console.log(members);
    res.status(200).json(members);
});

export default routes;