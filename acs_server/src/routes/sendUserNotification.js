const { ServiceBusClient } = require('@azure/service-bus');
const sbConnectionString = process.env['SERVICE_BUS_CONNECTION_STRING'];
//const queueName = "users";

export const sendUserNotification = async (queueName, payload) => {
    const sbClient = new ServiceBusClient(sbConnectionString);
    const sender = sbClient.createSender(queueName);
    try {
        const message = {
            body: JSON.stringify(payload),
            sessionId: payload.userId || ""
        }
        await sender.sendMessages(message);
        await sender.close();
    } finally {
        console.log("Notification Sent ");
        let response = {
            "Message": "Delivered"
        }
        return response
        sbClient.close();
    }
}