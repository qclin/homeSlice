Install and start a PostgreSQL Server

 apt-get install -y postgresql
Install a few dependencies for building the pg gem

apt-get install -y postgresql-contrib
apt-get install -y libpq-dev
apt-get install -y build-essential
Configure a postgres user, history file, and install the pg gem

sudo -i -u postgres
createuser --interactive
<FOLLOW THE PROMPTS, ENTER 'root' FOR THE USERNAME AND SELECT 'YES' FOR SUPERUSER>
createuser <USERNAME> --interactive --pwprompt
<FOLLOW THE PROMPTS, ENTER YOUR CHOICE OF USERNAME AND PASSWORD AND SELECT 'YES' FOR SUPERUSER>
createdb root
createdb <YOUR USERNAME>
logout
touch ~/.psql_history
The username and password you create here will be the ones used by your connection.rb file to connect to the database.
Install the pg gem

gem install pg
Type psql to ensure that everything worked

Gretchen Ziegler [11:31 AM]
SSH into your Digital Ocean box so we can add our database credentials to the bash profile.

Access your bash profile with the following command
nano ~/.bash_profile
Remember the username and password you created when installing and configuring your Postgres database? You will need them now. Once in your bash profile, add the following line
export DB_INFO="<USERNAME>:<PASSWORD>"
This is known as setting an environment variable. It will allow your Ruby code to access this variable.

Update your connection.rb file to the below

require 'active_record'

ActiveRecord::Base.establish_connection('postgresql://' + ENV["DB_INFO"]  + '@127.0.0.1/<DATABASE NAME>')

ActiveRecord::Base.logger = Logger.new(STDOUT)  
Now, when the code is run, Ruby will look in your bash profile and substitute ENV["DB_INFO"] with the information you saved at that variable.

Don't forget to substitute <DATABASE NAME> with whatever you chose to call your database.

That's all, you can push your code up to Github and pull it down to your Digital Ocean box!