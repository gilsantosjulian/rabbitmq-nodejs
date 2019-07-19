const amqp = require('amqplib/callback_api');

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
};

amqp.connect(rabbitmqSettings, (error, connection) => {
  if (error) {
    throw error;
  }
  connection.createChannel((error, channel) => {
    if (error) {
      throw error;
    }

    channel.assertQueue(queueName, {
      durable: true
    });

    let payload = {
      key1: 'Julian',
      key2: 'Julian'
    };

    let headers = {
      JMSMessageID: 1324,
      JMSPriority: 'Normal',
      JMSTimeStamp: 231231,
      JMSCorrelationID: 1264,
    }

    let data = {
      expiration: 12653412,
      delivery_mode: 2,
      headers: headers,
    }

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)), data);
    console.log(" [x] Sent %s", payload);
  });
});

process.on('exit', (code) => {
  channel.close();
  console.log(`Closing rabbitmq channel`);
});

// {
//   expiration: timestamp,
//   'delivery_mode': 2,
//   headers: headers,
// }