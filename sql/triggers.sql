DROP TRIGGER IF EXISTS updated_buildstate_trigger on buildstate;
DROP FUNCTION IF EXISTS notify_buildstate();

CREATE FUNCTION notify_buildstate() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM pg_notify('buildstate'::TEXT, NEW.app::TEXT || '|' || NEW.state::TEXT);
    RETURN NULL;
END;
$$;

CREATE TRIGGER updated_buildstate_trigger AFTER INSERT ON buildstate
FOR EACH ROW EXECUTE PROCEDURE notify_buildstate();


DROP TRIGGER IF EXISTS updated_testresult_trigger on testresult;
DROP FUNCTION IF EXISTS notify_testresult();

CREATE FUNCTION notify_testresult() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM pg_notify('testresult'::TEXT, NEW.app::TEXT || '|' || NEW.result::TEXT);
    RETURN NULL;
END;
$$;

CREATE TRIGGER updated_testresult_trigger AFTER INSERT ON testresult
FOR EACH ROW EXECUTE PROCEDURE notify_testresult();
