const amqp = require('amqplib/callback_api');

amqp.connect('amqp://admin:admin123@rabbit:5672//', (err, conn) => {
  conn.createChannel((err, ch) => {
    const q = 'build';

    ch.assertQueue(q, { durable: true });
    console.log("[*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, async (msg) => {
      console.log("[x] 빌드 요청 받음");
      const receivedMSG = JSON.parse(msg.content.toString());
      console.log(receivedMSG);

      const resultData = receivedMSG.message;
      const resultDataList = resultData.split('|');

      const modelName = resultDataList[0];
      const serverName = resultDataList[1];
      const result = resultDataList[2];

      console.log(modelName);
      console.log(serverName);
      console.log(result);
    }, { noAck: false });
  });
});
