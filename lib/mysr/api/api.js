/**
 * @param {Array} teams
 * @param {Object} file
 * @return {Object}
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
 * @return {mysr.Response.error}
 */
mysr.api.errorHandler = function(response) {
  return function(code, msg) {
    response.error(code, msg);
  }
};


/**
 * @param {mysr.Response} response
 */
mysr.api.projectsCommitCount = function(response) {
  mysr.db.getTopProject(function(table) {
    var string = JSON.stringify(table);
    response.ok(string);
  }, mysr.api.errorHandler(response));
};


/**
 * @param {mysr.Response} response
 */
mysr.api.projectsTeamsCommits = function(response) {
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
    }, mysr.api.errorHandler(response));
  }, mysr.api.errorHandler(response));
};


/**
 * @param {mysr.Response} response
 */
mysr.api.topCommiterTeam = function(response) {
  mysr.db.getTopCommiterTeam(function(table) {
    var string = JSON.stringify(table);
    response.ok(string);
  }, mysr.api.errorHandler(response));
};


/**
 * @param {mysr.Response} response
 */
mysr.api.topCommiter = function(response) {
  mysr.db.getTopCommiter(function(table) {
    var string = JSON.stringify(table);
    response.ok(string);
  }, mysr.api.errorHandler(response));
};


/**
 * @param {mysr.Response} response
 */
mysr.api.topCommitFileName = function(response) {
  yaa.sequence([
    mysr.db.getFileName,
    yaa.proc.fold.sequence(
        mysr.db.getTeamFileName,
        yaa.iterator.array()
    )
  ]).call(this, function(t) {
    var string = JSON.stringify(t);
    response.ok(string);
  }, mysr.api.errorHandler(response));
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
 */
mysr.api.crossProject = function(response) {
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
    }, mysr.api.errorHandler(response));
  }, mysr.api.errorHandler(response));
};
