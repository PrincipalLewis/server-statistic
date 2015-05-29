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
    //console.log(state[i + 1], date);
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
