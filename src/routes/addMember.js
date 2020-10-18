import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
const endpointUrl = process.env['COMMUNICATION_SERVICES_ENDPOINT_URL'];

export const addMember = async (token, threadId, name, userId) => {
    let chatClient = new ChatClient(endpointUrl, new AzureCommunicationUserCredential(token));
    let chatThreadClient = await chatClient.getChatThreadClient(threadId);
    console.log(`Chat Thread client for threadId:${chatThreadClient.threadId}`);
    let addMembersRequest =
    {
        members: [
            {
                user: { communicationUserId: userId },
                displayName: name
            }
        ]
    };

    const response = await chatThreadClient.addMembers(addMembersRequest);
    return response;
}