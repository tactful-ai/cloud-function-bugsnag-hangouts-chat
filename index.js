exports.handler = async (event) => {
  // TODO implement
  let body = JSON.parse(event.body);
  if (body.account.id === process.env.BUGSNAG_ACCOUNT_ID) {
    console.log("INSIDE IF");
    const fetch = require('node-fetch');
    const jbuilder = require('jbuilder');
    var bugsnagError = body.error;

    console.log(bugsnagError);
    var messageBody = jbuilder.encode(function (json) {
      json.set('cards', function (json) {
        json.child(function (json) {
          json.set('header', function (json) {
            json.set('title', `${bugsnagError.exceptionClass} in ${bugsnagError.context}`);
            json.set('subtitle', bugsnagError.message);
          });

          json.set('sections', function (json) {
            json.child(function (json) {
              json.set('widgets', function (json) {
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

    // messageBody = {
    //   "text": "HI FROM LAMBDA"
    // };

    console.log("AFTER JSON");
    console.log(messageBody);

    var options = {
      // url: process.env.GOOGLE_CHAT_URL,
      method: 'post',
      body: messageBody,
      headers: {
        'Content-Type': 'application/json'
      },
    };

    console.log(options);


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