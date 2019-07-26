'use strict';
import loggin from '../../../logger';
const amqp = require('amqplib/callback_api');
const config = require('config');

const rabbitmqSettings = {
  protocol: config.rabbit.PROTOCOL,
  hostname: config.rabbit.HOST_NAME,
  port: config.rabbit.PORT,
  username: process.env.RABBIT_QUEUE_USERNAME,
  password: process.env.RABBIT_QUEUE_PASSWORD,
  vhost: process.env.VHOST,
  authMechanism: config.rabbit.AUTH_MECHANISM,
};

const ERROR_CONNECT: object = {
  code: 404,
  status: 'Was not possible to connect with the broker.',
  message: 'The password and user are set up incorrectly. Please check.',
};

const createConnection = (settings: object) =>
  new Promise((resolve: any, reject: any) => {
    amqp.connect(settings, (error: any, conn: any) => {
      resolve(conn);
      if (error) reject(error);
    });
    setTimeout(() => reject(ERROR_CONNECT), 4000);
  });

const createChannel = (conn: any, queue_name: string) =>
  new Promise((resolve: any, reject: any) => {
    conn.createChannel((error: any, ch: any) => {
      ch.assertQueue(queue_name, {
        durable: true,
      });
      resolve(ch);
      if (error) reject(error);
    });
  });

export const send = async (data: any) => {
  try {
    const connection = await createConnection(rabbitmqSettings);
    const channel: any = await createChannel(connection, config.rabbit.QUEUE_NAME);
    channel.publish(
      config.rabbit.EXCHANGE,
      config.rabbit.ROUTING_KEY,
      Buffer.from(JSON.stringify(data.payload)),
      data,
    );
    loggin.info(`Message sent it ${data.headers.JMSMessageID}`);
    return { data: data };
  } catch (error) {
    loggin.error(error);
    return { data, error: error };
  }
};
