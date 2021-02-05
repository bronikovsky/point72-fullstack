MIGRATIONS_DIR="/package-root/src/app/migrations"

all: run-dev
run-dev:
	docker-compose -f ./docker-compose.dev.yml up
build-dev:
	docker-compose -f ./docker-compose.dev.yml up --build
db:
	docker-compose -f docker-compose.dev.yml up -d database
	docker-compose -f docker-compose.dev.yml run \
		-e FLASK_APP=main.py \
		backend \
		bash
