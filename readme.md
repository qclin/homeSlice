setup database
  > psql -f database/streetView.sql

http://mherman.org/blog/2016/03/13/designing-a-restful-api-with-node-and-postgres/#.WKToKbYrInU


psql >

# CREATE DATABASE <username>
\c username

CREATE TABLE (see database/streetView.sql)

vim ~/.bash_profile
export GOOGLE_MAP_API_KEY="API_KEY"

connecting to EC2 instance

ssh -i portfolioSite2017.pem ec2-user@ec2-34-200-52-167.compute-1.amazonaws.com


create postgres db
```
$ sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs
[Confirm the installation and accept the key]
$ sudo service postgresql initdb
$ sudo -u postgres psql
\password
Enter password: ...
...
```
CREATE TABLE (see database/streetView.sql)

UPDATE secrets.json for database connection string
```
{
  "username":"postgres",
  "password": "password",
  "database": "homeslice"
}
```


after connecting to psql
http://askubuntu.com/questions/256534/how-do-i-find-the-path-to-pg-hba-conf-from-the-shell

type SHOW hba_file; to find path of the hba_file.config and update settings

 > vim /var/lib/pgsql9/data/pg_hba.conf

sudo service postgresql restart
