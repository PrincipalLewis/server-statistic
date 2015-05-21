


pg.init(20, {
  'user': 'postgres',
  'dbname': 'postgres',
  'hostaddr': '127.0.0.1',
  'port': '5432'
});




/**
 * @param {string} since format: YYYY-MM-DD
 * @param {string} until format: YYYY-MM-DD
 */
mysr.db.sendDate = function(since, until) {
  mysr.db.date += ' BETWEEN \'' + since + '\' AND \'' + until + '\' ';
};


/**
 * @namespace
 */
mysr.db.date = '';


/**
 * @param {function(Array)} callback
 */
mysr.db.getProjectsTeamsCount = function(callback) {
  pg.exec('SELECT git.project.name AS projectname,' +
      '(git.teams.name) AS teamName, ' +
      'COUNT(git.commits.projectid) AS commits ' +
      'FROM git.commits ' +
      'LEFT JOIN git.teamsmembers ' +
      'ON git.commits.login = git.teamsmembers.login ' +
      'INNER JOIN git.teams ON git.teamsmembers.idt = git.teams.id ' +
      'LEFT JOIN git.project ON git.project.id = git.commits.projectid ' +
      //'WHERE git.teams.name NOT LIKE \'%Read\' ' +
      'GROUP BY  projectname,teamName ' +
      'ORDER BY projectname,teamName',
      function(table) {
        callback(table);
      }, console.error);
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
 *
 */
mysr.db.topCommiterTeam = function() {
  console.log('Top teams commits');
  mysr.db.getTopCommiterTeam(function(commiters) {
    for (var i = 0; i < commiters.length; i++) {
      console.log(commiters[i]);
    }

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
 *
 */
mysr.db.topCommiter = function() {
  console.log('топовый коммитер');
  mysr.db.getTopCommiter(function(commiters) {
    for (var i = 0; i < commiters.length; i++) {
      console.log(commiters[i]);
    }
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


mysr.db.getTeamFileName = function(fileName,callback) {
  pg.exec('SELECT git.filesname.filename as filename, ' +
    'git.teams.name as teamname, ' +
    '  COUNT(filename) as COUNT ' +
    'FROM git.filesname ' +
    'LEFT JOIN git.commits USING(sha,projectid) ' +
    'LEFT JOIN git.teamsmembers USING(login) ' +
    'LEFT JOIN git.teams ON git.teamsmembers.idt = git.teams.id ' +
    'WHERE git.commits.date' + mysr.db.date +
    'AND git.teams.name  NOT LIKE \'%Read\' ' +
    'AND git.filesname.filename = \'' + fileName.filename + '\' ' +
    'GROUP BY filename,teamname ' +
    'ORDER BY COUNT DESC',
    function(table) {
      callback(table, fileName.projectname);
    }, console.error);
};

/**
 *
 */
mysr.db.topCommitFileName = function() {
  mysr.db.getFileName(function(filesname) {
    for (var i = 0; i < filesname.length; i++) {
      console.log(filesname[i]);
    }
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

mysr.db.sendDate('2015-01-13', '2015-05-15');
//mysr.db.myInterface();
//mysr.db.projectsTeamsCommits();
//mysr.db.topCommiterTeam();
//mysr.db.topProject();
//mysr.db.topCommiter();
//mysr.db.crossProject();


