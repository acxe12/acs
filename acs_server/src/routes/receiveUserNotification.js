const { ServiceBusClient } = require('@azure/service-bus');
const sbConnectionString = process.env['SERVICE_BUS_CONNECTION_STRING'];

const util = require('util');

export const receiveUserNotification = async (queueName, userId) => {
    let message = {};
    const sbClient = new ServiceBusClient(sbConnectionString);
    // const queueClient = sbClient.createQueueClient(queueName);
    //  const receiver = sbClient.createReceiver(queueName);
    const receiver = await sbClient.acceptSession(queueName, userId);
    try {
        const messages = await receiver.receiveMessages(1, {
            maxWaitTimeInMs: 3000
        });
        if (!messages.length) {
            console.log("No more messages to receive");
            return {};
        }
        message = JSON.parse(messages[0].body);
        await messages[0].complete();
        await receiver.close();
        //console.log(util.inspect(messages[0], false, null, true /* enable colors */))
    } finally {
        sbClient.close();
    }
    return message;
}