/**
 * @namespace
 */
var mysr = {};


/**
 * @namespace
 */
mysr.db = {};


/**
 * @namespace
 */
mysr.api = {};


/**
 * @type {string}
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
 * @param {string} payload
 * @param {mysr.Response} response
 */
mysr.router = function(path, payload, response) {
  console.log(path);
  switch (path) {
    case '/fileName':
      mysr.api.topCommitFileName(response, payload);
      break;
    case '/commitCount':
      mysr.api.projectsCommitCount(response, payload);
      break;
    case '/teamProjects':
      mysr.api.teamsProjects(response);
      break;
    case '/topCommiter':
      mysr.api.topCommiter(response, payload);
      break;
    case '/topCommiterTeam':
      mysr.api.topCommiterTeam(response, payload);
      break;
    case '/cross':
      mysr.api.crossProject(response, payload);
      break;
    case '/%':
      mysr.api.projectsTeamsCommits(response, payload);
      break;
    default: response.error(404, 'Page not found');
  }
};


/**
 * Server
 * @param {function(string, string, mysr.Response)} requestHandler
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

