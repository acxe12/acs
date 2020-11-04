const { ServiceBusClient } = require('@azure/service-bus');
const sbConnectionString = process.env['SERVICE_BUS_CONNECTION_STRING'];
//const queueName = "users";

export const sendNotification = async (queueName, sessionId, payload) => {
    const sbClient = new ServiceBusClient(sbConnectionString);
    const sender = sbClient.createSender(queueName);
    try {
        const message = {
            body: JSON.stringify(payload),
            sessionId: sessionId,
        }
        await sender.sendMessages(message);
        await sender.close();
    } finally {
        console.log("Notification Sent " + JSON.stringify(payload));
        let response = {
            "Message": "Delivered"
        }
        return response
        sbClient.close();
    }
}