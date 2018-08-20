// 데이터베이스에 테이블 생성
const initTable = async (client) => {
  // DB 설정 부분
  const testresultQuery = client.query(
      'CREATE TABLE testresult(date VARCHAR(40) not null, app VARCHAR(20) not null, result VARCHAR(10) not null);'
  ).then(() => { console.log('testresult 테이블 생성 완료'); })
   .catch((error) => { console.log('testresult 테이블이 이미 생성되어 있습니다'); });

  const buildstateQuery = client.query(
      'CREATE TABLE buildresult(date VARCHAR(40) not null, app VARCHAR(20) not null, result VARCHAR(10) not null);'
  ).then(() => { console.log('buildresult 테이블 생성 완료'); })
   .catch((error) => { console.log('buildresult 테이블이 이미 생성되어 있습니다'); });
};

const initTrigger = async (client) => {
  const triggerQuery = client.query(
    `
    DROP TRIGGER IF EXISTS updated_testresult_trigger on testresult;
    DROP FUNCTION IF EXISTS notify_testresult();

    CREATE FUNCTION notify_testresult() RETURNS trigger
        LANGUAGE plpgsql
        AS $$
    BEGIN
        PERFORM pg_notify('testresult'::TEXT, 'testresult' || '|' || NEW.app::TEXT || '|' || NEW.result::TEXT);
        RETURN NULL;
    END;
    $$;

    CREATE TRIGGER updated_testresult_trigger AFTER INSERT ON testresult
    FOR EACH ROW EXECUTE PROCEDURE notify_testresult();


    DROP TRIGGER IF EXISTS updated_buildresult_trigger on buildresult;
    DROP FUNCTION IF EXISTS notify_buildresult();

    CREATE FUNCTION notify_buildresult() RETURNS trigger
        LANGUAGE plpgsql
        AS $$
    BEGIN
        PERFORM pg_notify('buildresult'::TEXT, 'buildresult' || '|' || NEW.app::TEXT || '|' || NEW.result::TEXT);
        RETURN NULL;
    END;
    $$;

    CREATE TRIGGER updated_buildresult_trigger AFTER INSERT ON buildresult
    FOR EACH ROW EXECUTE PROCEDURE notify_buildresult();
    `
  ).then(() => { console.log('트리거가 성공적으로 생성되었습니다'); })
   .catch((error) => { console.log('트리거를 생성하는데 실패했습니다'); });
};

const updateData = async (client, data) => {
  console.log(data);
  console.log(data.type);
  console.log(data.date);
  console.log(data.app);
  console.log(data.result);
  const updateQuery = client.query(
    'INSERT INTO ' + data.type + ' (date, app, result) VALUES ($1, $2, $3);',
    [data.date, data.app, data.result]
  ).then(() => { console.log('데이터 업데이트를 성공적으로 하였습니다'); })
   .catch((error) => { console.log(error); });
};

module.exports = {
  initTable,
  initTrigger,
  updateData,
}
