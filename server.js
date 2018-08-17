const express = require('express');
const amqp = require('amqplib/callback_api');
const pg = require('pg');
const axios = require('axios');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connectionString = 'postgresql://rain:makeitrain2018@db:5432/rain';
const client = new pg.Client(connectionString);
client.connect();

// 데이터베이스에 테이블 생성
const initTable = async () => {
  // DB 설정 부분
  const testresultQuery = client.query(
      'CREATE TABLE testresult(date VARCHAR(40) not null, app VARCHAR(40) not null, result VARCHAR(40) not null);'
  ).then(() => { console.log('testresult 테이블 생성 완료'); })
   .catch((error) => { console.log('testresult 테이블이 이미 생성되어 있습니다'); });

  const buildstateQuery = client.query(
      'CREATE TABLE buildstate(date VARCHAR(40) not null, app VARCHAR(40) not null, state VARCHAR(40) not null);'
  ).then(() => { console.log('buildstate 테이블 생성 완료'); })
   .catch((error) => { console.log('buildstate 테이블이 이미 생성되어 있습니다'); });
};

const sendToQueue = (msg) => {
  console.log(msg);
  amqp.connect('amqp://admin:admin123@rabbit:5672//', (err, conn) => {
    conn.createChannel((err, ch) => {
      const q = 'build';
      ch.assertQueue(q, { durable: true });
      ch.sendToQueue(q, new Buffer(JSON.stringify(msg)), { persistent: true });
      console.log("[x] 빌드 요청 전송")
    })
  })
};

app.listen(8080, async () => {
  await initTable();
  console.log('Rain server started on port 8080');
});

const stopServer = () => {
  server.close();
};

app.get('/', (req, res) => {
  res.status(200);
  res.send({ status: 'DONE' });
});

app.post('/build', (req, res) => {
  sendToQueue(req.body);
  res.status(200);
  res.send({ status: 'BUILD REQUEST SENT' });
});
