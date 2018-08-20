// Express 정의
const express = require('express');
const io = require('socket.io-client');

const app = express();

const amqp = require('amqplib/callback_api');
const pg = require('pg');

const { initTable, initTrigger, updateData } = require('./js-tasks');

const axios = require('axios');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 데이터베이스
const connectionString = 'postgresql://rain:makeitrain2018@db:5432/rain';
const client = new pg.Client(connectionString);
client.connect();

// 소켓
const socket = io('http://socket:7777');

const sendToQueue = (msg) => {
  console.log(msg);
  amqp.connect('amqp://admin:admin123@rabbit:5672//', (err, conn) => {
    conn.createChannel((err, ch) => {
      const q = 'build';
      ch.assertQueue(q, { durable: true });
      ch.sendToQueue(q, new Buffer(JSON.stringify(msg)), { persistent: true });
      console.log("[x] 빌드 요청 전송")
    });
  });
};

const server = app.listen(8080, async () => {
  await initTable(client);
  await initTrigger(client);
  console.log('Rain server started on port 8080');
});

const stopServer = () => {
  server.close();
};

socket.on('connected', (data) => {
  console.log('소켓에 연결하였습니다');
  socket.emit('ready for data', {});
});

socket.on('update', (data) => {
  console.log('새로 업데이트된 테스트, 빌드 결과를 받았습니다');
  console.log('워커 빌드 시작...');
  sendToQueue(data);
})

socket.on('disconnect', () => { });

app.get('/', (req, res) => {
  res.status(200);
  res.send({ status: 'DONE' });
});

app.post('/update', async (req, res) => {
  const type = req.body.type;
  const date = req.body.date;
  const app = req.body.app;
  const result = req.body.result;
  const data = {
    type,
    date,
    app,
    result,
  };
  await updateData(client, data);
  res.status(201);
  res.send({ status: 'TEST/BUILD RESULT SAVED' });
});
