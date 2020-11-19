const { ServiceBusClient } = require('@azure/service-bus');
const sbConnectionString = process.env['SERVICE_BUS_CONNECTION_STRING'];

export const receiveNotification = async (queueName, userId) => {
    let message = {};
    const sbClient = new ServiceBusClient(sbConnectionString);
    const receiver = await sbClient.acceptSession(queueName, userId);
    try {
        const messages = await receiver.receiveMessages(5, {
            maxWaitTimeInMs: 3000
        });
        if (!messages.length) {
            // console.log("No more messages to receive");
            return {};
        }
        message = JSON.parse(messages[0].body);
        await messages[0].complete();
        await receiver.close();
    } finally {
        sbClient.close();
    }
    return message;
}