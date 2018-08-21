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
      const deploy = resultDataList[3];

      console.log(modelName);
      console.log(serverName);
      console.log(result);
      console.log(deploy);

      if (result == 'PASS') {
        if (serverName == 'avocado-test-server') {
          // pass
          // 1. 테스트가 통과했다. avocado-test-server가 있는지 없는지 확인한다.
          // 2. 만약 서버 이름이 이미 존재하지 않는다면, 새로운 클라우드 서버를 하나 만든다 (도쿄, 20달러, 우분투 16)
          // 3. 서버가 제대로 올라갔는지 확인한다. (polling을 통해서)
          // 4. 폴링을 통해서 서버가 올라갔다고 확인이 되면, 서버의 기본 root 비밀번호로 그 서버에 접속한다.
          // 5. 새로운 클라우드 인스턴스에 passwd, update, upgrade, 랜처 호스트 등록을 한다.
          // 6. 새로운 서버에서 avocado-test-server 깃허브 리포를 clone한다.
          // 7. 금방 클론한 리포에서 docker-compose up -d --build하여 코드를 배포시킨다.

          // 2. 만약 서버 이름이 이미 존재한다면, 그 서버로 접속한다. (root/makeitpopwe123ARbiter;;)
          // 3. 깃허브 리포가 클론되어 있는 폴더로 들어가 git pull해준다.
          // 4. 깃 풀이 완료되면 docker-compose up -d --build를 실행시켜서 코드를 업데이트시켜준다.
        } else if (serverName == 'avocado-api-server') {
          // pass
        }
      } else {
        console.log('테스트가 실패하였습니다. 자동 배포 중지')
      }
    }, { noAck: false });
  });
});
