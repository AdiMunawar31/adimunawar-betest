const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'adimunawar-betest',
  brokers: ['localhost:9092'],
  logLevel: 2,
});

export default kafka;
