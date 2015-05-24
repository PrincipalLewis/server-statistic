


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
  if (!since) {   //generate date проектирование системы
    buffer = ' < \'' + until + '\'';
  }
  if (!until) {
    buffer = ' > \'' + since + '\'';
  }
  if (!since && !until) {
    console.log('blaaaaaaaaaaaaaa');
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

mysr.db.__GET_PROJECT_TEAMS_COUNT = '' +
'SELECT git.project.name AS projectname,' +
'(git.teams.name) AS teamName, ' +
'COUNT(git.commits.projectid) AS commits ' +
'FROM git.commits ' +
'LEFT JOIN git.teamsmembers ' +
'ON git.commits.login = git.teamsmembers.login ' +
'INNER JOIN git.teams ON git.teamsmembers.idt = git.teams.id ' +
'LEFT JOIN git.project ON git.project.id = git.commits.projectid ' +
  //'WHERE git.teams.name NOT LIKE \'%Read\' ' +
'GROUP BY  projectname,teamName ' +
'ORDER BY projectname,teamName';
/**
 * @param {function(Array)} callback
 */
mysr.db.getProjectsTeamsCount = function(callback, cancel) {


  function handler(table) {
    if (isTable(table)){
      callback(table);
    } else {
      cancel(mysr.StatusCode.NOT_FOUND, "It's not fuckin table")
    }
  }
  pg.exec(mysr.db.__GET_PROJECT_TEAMS_COUNT, handler, function(msg){
    cancel(mysr.StatusCode.INTERNAL_SERVER_ERROR, msg)
  });
};


/**
 * @param {function(*)} response
 */
mysr.db.projectsTeamsCount = function(response) {

  function errorHandler(code, msg) {
    response.error(code, msg)
  }

  mysr.db.getProjectsTeamsCount(function(table) {
    var string = JSON.stringify(table);
    //console.log(string);
    response.end(string);
  }, errorHandler);
};


/**
 * @param {function(Array)} callback
 */
mysr.db.getProjectsCommitCount = function(callback) {
  pg.exec('SELECT git.project.name as projectname, ' +
      'COUNT(git.commits.projectid) AS commits ' +
      'FROM git.commits ' +
      'LEFT JOIN git.project ON git.commits.projectid = git.project.id ' +
      'GROUP BY  projectname ' +
      'ORDER BY projectname ',
      function(table) {
        callback(table);
      }, console.error);
};


/**
 * @param {function(*)} response
 */
mysr.db.projectsCommitCount = function(response) {
  mysr.db.getTopProject(function(table) {
    var string = JSON.stringify(table);
    //console.log(a);
    response.end(string);
  });
};


/**
 *
 */
mysr.db.projectsTeamsCommits = function() {
  console.log('изменения проектов по командам');
  var flag = 1;
  mysr.db.getProjectsTeamsCount(function(projectsTeams) {
    mysr.db.getProjectsCommitCount(function(ProjectsCommitCount) {
      for (var i = 0, j = 0; i < projectsTeams.length;) {
        if (projectsTeams[i].projectname === ProjectsCommitCount[j].projectname)
        {
          if (flag) {
            console.log(ProjectsCommitCount[j].projectname);
          }
          console.log('   ', projectsTeams[i].teamname,
              (projectsTeams[i++].commits /
              ProjectsCommitCount[j].commits * 100).toFixed(3) + '%');
          flag = 0;
        } else {
          j++;
          flag = 1;
        }
      }
    });
  });
};


/**
 * @param {function(Array)} callback
 */
mysr.db.getTopProject = function(callback) {
  pg.exec('SELECT git.project.name as projectname, ' +
      'COUNT(git.commits.projectid) AS commits ' +
      'FROM git.commits ' +
      'LEFT JOIN git.project ON git.commits.projectid = git.project.id ' +
      'WHERE git.commits.date' + mysr.db.date +
      'GROUP BY  projectname ' +
      'ORDER BY commits DESC ',
      function(table) {
        callback(table);
      }, console.error);
};


/**
 *
 */
mysr.db.topProject = function() {
  console.log('Top projects commits');
  mysr.db.getTopProject(function(topProject) {
    for (var i = 0; i < topProject.length; i++) {
      console.log(topProject[i].projectname, topProject[i].commits);
    }
  });
};


/**
 * @param {function(Array)} callback
 */
mysr.db.getTopCommiterTeam = function(callback) {
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
      function(table) {
        callback(table);
      }, console.error);
};


/**
 * @param {function(*)} response
 */
mysr.db.topCommiterTeam = function(response) {
  mysr.db.getTopCommiterTeam(function(table) {
    var string = JSON.stringify(table);
    response.end(string);
  });
};


/**
 * @param {function(Array)} callback
 */
