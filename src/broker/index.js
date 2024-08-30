const broker = require('aedes')();
const server = require('net').createServer(broker.handle);
const { logger } = require('../shared');

const MQTT_Port = 1883;

exports.mqttBroker = () => {
  server.listen(MQTT_Port, () => {
    logger.info({
      action: 'MQTT',
      message: `MQTT server started 🚀 and listening on port, ${MQTT_Port}`,
    });
  });
};

// emitted when a client connects to the broker
broker.on('client', (client) => {
  console.log(
    `CLIENT_CONNECTED : MQTT Client ${
      client ? client.id : client
    } connected to aedes broker ${broker.id}`,
  );
});

// emitted when a client disconnects from the broker
broker.on('clientDisconnect', (client) => {
  console.log(
    `CLIENT_DISCONNECTED : MQTT Client ${
      client ? client.id : client
    } disconnected from the aedes broker ${broker.id}`,
  );
});

// emitted when a client subscribes to a message topic
broker.on('subscribe', (subscriptions, client) => {
  console.log(
    `TOPIC_SUBSCRIBED : MQTT Client ${
      client ? client.id : client
    } subscribed to topic: ${subscriptions
      .map((s) => s.topic)
      .join(',')} on aedes broker ${broker.id}`,
  );
});

// emitted when a client unsubscribes from a message topic
broker.on('unsubscribe', (subscriptions, client) => {
  console.log(
    `TOPIC_UNSUBSCRIBED : MQTT Client ${
      client ? client.id : client
    } unsubscribed to topic: ${subscriptions.join(',')} from aedes broker ${
      broker.id
    }`,
  );
});

// emitted when a client publishes a message packet on the topic
broker.on('publish', async (packet, client) => {
  if (client) {
    console.log(
      `MESSAGE_PUBLISHED : MQTT Client ${
        client ? client.id : `AEDES BROKER_${broker.id}`
      } has published message "${packet.payload}" on ${
        packet.topic
      } to aedes broker ${broker.id}`,
    );

    if (packet.topic === 'insertData') {
      console.log('>>>>>');
    }
  }
});
