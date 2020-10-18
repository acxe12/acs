import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
const endpointUrl = process.env['COMMUNICATION_SERVICES_ENDPOINT_URL'];

export const listMembers = async (token, threadId, name) => {
    let chatClient = new ChatClient(endpointUrl, new AzureCommunicationUserCredential(token));
    let chatThreadClient = await chatClient.getChatThreadClient(threadId);
    console.log(`Chat Thread client for threadId:${chatThreadClient.threadId}`);
    let members = [];
    let pagedAsyncIterableIterator = await chatThreadClient.listMembers();
    let next = await pagedAsyncIterableIterator.next();
    while (!next.done) {
        members.push(next.value);
        let user = next.value;
        console.log(`User :${user.displayName}`);
        next = await pagedAsyncIterableIterator.next();
    }
    console.log(members);
    return members;
}