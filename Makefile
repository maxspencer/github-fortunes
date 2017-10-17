github-fortunes-lambda.zip: index.js node_modules
	zip -rq9 $@ $^

node_modules: package.json
	npm install

clean:
	rm github-fortunes-lambda.zip

deploy: github-fortunes-lambda.zip
	aws --profile Max lambda update-function-code --function-name githubFortunes --zip-file fileb://$<
