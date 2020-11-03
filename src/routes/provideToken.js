import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { sendNotification } from './sendNotification';
const { CommunicationIdentityClient } = require('@azure/communication-administration');
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
const identityClient = new CommunicationIdentityClient(connectionString);

export const provideToken = async (name) => {
    //  console.log("Azure Communication Services - User Access Tokens Quickstart")
    let userResponse = await identityClient.createUser();
    //  console.log(`\nCreated a user with ID: ${userResponse.communicationUserId}`);
    let tokenResponse = await identityClient.issueToken(userResponse, ["chat"]);
    const { token, expiresOn } = tokenResponse;
    //  console.log(`\nIssued a token with 'chat' scope that expires at ${expiresOn}:`);
    //  console.log(token);
    let response = { "userId": userResponse.communicationUserId, "token": token };
    let queueName = "users";
    if (name != "admin") {
        let data = {
            userName: name,
            userId: userResponse.communicationUserId
        }
        const sessionId = "admin";
        await sendNotification(queueName, sessionId, data);
    }
    return response;
};