# Point72 | FullStack JavaScript Task
## What's included in this repo
This repo contains 2 packages - backend and frontend. Backend is written in `python@3.x` with `Flask`. Frontend is written in `React`. Both applications have their respective `Dockerfiles` for development (production configuration is not included). The project is best run with `make run-dev` from the root directory. This command will fail when run for the first time, due to `PostgreSQL` initialization. Just wait until the db finishes set-up and run it again. This will start the `Flask` development server on port `5000` and the `create-react-app` development server on port `3000` (configurable with `POINT72_API_PORT` and `POINT72_FE_PORT` env variables).


