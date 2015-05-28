/**
 * @namespace
 */
mysr = {};


/**
 * @namespace
 */
mysr.db = {};


/**
 * @namespace
 */
mysr.api = {};


/**
 * @namespace
 */
mysr.date


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
 * @param {object} payload
 * @param {mysr.Response} response
 */
mysr.router = function(path, payload, response) {};


/**
 * Server
 * @param {mysr.router} requestHandler
 */
mysr.startServer = function(requestHandler) {};


/**
 * @enum {string}
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
 * @param {String} data
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
 * @return {Object}
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
 * @return {mysr.Response.error}
 */
mysr.api.errorHandler = function(response) {};


/**
 * @param {mysr.Response} response
 */
mysr.api.projectsCommitCount = function(response) {};


/**
 * @param {mysr.Response} response
 */
mysr.api.projectsTeamsCommits = function(response) {};


/**
 * @param {mysr.Response} response
 */
mysr.api.topCommiterTeam = function(response) {};


/**
 * @param {mysr.Response} response
 */
mysr.api.topCommiter = function(response) {};


/**
 * @param {mysr.Response} response
 */
mysr.api.topCommitFileName = function(response) {};


/**
 * @param {mysr.Response} response
 */
mysr.api.teamsProjects = function(response) {};


/**
 * @param {mysr.Response} response
 */
mysr.api.crossProject = function(response) {};


/**
 * @param {string} since format: YYYY-MM-DD
 * @param {string} until format: YYYY-MM-DD
 * @return {string}
 */
mysr.db.sendDate = function(since, until) {};


/**
 * @namespace
 */
mysr.db.date


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 */
mysr.db.getProjectsTeamsCommitCount = function(callback, cancel) {};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 */
mysr.db.getProjectsCommitCount = function(callback, cancel) {};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 */
mysr.db.getTopProject = function(callback, cancel) {};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 */
mysr.db.getTopCommiterTeam = function(callback, cancel) {};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 */
mysr.db.getTopCommiter = function(callback, cancel) {};


/**
 * @param {!yaa.CompleteHandler} complete
 * @param {!yaa.ErrorHandler} cancel
 * @param {yaa.Input=} opt_item
 */
mysr.db.getFileName = function(complete, cancel, opt_item) {};


/**
 * @param {!yaa.CompleteHandler} complete
 * @param {!yaa.ErrorHandler} cancel
 * @param {yaa.Input} file
 */
mysr.db.getTeamFileName = function(complete, cancel, file) {};


/**
 * @param {function(Array)} callback
 * @param {function(number, string)} cancel
 */
mysr.db.getTeamsProjects = function(callback, cancel) {};




