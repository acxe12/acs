const { CommunicationIdentityClient } = require('@azure/communication-administration');
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
console.log(connectionString);
// Instantiate the user token client
const identityClient = new CommunicationIdentityClient(connectionString);

const provideToken = async () => {
    console.log("Azure Communication Services - User Access Tokens Quickstart")
    let userResponse = await identityClient.createUser();
    console.log(`\nCreated a user with ID: ${userResponse.communicationUserId}`);
    let tokenResponse = await identityClient.issueToken(userResponse, ["chat"]);
    const { token, expiresOn } = tokenResponse;
    console.log(`\nIssued a token with 'chat' scope that expires at ${expiresOn}:`);
    console.log(token);
    return tokenResponse;
    // Quickstart code goes here
};

provideToken().catch((error) => {
    console.log("Encountered and error");
    console.log(error);
})

exports.provideToken = provideToken;