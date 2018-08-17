FROM ubuntu

RUN apt-get update && apt-get install -my wget gnupg

RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" > /etc/apt/sources.list.d/pgdg.list

RUN apt-get update && apt-get install -y postgresql-9.6 postgresql-client-9.6 postgresql-contrib-9.6

USER postgres

RUN /etc/init.d/postgresql start && \
    psql --command "CREATE DATABASE rain;" && \
    psql --command "CREATE USER rain WITH SUPERUSER PASSWORD 'makeitrain2018';" && \
    psql --command "ALTER ROLE rain SET client_encoding TO 'utf8';" && \
    psql --command "ALTER ROLE rain SET default_transaction_isolation TO 'read committed';" && \
    psql --command "ALTER ROLE rain SET timezone TO 'UTC';" && \
    psql --command "GRANT ALL PRIVILEGES ON DATABASE rain TO rain;"

RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/9.6/main/pg_hba.conf

RUN echo "listen_addresses='*'" >> /etc/postgresql/9.6/main/postgresql.conf

EXPOSE 5432

VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

CMD ["/usr/lib/postgresql/9.6/bin/postgres", "-D", "/var/lib/postgresql/9.6/main", "-c", "config_file=/etc/postgresql/9.6/main/postgresql.conf"]
