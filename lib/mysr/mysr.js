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
 * @param {string} path
 * @param {object} payload
 * @param {mysr.Response} response
 */

miFunction(response){
  var result={}
  function handler(filenames){
    mysr.db.topTeamCommitFileName(filename, function(projects){
      result[filename] = projects;
    }
  })
  response.ok(result)
  }
  mysr.db.topCommitFileName(handler);

}
mysr.router = function(path, payload, response) {
    console.log(path);
    switch(path) {
      case '/fileName':
        mysr.db.topCommitFileName(response);
        break;
      default: response.error()
    }
    if (path === '/fileName') {
        response.ok([{}])

    }
    if (path === '/teamFileName') {
      miFunction(response);

    if (path === '/getHui') {
        response.ok('Sam Hui');
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
    } else {
      response.error();
    }



};


/**
 * Server
 */
mysr.startServer = function(requestHandler) {
    var server = new http.Server();
    server.addListener('request', function(req, res) {
        var data = '';
        var response = new  mysr.Response(res);

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

