exports.handler = async (event) => {
  let body = JSON.parse(event.body);
  if (body.account.id === process.env.BUGSNAG_ACCOUNT_ID) {
    const fetch = require('node-fetch');
    const jbuilder = require('jbuilder');
    var bugsnagError = body.error;
    var bugsnagProject = body.project;

    var messageBody = jbuilder.encode(function (json) {
      json.set('cards', function (json) {
        json.child(function (json) {
          json.set('header', function (json) {
            json.set('title', `${bugsnagProject.name}`);
            json.set('subtitle', `${bugsnagError.releaseStage}`);
          });

          json.set('sections', function (json) {
            json.child(function (json) {
              json.set('widgets', function (json) {
                json.child(function (json){
                  json.set('keyValue', function(json) {
                    json.set('topLabel', 'Project Name');
                    json.set('content', `${bugsnagError.exceptionClass} in ${bugsnagError.context} and the error is ${bugsnagError.message}`);
                    json.set('contentMultiline', true);
                  });
                })
                json.child(function (json) {
                  json.set('buttons', function (json) {
                    json.child(function (json) {
                      json.set('textButton', function (json) {
                        json.set('text', 'VIEW ON BUGSNAG');
                        json.set('onClick', function (json) {
                          json.set('openLink', function (json) {
                            json.set('url', bugsnagError.url);
                          });
                        });
                      });
                    });

                    if (typeof bugsnagError.createdIssue != "undefined") {
                      json.child(function (json) {
                        json.set('textButton', function (json) {
                          json.set('text', `VIEW ON ${bugsnagError.createdIssue.type.toUpperCase()}`);
                          json.set('onClick', function (json) {
                            json.set('openLink', function (json) {
                              json.set('url', bugsnagError.createdIssue.url);
                            });
                          });
                        });
                      });
                    }
                  });
                });
              });
            });
          });
        });
      });
    });


    console.log(`Message Body: ${messageBody}`);
    console.log(`Message Body String: ${JSON.stringify(messageBody)}`)

    var options = {
      // url: process.env.GOOGLE_CHAT_URL,
      method: 'POST',
      body: messageBody,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    };

    return fetch(process.env.GOOGLE_CHAT_URL, options)
      .then(res => res.json())
      .then(json => console.log(json));

  } else {
    const response = {
      statusCode: 402,
      body: {"failed": "Not authorized"},
    };
    return response;
  }
};