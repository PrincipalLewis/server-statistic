//var a = [{'1':'1','2':'2'},{'2':'2','3':'3'},{'3':'3','2':'2'},{'4':'4','2':'2'}];
//var b = JSON.stringify(a);
//var c = JSON.parse(b);
//
//console.log(b[0]);
//console.log(c);

var pg = require('node-pg');
//
db ={};
pg.init(20, {
  'user': 'postgres',
  'dbname': 'postgres',
  'hostaddr': '127.0.0.1',
  'port': '5432'
});
//var bla = 'git.project.name ';
//var query =
//'SELECT $date as projectname, ' +
//'COUNT(git.commits.projectid) AS commits ' +
//'FROM git.commits ' +
//'LEFT JOIN git.project ON git.commits.projectid = git.project.id ' +
//'WHERE git.commits.date > current_date-5 ' +
//'GROUP BY  git.project.name ' +
//'ORDER BY commits DESC ';
//////' BETWEEN $since AND $until'
//////
//pg.execPrepared(query, {'date': bla}, function(table) {
//  console.log(table);
//}, console.error);

//console.log(pg.prepareQuery(query,{'date':bla}));
db.crossProject = function() {
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

/**
 * @param {function(Array)} callback
 */
db.getTeamsProjects = function(callback) {
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
 * @param {function(Array)} callback
 */
db.getProjectsTeamsCount = function(callback) {
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
db.crossProject = function() {
  console.log('пересечение комманд');
db.getTeamsProjects(function(teamsProject) {
db.getProjectsTeamsCount(function(projectsTeam) {
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

db.crossProject();
