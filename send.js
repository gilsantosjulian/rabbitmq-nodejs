var amqp = require('amqplib/callback_api');

// const uri = 'amqp://M!nk@2019#:Qq4FaMjW@localhost';
const CONN_URL = 'amqp://M!nk@2019#:Qq4FaMjW@localhost';
const queueName = 'julian-queue';

amqp.connect(CONN_URL, (error, connection) => {
  if (error) {
    console.log(error);
  }
  connection.createChannel((error, channel) => {
    if (error) {
      throw error;
    }
    var msg = 'Hello world Julian';

    channel.assertQueue(queueName, {
      durable: true
    });

    channel.sendToQueue(queueName, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });
});