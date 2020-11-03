import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
const endpointUrl = process.env['COMMUNICATION_SERVICES_ENDPOINT_URL'];

export const sendMessage = async (token, threadId, name, message) => {
    let chatClient = new ChatClient(endpointUrl, new AzureCommunicationUserCredential(token));
    let chatThreadClient = await chatClient.getChatThreadClient(threadId);
    console.log(`Chat Thread client for threadId:${chatThreadClient.threadId}`);

    let sendMessageRequest =
    {
        content: message
    };
    let sendMessageOptions =
    {
        priority: 'Normal',
        senderDisplayName: name
    };
    let sendChatMessageResult = await chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
    let messageId = sendChatMessageResult.id;
    console.log(`Message sent!, message id:${messageId}`);
    let response = { "messageId": messageId };
    return response;
}