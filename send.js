var amqp = require('amqplib/callback_api');

const queueName = 'julian-queue';
const exchange = 'julian-exchange';
const routingKey = 'julian-routing-key';
const timestamp = new Date().getTime;

const rabbitmqSettings = {
  protocol: 'amqp',
  hostname: '10.142.2.2',
  port: 5672,
  username: 'M!nk@2019#',
  password: 'Qq4FaMjW',
  vhost: '/',
  authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL'],
  expiration: timestamp,
  headers: {
    'JMS-Message-Priority': 'Normal',
    'JMS-Message-Time-Stamp': timestamp,
    'JMS-Message-Type': 'Test Message',
    'JMS-Message-ID': 1324,
  },
  'delivery_mode': 2,
};

amqp.connect(rabbitmqSettings, (error, connection) => {
  if (error) {
    throw error;
  }
  connection.createChannel((error, channel) => {
    if (error) {
      throw error;
    }
    let msg = 'Hello world Julian';

    channel.assertQueue(queueName, {
      durable: true
    });

    channel.publish(exchange, routingKey, Buffer.from(msg));

    console.log(" [x] Sent %s", msg);
  });
});