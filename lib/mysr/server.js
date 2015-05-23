/**
 * @namespace
 */
mysr = {};


/**
 * @namespace
 */
mysr.db = {};



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
  mysr.pgConnection();
  mysr.startServer(mysr.router);
};


/**
 * @param {function()} response
 */
mysr.headers = function(response) {
  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/plain' });
};


/**
 * @param {string} path
 * @param {object} payload
 * @param {function()} response
 */
mysr.router = function(path, payload, response) {
  console.log(path);
  mysr.headers(response);
  if (path === '/fileName') {
    mysr.db.topCommitFileName(response);
  }
  if (path === '/teamFileName') {
    mysr.db.topTeamCommitFileName(payload, response);
  }
  if (path === '/getHui') {
    response.end('Sam Hui');
  }

  if (path === '/commitCount') {
    mysr.db.projectsCommitCount(response);
  }

  if (path === '/teamProjects') {
    mysr.db.teamsProjects(response);
  }

  if (path === '/topCommiter') {
    mysr.db.topCommiter(response);

  }

  if (path === '/topCommiterTeam') {
    mysr.db.topCommiterTeam(response);
  }
  if (path === '/cross') {
    mysr.db.projectsTeamsCount(response);
  }

  if (path === '/sendDate') {
    var date = payload.split('%');
    mysr.db.date = mysr.db.sendDate(date[0], date[1]);
    console.log(mysr.db.date);
    response.end(mysr.db.date);
  }

};


/**
 * Server
 */
mysr.startServer = function(requestHandler) {
  var server = new http.Server();
  server.addListener('request', function(req, res) {
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;

    });

    req.on('end', function() {
      var path = url.parse(req.url);
      requestHandler(path.pathname, data, res);
    });
  });

  server.listen(1337, '127.0.0.1');
};

