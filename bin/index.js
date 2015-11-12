var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    pg = require('node-pg'),
    yaa = require('node-yaa');


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
  console.log('xuy');
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

/**
 * @enum {number}
 */
mysr.StatusCode = {
  'OK': 200,
  'NOT_FOUND': 404,
  'INTERNAL_SERVER_ERROR': 500
};



/**
 *
 * @param {http.IncomingMessage} response
 * @constructor
 */
mysr.Response = function(response) {
  this.__httpResponse = response;
  this.__HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/plain' };
};


/**
 * @param {string} data
 */
mysr.Response.prototype.ok = function(data) {

  this.__httpResponse.writeHead(mysr.StatusCode.OK, this.__HEADERS);

  this.__httpResponse.end(data);
};


/**
 * @param {number} code
 * @param {string} message
 */
mysr.Response.prototype.error = function(code, message) {
  this.__httpResponse.writeHead(code, this.__HEADERS);

  this.__httpResponse.end(message);
};
/**
 * @param {Array} teams
 * @param {Object} file
 * @return {{teams: *, file: *}}
 */
mysr.api.createFileNameObj = function(teams, file) {
  return {'teams': teams, 'file': file};
};


/**
 * @param {string} name
 * @param {*} value
 * @return {Object}
 */
mysr.api.createTeamObj = function(name, value) {
  return{'name': name, 'value': value};
};


/**
 * @param {string} projectName
 * @param {string} teamName
 * @return {Object}
 */
mysr.api.createCrossObj = function(projectName, teamName) {
  return{'projectName': projectName, 'teamName': teamName};
};


/**
 * @param {mysr.Response} response
 * @return {function(number, string)}
 */
mysr.api.errorHandler = function(response) {
  return function(code, msg) {
    response.error(code, msg);
  }
};


/**
 * @param {mysr.Response} response
 * @param {string} date
 */
mysr.api.projectsCommitCount = function(response, date) {
  mysr.db.getTopProject(function(table) {
    var string = JSON.stringify(table);
    response.ok(string);
  }, mysr.api.errorHandler(response), date);
};


/**
 * @param {mysr.Response} response
 * @param {string} date
 */
mysr.api.projectsTeamsCommits = function(response, date) {
  var myArray = [];
  var flag = 1;
  mysr.db.getProjectsTeamsCommitCount(function(projectsTeams) {
    mysr.db.getProjectsCommitCount(function(projectsCommitCount) {
      for (var i = 0, j = 0; i < projectsTeams.length;) {
        if (projectsTeams[i].projectname === projectsCommitCount[j].projectname)
        {
          if (flag) {
            var obj = {};
            obj['projectName'] = projectsCommitCount[j].projectname;
            obj['teams'] = [];
            myArray.push(obj);
          }
          var obj2 = {};
          obj2['teamName'] = projectsTeams[i].teamname;
          obj2['value'] = (projectsTeams[i++].commits /
              projectsCommitCount[j].commits * 100).toFixed(3);

          obj['teams'].push(obj2);
          flag = 0;
        } else {
          j++;
          flag = 1;
        }
      }
      var string = JSON.stringify(myArray);
      response.ok(string);
    }, mysr.api.errorHandler(response), date);
  }, mysr.api.errorHandler(response), date);
};


/**
 * @param {mysr.Response} response
 * @param {string} date
 */
mysr.api.topCommiterTeam = function(response, date) {
  mysr.db.getTopCommiterTeam(function(table) {
    var string = JSON.stringify(table);
    response.ok(string);
  }, mysr.api.errorHandler(response), date);
};


/**
 * @param {mysr.Response} response
 * @param {string} date
 */
mysr.api.topCommiter = function(response, date) {
  mysr.db.getTopCommiter(function(table) {
    var string = JSON.stringify(table);
    response.ok(string);
  }, mysr.api.errorHandler(response), date);
};


/**
 * @param {mysr.Response} response
 * @param {string} date
 */
mysr.api.topCommitFileName = function(response, date) {
  yaa.sequence([
    mysr.db.getFileName,
    yaa.proc.fold.sequence(
        mysr.db.getTeamFileName,
        mysr.api.myIterator(date)
    )
  ]).call(null, function(t) {
    var string = JSON.stringify(t);
    response.ok(string);
  }, mysr.api.errorHandler(response), date);
};


/**
 * @param {string} date
 * @return {!yaa.Step}
 */
mysr.api.myIterator = function(date) {
  var i = -1;

  /**
   * @param {!yaa.CompleteHandler} complete
   * @param {!yaa.ErrorHandler} cancel
   * @param {!Array} state
   */
  function iterator(complete, cancel, state) {
    if (state[i + 1]) {
      complete(state[i += 1], date);
    } else {complete()}
  }

  return yaa.esc(iterator);

};


