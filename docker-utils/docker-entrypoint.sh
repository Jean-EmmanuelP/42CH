#!/bin/bash
set -e
set -u

function create_user_and_database() {
	local database=$1
	echo "  Creating user and database '$database'"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	    CREATE DATABASE $database;
	    GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
}

function create_schema() {
    local database=$1
	echo "  Creating schema '$database'"
	find /migrations -type f -name "*.sql" | while read sqlfile; do
		echo "    Running $sqlfile on $database with $POSTGRES_USER"
		psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d $database -f $sqlfile
		echo "    Done running $sqlfile on $database $POSTGRES_USER"
	done
	echo "  Schema '$database' created"
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
	echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
	for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
		create_user_and_database $db
		# create_schema $db
	done
	echo "Multiple databases created"
fi
