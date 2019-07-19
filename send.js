const amqp = require('amqplib/callback_api');

const channel = null;
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
  payload: ''
};

const initConnection = () => {
  let newSettings = {
    ...rabbitmqSettings,
    payload: payload
  }
  return amqp.connect(newSettings, (error, connection) => {
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
    });
  });
}

export const publish = async () => {
  initConnection();
  let payload = {
    key1: 'Julian',
    key2: 'Julian'
  };

  let headers = {
    'JMS-Message-Priority': 'Normal',
    'JMS-Message-Time-Stamp': timestamp,
    'JMS-Message-Type': 'Test Message',
    'JMS-Message-ID': 1324,
  }

  Buffer(JSON.stringify(payload)), {
    expiration: timestamp,
    'delivery_mode': 2,
    headers: headers,
  }

  channel.publish(exchange, routingKey, Buffer.from(data));
  console.log(" [x] Sent %s", data);
}

process.on('exit', (code) => {
  channel.close();
  console.log(`Closing rabbitmq channel`);
});