/**
 * @param {mysr.Response} response
 */
mysr.api.teamsProjects = function(response) {
  mysr.db.getTeamsProjects(function(table) {
    var string = JSON.stringify(table);
    response.ok(string);
  }, mysr.api.errorHandler(response));
};


/**
 * @param {mysr.Response} response
 * @param {string} date
 */
mysr.api.crossProject = function(response, date) {
  var myArray = [];
  mysr.db.getTeamsProjects(function(teamsProject) {
    mysr.db.getProjectsTeamsCommitCount(function(projectsTeam) {
      for (var i = 0, flag = 0; i < projectsTeam.length; i++) {
        for (var j = 0; j < teamsProject.length; j++) {
          if (projectsTeam[i].projectname === teamsProject[j].projectname) {
            if (projectsTeam[i].teamname === teamsProject[j].teamname) {
              flag = 1;
              break;
            }
          }
        }
        if (flag === 0) {
          myArray.push(mysr.api.createCrossObj(
              projectsTeam[i].projectname, projectsTeam[i].teamname));
        } else {flag = 0;}
      }
      var string = JSON.stringify(myArray);
      response.ok(string);
    }, mysr.api.errorHandler(response), date);
  }, mysr.api.errorHandler(response));
};



pg.init(20, {
  'user': 'postgres',
  'dbname': 'postgres',
  'hostaddr': '127.0.0.1',
  'port': '5432'
});


/**
 * @param {string=} opt_date format: YYYY-MM-DD
 * @return {string}
 */
mysr.db.getParseDate = function(opt_date) {
  var date = opt_date.split('%');

  var buffer = '';
  if (!date[0]) {
    buffer = ' <= \'' + date[1] + '\'';
  }
  if (!date[1]) {
    buffer = ' >= \'' + date[0] + '\'';
  }
  if (!date[0] && !date[1]) {
    buffer = ' <= current_date ';
  }
  if (date[0] && date[1]) {
    buffer = ' BETWEEN \'' + date[0] + '\' AND \'' + date[1] + '\' ';
  }
  return buffer;
};


/**
 * @namespace
 */
mysr.db.date = '';


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 * @return {function(Array)}
 */
mysr.db.handler = function(callback, cancel) {
  return function(table) {
    if (typeof(table) === 'object') {
      callback(table);
    } else {
      cancel(mysr.StatusCode.INTERNAL_SERVER_ERROR, "It's not fucking table");
    }
  }
};


/**
* @param {function(number, string)} cancel
* @return {function(string)}
*/
mysr.db.handlerError = function(cancel) {
  return function(error) {
    cancel(mysr.StatusCode.INTERNAL_SERVER_ERROR, error);
  }
};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 * @param {string} date
 */
mysr.db.getProjectsTeamsCommitCount = function(callback, cancel, date) {
  pg.exec('SELECT git.project.name AS projectname,' +
      '(git.teams.name) AS teamName, ' +
      'COUNT(git.commits.projectid) AS commits ' +
      'FROM git.commits ' +
      'LEFT JOIN git.teamsmembers ' +
      'ON git.commits.login = git.teamsmembers.login ' +
      'INNER JOIN git.teams ON git.teamsmembers.idt = git.teams.id ' +
      'LEFT JOIN git.project ON git.project.id = git.commits.projectid ' +
      'WHERE git.teams.name NOT LIKE \'%Read\' ' +
      'AND git.commits.date' + mysr.db.getParseDate(date) +
      'GROUP BY  projectname,teamName ' +
      'ORDER BY projectname,teamName',
      mysr.db.handler(callback, cancel), mysr.db.handlerError(cancel));
};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 * @param {string} date
 */
mysr.db.getProjectsCommitCount = function(callback, cancel, date) {
  pg.exec('SELECT git.project.name as projectname, ' +
      'COUNT(git.commits.projectid) AS commits ' +
      'FROM git.commits ' +
      'LEFT JOIN git.project ON git.commits.projectid = git.project.id ' +
      'AND git.commits.date' + mysr.db.getParseDate(date) +
      'GROUP BY  projectname ' +
      'ORDER BY projectname ',
      mysr.db.handler(callback, cancel), mysr.db.handlerError(cancel));
};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 * @param {string} date
 */
