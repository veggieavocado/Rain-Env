const axios = require('axios');

const getServersURL = 'https://api.vultr.com/v1/server/list';
const listRegionsURL = 'https://api.vultr.com/v1/regions/list';
const listOSURL = 'https://api.vultr.com/v1/os/list';
const listPlanURL = 'https://api.vultr.com/v1/plans/list';
const createServerURL = 'https://api.vultr.com/v1/server/create';
const deleteServerURL = 'https://api.vultr.com/v1/server/destroy';

const headerData = {
  'API-Key': 'NVB3TJSPCNHBCUKS5LML4R6LJ6T7J6OZIEBQ', // 키스톤 API키
};

// 앱 내부에서만 사용하는 함수들 정의
const getServerNames = async () => {
  const res = await axios.get(getServersURL, { headers: headerData })
    .catch((error) => { console.log(error); });

  const serverNames = [];
  for (const serverID in res.data) {
    const serverObj = res.data[serverID];
    console.log(serverObj);
    const serverIP = serverObj['main_ip'];
    const serverLabel = serverObj['label'];
    const defaultPW = serverObj['default_password']
    const serverName = `${serverID}|${serverIP}|${serverLabel}|${defaultPW}`;
    serverNames.push(serverName);
  }

  return serverNames;
};

const listServerRegions = async () => {
  // DCID: 25 --> 도쿄
  // DCID: 40 --> 싱가폴
  const res = await axios.get(listRegionsURL)
    .catch((error) => { console.log(error); });

  return res.data;
};

const listOSTypes = async () => {
  // OSID: 215 --> Ubuntu 16.04 x64
  const res = await axios.get(listOSURL)
    .catch((error) => { console.log(error); });

  return res.data;
};

const listPlanList = async () => {
  // VPSPLANID: 201 --> $5 플랜 (1024 MB RAM,25 GB SSD,1.00 TB BW)
  // VPSPLANID: 202 --> $10 플랜 (2048 MB RAM,40 GB SSD,2.00 TB BW)
  // VPSPLANID: 203 --> $20 플랜 (4096 MB RAM,60 GB SSD,3.00 TB BW)
  // VPSPLANID: 204 --> $40 플랜 (8192 MB RAM,100 GB SSD,4.00 TB BW)
  const res = await axios.get(listPlanURL)
    .catch((error) => { console.log(error); });

  return res.data;
};

// 실제 서버 관리 함수: 서버 생성, 서버 삭제
const createServer = async (myHostName, planPrice) => {
  let planType;

  if (planPrice == 5) {
    planType = 201;
  } else if (planPrice == 10) {
    planType = 202;
  } else if (planPrice == 20) {
    planType = 203;
  } else if (planPrice == 40) {
    planType = 204;
  }

  const newServerInfo = `DCID=25&OSID=215&VPSPLANID=${planType}&hostname=${myHostName}`;

  const res = await axios.post(createServerURL, newServerInfo, { headers: headerData })
    .catch((error) => { console.log(error); });

  return res.data;
}

const deleteServer = async (serverInfo) => {
  const serverNames = await getServerNames();
  let res;
  for (serverName of serverNames) {
    if (serverName.includes(serverInfo)) {
      const serverID = parseInt(serverName.split('|')[0]);
      const delServerInfo = `SUBID=${serverID}`;
      res = await axios.post(deleteServerURL, delServerInfo, { headers: headerData })
        .catch((error) => { console.log(error); });
    }
  }

  return res.data;
}

module.exports = {
  getServerNames,
  listServerRegions,
  listOSTypes,
  listPlanList,
  createServer,
  deleteServer,
}
