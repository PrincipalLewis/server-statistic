/**
 * @namespace
 */
mysr = {};


/**
 * @namespace
 */
mysr.db = {};


/**
 * @namespace
 */
mysr.api = {};


/**
 * @namespace
 */
mysr.date = '';


/**
 *
 */
mysr.pgConnection = function() {
  pg.init(20, {
    'user': 'postgres',
    'dbname': 'postgres',
    'hostaddr': '127.0.0.1',
    'port': '5432'
  });
};


/**
 * точка входа
 */
mysr.init = function() {

  process.addListener('uncaughtException', function(error) {
    console.error('Uncaught Exception', error);
  });
  mysr.pgConnection();
  mysr.startServer(mysr.router);
};


/**
 * @param {string} path
 * @param {object} payload
 * @param {mysr.Response} response
 */
mysr.router = function(path, payload, response) {
  console.log(path);
  switch (path) {
    case '/fileName':
      mysr.api.topCommitFileName(response);
      break;
    case '/commitCount':
      mysr.api.projectsCommitCount(response);
      break;
    case '/teamProjects':
      mysr.api.teamsProjects(response);
      break;
    case '/topCommiter':
      mysr.api.topCommiter(response);
      break;
    case '/topCommiterTeam':
      mysr.api.topCommiterTeam(response);
      break;
    case '/cross':
      //mysr.db.projectsTeamsCount(response);
      mysr.api.crossProject(response);
      break;
    case '/%':
      mysr.api.projectsTeamsCommits(response);
      break;
    case '/sendDate':
      var date = payload.split('%');
      mysr.db.date = mysr.db.sendDate(date[0], date[1]);
      console.log(mysr.db.date);
      response.ok(mysr.db.date);
      break;
    default: response.error(404, 'Page not found');
  }
};


/**
 * Server
 * @param {mysr.router} requestHandler
 */
mysr.startServer = function(requestHandler) {
  var server = new http.Server();
  server.addListener('request', function(req, res) {
    var data = '';
    var response = new mysr.Response(res);

    req.on('data', function(chunk) {
      data += chunk;

    });

    req.on('end', function() {
      var path = url.parse(req.url);
      requestHandler(path.pathname, data, response);
    });
  });

  server.listen(1337, '127.0.0.1');
};

