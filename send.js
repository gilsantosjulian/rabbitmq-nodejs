var amqp = require('amqplib/callback_api');

// const uri = 'amqp://M!nk@2019#:Qq4FaMjW@localhost';
const CONN_URL = 'amqp://M!nk@2019#:Qq4FaMjW@localhost';
const queueName = 'julian-queue';

var raabitmqSettings = {
  protocol: 'amqp',
  hostname: '10.142.2.2',
  port: 15672,
  username: 'M!nk@2019#',
  password: 'Qq4FaMjW',
  vhost: '/',
  authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
}

amqp.connect(raabitmqSettings, (error, connection) => {
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