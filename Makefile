lint:
	npm run quality

lint-fix:
	npm run lint:fix
	npm run format
	npm run quality