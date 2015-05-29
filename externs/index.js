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
mysr.date;


/**
 *
 */
mysr.pgConnection = function() {};


/**
 * точка входа
 */
mysr.init = function() {};


/**
 * @param {string} path
 * @param {string} payload
 * @param {mysr.Response} response
 */
mysr.router = function(path, payload, response) {};


/**
 * Server
 * @param {function(string, string, mysr.Response)} requestHandler
 */
mysr.startServer = function(requestHandler) {};


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
mysr.Response = function(response) {};


/**
 * @param {string} data
 */
mysr.Response.prototype.ok = function(data) {};


/**
 * @param {number} code
 * @param {string} message
 */
mysr.Response.prototype.error = function(code, message) {};


/**
 * @param {Array} teams
 * @param {Object} file
 * @return {{teams: *, file: *}}
 */
mysr.api.createFileNameObj = function(teams, file) {};


/**
 * @param {string} name
 * @param {*} value
 * @return {Object}
 */
mysr.api.createTeamObj = function(name, value) {};


/**
 * @param {string} projectName
 * @param {string} teamName
 * @return {Object}
 */
mysr.api.createCrossObj = function(projectName, teamName) {};


/**
 * @param {mysr.Response} response
 * @return {function(number, string)}
 */
mysr.api.errorHandler = function(response) {};


/**
 * @param {mysr.Response} response
 * @param {string} date
 */
mysr.api.projectsCommitCount = function(response, date) {};


/**
 * @param {mysr.Response} response
 * @param {string} date
 */
mysr.api.projectsTeamsCommits = function(response, date) {};


/**
 * @param {mysr.Response} response
 * @param {string} date
 */
mysr.api.topCommiterTeam = function(response, date) {};


/**
 * @param {mysr.Response} response
 * @param {string} date
 */
mysr.api.topCommiter = function(response, date) {};


/**
 * @param {mysr.Response} response
 * @param {string} date
 */
mysr.api.topCommitFileName = function(response, date) {};


/**
 * @param {string} date
 * @return {!yaa.Step}
 */
mysr.api.myIterator = function(date) {};


/**
 * @param {mysr.Response} response
 */
mysr.api.teamsProjects = function(response) {};


/**
 * @param {mysr.Response} response
 * @param {string} date
 */
mysr.api.crossProject = function(response, date) {};


/**
 * @param {string=} opt_date format: YYYY-MM-DD
 * @return {string}
 */
mysr.db.getParseDate = function(opt_date) {};


/**
 * @namespace
 */
mysr.db.date


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 * @return {function(Array)}
 */
mysr.db.handler = function(callback, cancel) {};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 * @param {string} date
 */
mysr.db.getProjectsTeamsCommitCount = function(callback, cancel, date) {};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 * @param {string} date
 */
mysr.db.getProjectsCommitCount = function(callback, cancel, date) {};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 * @param {string} date
 */
mysr.db.getTopProject = function(callback, cancel, date) {};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 * @param {string} date
 */
mysr.db.getTopCommiterTeam = function(callback, cancel, date) {};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 * @param {string} date
 */
mysr.db.getTopCommiter = function(callback, cancel, date) {};


/**
 * @param {!yaa.CompleteHandler} complete
 * @param {!yaa.ErrorHandler} cancel
 * @param {string} date
 */
mysr.db.getFileName = function(complete, cancel, date) {};


/**
 * @param {!yaa.CompleteHandler} complete
 * @param {!yaa.ErrorHandler} cancel
 * @param {yaa.Input} file
 * @param {string} date
 */
mysr.db.getTeamFileName = function(complete, cancel, file, date) {};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 */
mysr.db.getTeamsProjects = function(callback, cancel) {};




