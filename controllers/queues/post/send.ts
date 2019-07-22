'use strict';
import loggin from '../../../logger';
const amqp = require('amqplib/callback_api');
const config = require('config');

const rabbitmqSettings = {
  protocol: config.rabbit.PROTOCOL,
  hostname: config.rabbit.HOST_NAME,
  port: config.rabbit.PORT,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  vhost: process.env.VHOST,
  authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL'],
};

export const send = async (query: any): Promise<any> => {
  try {
    loggin.info('ANTES DEL CONNECT');
    amqp.connect(rabbitmqSettings, (error: any, connection: any) => {
      if (error) {
        throw error;
      }
      loggin.info('CONEXION ESTABLECIDA');
      connection.createChannel((error: any, channel: any) => {
        if (error) {
          loggin.error(error);
          throw error;
        }
        loggin.info('CHANNEL CREADO');
        channel.assertQueue(config.rabbit.QUEUE_NAME, {
          durable: true,
        });
        let payload = {
          key1: 'Julian',
          key2: 'Julian',
        };
        let headers = {
          JMSMessageID: 1324,
          JMSPriority: 'Normal',
          JMSTimeStamp: 231231,
          JMSCorrelationID: 1264,
        };
        let data = {
          expiration: 12653412,
          delivery_mode: 2,
          headers: headers,
        };
        channel.publish(
          config.rabbit.EXCHANGE,
          config.rabbit.ROUTING_KEY,
          Buffer.from(JSON.stringify(payload)),
          data,
        );
        console.log(' [x] Sent %s', payload);
      });
      loggin.info('DESPUES DEL CONNECT');
      return 'ok';
    });
  } catch (error) {
    loggin.error(error);
    return error;
  }
};
