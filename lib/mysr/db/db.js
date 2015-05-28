


pg.init(20, {
  'user': 'postgres',
  'dbname': 'postgres',
  'hostaddr': '127.0.0.1',
  'port': '5432'
});


/**
 * @param {string} since format: YYYY-MM-DD
 * @param {string} until format: YYYY-MM-DD
 * @return {string}
 */
mysr.db.sendDate = function(since, until) {
  var buffer = '';
  if (!since) {
    buffer = ' < \'' + until + '\'';
  }
  if (!until) {
    buffer = ' > \'' + since + '\'';
  }
  if (!since && !until) {
    buffer = ' < current_date ';
  }
  if (since && until) {
    buffer = ' BETWEEN \'' + since + '\' AND \'' + until + '\' ';
  }
  return buffer;
};


/**
 * @namespace
 */
mysr.db.date = '';


mysr.db.handler = function(callback, cancel) {
  return function(table) {
    if (typeof(table) === 'object') {
      callback(table);
    } else {
      cancel(mysr.StatusCode.INTERNAL_SERVER_ERROR, "It's not fucking table");
    }
  }
};


mysr.db.handlerError = function(cancel) {
  return function(error) {
    cancel(mysr.StatusCode.INTERNAL_SERVER_ERROR, error);
  }
};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 */
mysr.db.getProjectsTeamsCommitCount = function(callback, cancel) {
  pg.exec('SELECT git.project.name AS projectname,' +
      '(git.teams.name) AS teamName, ' +
      'COUNT(git.commits.projectid) AS commits ' +
      'FROM git.commits ' +
      'LEFT JOIN git.teamsmembers ' +
      'ON git.commits.login = git.teamsmembers.login ' +
      'INNER JOIN git.teams ON git.teamsmembers.idt = git.teams.id ' +
      'LEFT JOIN git.project ON git.project.id = git.commits.projectid ' +
      'WHERE git.teams.name NOT LIKE \'%Read\' ' +
      'GROUP BY  projectname,teamName ' +
      'ORDER BY projectname,teamName',
      mysr.db.handler(callback, cancel), mysr.db.handlerError(cancel));
};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 */
mysr.db.getProjectsCommitCount = function(callback, cancel) {
  pg.exec('SELECT git.project.name as projectname, ' +
      'COUNT(git.commits.projectid) AS commits ' +
      'FROM git.commits ' +
      'LEFT JOIN git.project ON git.commits.projectid = git.project.id ' +
      'GROUP BY  projectname ' +
      'ORDER BY projectname ',
      mysr.db.handler(callback, cancel), mysr.db.handlerError(cancel));
};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 */
mysr.db.getTopProject = function(callback, cancel) {

  pg.exec('SELECT git.project.name as projectname, ' +
      'COUNT(git.commits.projectid) AS commits ' +
      'FROM git.commits ' +
      'LEFT JOIN git.project ON git.commits.projectid = git.project.id ' +
      'WHERE git.commits.date' + mysr.db.date +
      'GROUP BY  projectname ' +
      'ORDER BY commits DESC ',
      mysr.db.handler(callback, cancel), mysr.db.handlerError(cancel));
};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 */
mysr.db.getTopCommiterTeam = function(callback, cancel) {
  pg.exec('SELECT (git.teams.name) AS teamName,' +
      'COUNT(git.commits.projectid) AS commits ' +
      'FROM git.commits ' +
      'LEFT JOIN git.teamsmembers ' +
      'ON git.commits.login = git.teamsmembers.login ' +
      'LEFT JOIN git.teams ON git.teamsmembers.idt = git.teams.id ' +
      'LEFT JOIN git.project ON git.project.id = git.commits.projectid ' +
      //'WHERE git.teams.name NOT LIKE \'%Read\' ' +
      'WHERE git.commits.date' + mysr.db.date +
      'GROUP BY  teamName ' +
      'ORDER BY commits DESC',
      mysr.db.handler(callback, cancel), mysr.db.handlerError(cancel));
};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 */
mysr.db.getTopCommiter = function(callback, cancel) {
  pg.exec('SELECT DISTINCT git.commits.login as login,' +
      'COUNT(git.commits.login) AS count ' +
      'FROM git.commits ' +
      'LEFT JOIN git.teamsmembers ' +
      'ON git.commits.login = git.teamsmembers.login ' +
      //'WHERE git.teams.name NOT LIKE \'%Read\' ' +
      'WHERE git.commits.date' + mysr.db.date +
      'GROUP BY git.commits.login ' +
      'ORDER BY count DESC',
      mysr.db.handler(callback, cancel), mysr.db.handlerError(cancel));
};


/**
 * @param {!yaa.CompleteHandler} complete
 * @param {!yaa.ErrorHandler} cancel
 */
mysr.db.getFileName = function(complete, cancel) {
  pg.exec('SELECT git.filesname.filename as filename, ' +
      'git.project.name as projectname, ' +
      'COUNT(filename) as COUNT ' +
      'FROM git.filesname ' +
      'LEFT JOIN git.project ON git.filesname.projectid = git.project.id ' +
      'LEFT JOIN git.commits USING(sha,projectid) ' +
      'WHERE git.commits.date' + mysr.db.date +
      'GROUP BY filename, projectname ' +
      'ORDER BY COUNT DESC ' +
      'LIMIT 100',
      mysr.db.handler(complete, cancel), mysr.db.handlerError(cancel));
};


/**
 * @param {!yaa.CompleteHandler} complete
 * @param {!yaa.ErrorHandler} cancel
 * @param {yaa.Input} file
 */
mysr.db.getTeamFileName = function(complete, cancel, file) {
  pg.exec('SELECT git.filesname.filename as filename, ' +
      'git.teams.name as teamname, ' +
      '  COUNT(filename) as COUNT ' +
      'FROM git.filesname ' +
      'LEFT JOIN git.commits USING(sha,projectid) ' +
      'LEFT JOIN git.teamsmembers USING(login) ' +
      'LEFT JOIN git.teams ON git.teamsmembers.idt = git.teams.id ' +
      'LEFT JOIN git.project ON git.filesname.projectid = git.project.id ' +
      'WHERE git.commits.date' + mysr.db.date +
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



mysr.db.date = mysr.db.sendDate();
