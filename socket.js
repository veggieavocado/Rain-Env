var io = require('socket.io').listen(7777);
var pg = require ('pg');

const connectionString = 'postgresql://rain:makeitrain2018@db:5432/rain';
const client = new pg.Client(connectionString);
client.connect();

// 데이터베이스 채널을 듣기 시작한다
const testresultQuery = client.query('LISTEN "testresult"');
const buildStateQuery = client.query('LISTEN "buildstate"');

io.sockets.on('connection', (socket) => {
  console.log('소켓 서버 연결 성공');
  socket.emit('connected', { connected: true });

  socket.on('ready for data', (data) => {
    console.log('Rain 서버 데이터 받을 준비완료');
    client.on('notification', (notification) => {
      const returnData = notification.payload;
      console.log('업데이트된 데이터 클라이언트에게 전송: ' + returnData);
      socket.emit('update', { message: returnData });
    });
  });
});