mysr.db.getTopProject = function(callback, cancel, date) {

  pg.exec('SELECT git.project.name as projectname, ' +
      'COUNT(git.commits.projectid) AS commits ' +
      'FROM git.commits ' +
      'LEFT JOIN git.project ON git.commits.projectid = git.project.id ' +
      'WHERE git.commits.date' + mysr.db.getParseDate(date) +
      'GROUP BY  projectname ' +
      'ORDER BY commits DESC ',
      mysr.db.handler(callback, cancel), mysr.db.handlerError(cancel));
};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 * @param {string} date
 */
mysr.db.getTopCommiterTeam = function(callback, cancel, date) {
  pg.exec('SELECT (git.teams.name) AS teamName,' +
      'COUNT(git.commits.projectid) AS commits ' +
      'FROM git.commits ' +
      'LEFT JOIN git.teamsmembers ' +
      'ON git.commits.login = git.teamsmembers.login ' +
      'LEFT JOIN git.teams ON git.teamsmembers.idt = git.teams.id ' +
      'LEFT JOIN git.project ON git.project.id = git.commits.projectid ' +
      //'WHERE git.teams.name NOT LIKE \'%Read\' ' +
      'WHERE git.commits.date' + mysr.db.getParseDate(date) +
      'GROUP BY  teamName ' +
      'ORDER BY commits DESC',
      mysr.db.handler(callback, cancel), mysr.db.handlerError(cancel));
};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 * @param {string} date
 */
mysr.db.getTopCommiter = function(callback, cancel, date) {
  pg.exec('SELECT DISTINCT git.commits.login as login,' +
      'COUNT(git.commits.login) AS count ' +
      'FROM git.commits ' +
      'LEFT JOIN git.teamsmembers ' +
      'ON git.commits.login = git.teamsmembers.login ' +
      //'WHERE git.teams.name NOT LIKE \'%Read\' ' +
      'WHERE git.commits.date' + mysr.db.getParseDate(date) +
      'GROUP BY git.commits.login ' +
      'ORDER BY count DESC',
      mysr.db.handler(callback, cancel), mysr.db.handlerError(cancel));
};


/**
 * @param {!yaa.CompleteHandler} complete
 * @param {!yaa.ErrorHandler} cancel
 * @param {string} date
 */
mysr.db.getFileName = function(complete, cancel, date) {
  pg.exec('SELECT git.filesname.filename as filename, ' +
      'git.project.name as projectname, ' +
      'COUNT(filename) as COUNT ' +
      'FROM git.filesname ' +
      'LEFT JOIN git.project ON git.filesname.projectid = git.project.id ' +
      'LEFT JOIN git.commits USING(sha,projectid) ' +
      'WHERE git.commits.date' + mysr.db.getParseDate(date) +
      'GROUP BY filename, projectname ' +
      'ORDER BY COUNT DESC ' +
      'LIMIT 100',
      mysr.db.handler(complete, cancel), mysr.db.handlerError(cancel));
};


/**
 * @param {!yaa.CompleteHandler} complete
 * @param {!yaa.ErrorHandler} cancel
 * @param {yaa.Input} file
 * @param {string} date
 */
mysr.db.getTeamFileName = function(complete, cancel, file, date) {
  pg.exec('SELECT git.filesname.filename as filename, ' +
      'git.teams.name as teamname, ' +
      '  COUNT(filename) as COUNT ' +
      'FROM git.filesname ' +
      'LEFT JOIN git.commits USING(sha,projectid) ' +
      'LEFT JOIN git.teamsmembers USING(login) ' +
      'LEFT JOIN git.teams ON git.teamsmembers.idt = git.teams.id ' +
      'LEFT JOIN git.project ON git.filesname.projectid = git.project.id ' +
      'WHERE git.commits.date' + mysr.db.getParseDate(date) +
      'AND git.teams.name  NOT LIKE \'%Read\' ' +
      'AND git.filesname.filename = \'' + file.filename + '\' ' +
      'AND git.project.name = \'' + file.projectname + '\' ' +
      'GROUP BY filename,teamname ' +
      'ORDER BY COUNT DESC',
      function(teams) {
        complete(mysr.api.createFileNameObj(teams, file));
      }, mysr.db.handlerError(cancel));
};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 */
mysr.db.getTeamsProjects = function(callback, cancel) {
  pg.exec('SELECT git.teamsprojects.projectname AS projectname,' +
      'git.teams.name AS teamName ' +
      'FROM git.teamsprojects ' +
      'LEFT JOIN git.teams ON git.teams.id = git.teamsprojects.teamid ' +
      'GROUP BY  projectname,teamName ' +
      'ORDER BY projectname ',
      mysr.db.handler(callback, cancel), mysr.db.handlerError(cancel));
};


mysr.init();
