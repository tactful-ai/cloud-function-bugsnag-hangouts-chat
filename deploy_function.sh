set -e
set -x

if [ -e bugsnag_hangouts_function.zip ]; then
    rm bugsnag_hangouts_function.zip
fi

zip -r bugsnag_hangouts_function.zip . -x '*.git*' deploy_function.sh response_example.json

aws lambda update-function-code --function-name bugsnag_hangouts --zip-file fileb://bugsnag_hangouts_function.zip

rm bugsnag_hangouts_function.zip
