/**
 * @namespace
 */
mysr = {};
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
 * @param {string} path
 * @param {object} payload
 * @param {function()} response
 */
mysr.router = function(path, payload, response) {
  console.log(path);
  if (path === '/fileName') {
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain' });
    mysr.db.getFileName(function(filesname) {
      //for (var j = 0; j < filesname.length; j++) {
      console.log(filesname[0]);
        mysr.db.getTeamFileName(filesname[0], function (teams, projectName) {
          for (var i = 0, name = '',count = ''; i < teams.length; i++) {
            name += teams[i].teamname + ', ';
            count += teams[i].count + ', ';
          }
          response.end('Имя файла: ' + teams[0].filename + '<br>' +
          'Имя команд: ' + name + '<br>' +
          'Count ' + count + '<br>' +
          ' Проект: ' + projectName + '<br>' +
          '');
        });
      //}
    });
  }
  if (path === '/getHui') {
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain' });
    response.end('Sam Hui');
  }

  if (path === '/commitCount') {
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain' });
    mysr.db.getProjectsCommitCount(function(table) {
      response.end('Проект ' + table[0].projectname + ' commits: ' + table[0].commits);
    });
  }

  if (path === '/teamProjects') {
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain' });
    mysr.db.getTeamsProjects(function(table) {
      console.log(table);
      response.end('Проект ' + table[0].projectname + ' commits: ' + table[0].teamname);
    });
  }

  if (path === '/topCommiter') {
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain' });
    mysr.db.getTopCommiter(function(table) {
      console.log(table);
      response.end('User ' + table[0].login + ' count_commits: ' + table[0].count);
    });
  }

  if (path === '/topCommiterTeam') {
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain' });
    mysr.db.getTopCommiterTeam(function(table) {
      console.log(table);
      response.end('User ' + table[3].teamname + ' count_commits: ' + table[3].commits);
    });
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

