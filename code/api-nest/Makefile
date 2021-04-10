build:
	npm i && npm run build
	make copy

rebuild:
	rm -rf node_modules
	make build

copy:
	cp -R ./src/config/contract ./dist/config

deploy-dev:
	sls deploy --env development
