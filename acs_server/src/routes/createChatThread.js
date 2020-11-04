import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
const endpointUrl = process.env['COMMUNICATION_SERVICES_ENDPOINT_URL'];

export const createChatThread = async (userId, token, topic, name) => {
    let chatClient = new ChatClient(endpointUrl, new AzureCommunicationUserCredential(token));
    let createThreadRequest = {
        topic: topic,
        members: [{
            user: { communicationUserId: userId },
            displayName: name
        }]
    };
    let chatThreadClient = await chatClient.createChatThread(createThreadRequest);
    let threadId = chatThreadClient.threadId;
    //console.log(threadId);
    return threadId;
}