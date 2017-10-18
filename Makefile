github-fortunes-lambda.zip: index.js node_modules fortunes.private-key.pem
	zip -rq9 $@ $^

node_modules: package.json
	npm install

clean:
	rm github-fortunes-lambda.zip

deploy: github-fortunes-lambda.zip
	aws --profile Max lambda update-function-code --function-name githubFortunes --zip-file fileb://$<

test: index.js node_modules fortunes.private-key.pem
	lambda-local -l index.js -e open-pr-event.json