mysr.db.getTopCommiter = function(callback) {
  pg.exec('SELECT DISTINCT git.commits.login as login,' +
      'COUNT(git.commits.login) AS count ' +
      'FROM git.commits ' +
      'LEFT JOIN git.teamsmembers ' +
      'ON git.commits.login = git.teamsmembers.login ' +
      //'WHERE git.teams.name NOT LIKE \'%Read\' ' +
      'WHERE git.commits.date' + mysr.db.date +
      'GROUP BY git.commits.login ' +
      'ORDER BY count DESC',
      function(table) {
        callback(table);
      }, console.error);
};


/**
 * @param {function(*)} response
 */
mysr.db.topCommiter = function(response) {
  mysr.db.getTopCommiter(function(table) {
    var string = JSON.stringify(table);
    //console.log(a);
    response.end(string);
  });
};


/**
 * @param {function(Array)} callback
 */
mysr.db.getFileName = function(callback) {
  pg.exec('SELECT git.filesname.filename as filename, ' +
      'git.project.name as projectname, ' +
      'COUNT(filename) as COUNT ' +
      'FROM git.filesname ' +
      'LEFT JOIN git.project ON git.filesname.projectid = git.project.id ' +
      'LEFT JOIN git.commits USING(sha,projectid) ' +
      'WHERE git.commits.date' + mysr.db.date +
      'GROUP BY filename, projectname ' +
      'ORDER BY COUNT DESC',
      function(table) {
        callback(table);
      }, console.error);
};


/**
 * @param {Object} file
 * @param {function(Array)} callback
 */
mysr.db.getTeamFileName = function(file, callback) {
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
      function(table) {
        callback(table);
      }, console.error);
};


/**
 * @param {function(*)} response
 */
mysr.db.topCommitFileName = function(response) {
  mysr.db.getFileName(function(filesname) {
    var string = JSON.stringify(filesname);
    //console.log(string);
    response.ok(string);
  });
};


/**
 * @param {Object} file
 * @param {function(*)} response
 */
mysr.db.topTeamCommitFileName = function(file, response) {
  mysr.db.getTeamFileName(JSON.parse(file), function(teams) {
    var string = JSON.stringify(teams);
    response.end(string);
  });
};


/**
 * @param {function(Array)} callback
 */
mysr.db.getTeamsProjects = function(callback) {
  pg.exec('SELECT git.teamsprojects.projectname AS projectname,' +
      '(git.teams.name) AS teamName ' +
      'FROM git.teamsprojects ' +
      'LEFT JOIN git.teams ON git.teams.id = git.teamsprojects.teamid ' +
      'GROUP BY  projectname,teamName ' +
      'ORDER BY projectname ',
      function(table) {
        callback(table);
      }, console.error);
};


/**
 * @param {function(*)} response
 */
mysr.db.teamsProjects = function(response) {
  mysr.db.getTeamsProjects(function(table) {
    var string = JSON.stringify(table);
    //console.log(a);
    response.end(string);
  });
};


mysr.db.getSrossProjects = function(response) {

};

/**
 *
 */
mysr.db.crossProject = function() {
  console.log('пересечение комманд');
  mysr.db.getTeamsProjects(function(teamsProject) {
    mysr.db.getProjectsTeamsCount(function(projectsTeam) {
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
          console.log(projectsTeam[i].projectname, projectsTeam[i].teamname);
        } else {flag = 0;}
      }
    });
  });
};

//
//var rl = readline.createInterface({
//  input: process.stdin,
//  output: process.stdout
//});
//
//
///**
// *
// */
//mysr.db.myInterface = function() {
//  rl.question('Введите 1,2,3,4,5,6 \n', function(answer) {
//    if (answer === '1') {
//      mysr.db.projectsTeamsCommits();
//      mysr.db.myInterface();
//    }
//    if (answer === '2') {
//      mysr.db.topCommiterTeam();
//      mysr.db.myInterface();
//    }
//    if (answer === '3') {
//      mysr.db.topProject();
//      mysr.db.myInterface();
//    }
//    if (answer === '4') {
//      mysr.db.topCommiter();
//      mysr.db.myInterface();
//    }
//    if (answer === '5') {
//      mysr.db.crossProject();
//      mysr.db.myInterface();
//    }
//    if (answer === '6') {
//      mysr.db.topCommitFileName();
//      mysr.db.myInterface();
//    }
//    if (answer === '0') {
//      rl.close();
//      process.exit(0);
//    }
//    if (answer !== '1' && answer !== '2' && answer !== '3' &&
//        answer !== '4' && answer !== '5') {
//      mysr.db.myInterface();
//    }
//  });
//};

mysr.db.date = mysr.db.sendDate();
//mysr.db.myInterface();
//mysr.db.projectsTeamsCommits();
//mysr.db.topCommiterTeam();
//mysr.db.topProject();
//mysr.db.topCommiter();
//mysr.db.crossProject();


