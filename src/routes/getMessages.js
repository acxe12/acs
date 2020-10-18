import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
const endpointUrl = process.env['COMMUNICATION_SERVICES_ENDPOINT_URL'];

export const getMessages = async (token, threadId) => {
    let chatClient = new ChatClient(endpointUrl, new AzureCommunicationUserCredential(token));
    let chatThreadClient = await chatClient.getChatThreadClient(threadId);
    console.log(`Chat Thread client for threadId:${chatThreadClient.threadId}`);
    let messages = [];
    let pagedAsyncIterableIterator = await chatThreadClient.listMessages();
    let nextMessage = await pagedAsyncIterableIterator.next();
    while (!nextMessage.done) {
        messages.push(nextMessage.value);
        console.log('!!!!!! MESSAGE !!!!!!')
        let chatMessage = nextMessage.value;
        // console.log(`Message :${chatMessage.content}`);
        nextMessage = await pagedAsyncIterableIterator.next();
    }
    return messages;
}