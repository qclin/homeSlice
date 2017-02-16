setup database
  > psql -f database/streetView.sql

http://mherman.org/blog/2016/03/13/designing-a-restful-api-with-node-and-postgres/#.WKToKbYrInU


psql >

# CREATE DATABASE <username>
\c username

CREATE TABLE (see database/streetView.sql)

vim ~/.bash_profile
export GOOGLE_MAP_API_KEY="API_KEY"
