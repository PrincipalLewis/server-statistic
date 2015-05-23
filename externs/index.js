/**
 * @namespace
 */
mysr = {};


/**
 * @namespace
 */
mysr.db = {};


/**
 *
 */
mysr.pgConnection = function() {};


/**
 * точка входа
 */
mysr.init = function() {};


/**
 * @param {function()} response
 */
mysr.headers = function(response) {};


/**
 * @param {string} path
 * @param {object} payload
 * @param {function()} response
 */
mysr.router = function(path, payload, response) {};


/**
 * Server
 */
mysr.startServer = function(requestHandler) {};


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
 */
mysr.db.getProjectsTeamsCount = function(callback) {};


/**
 * @param {function(*)} response
 */
mysr.db.projectsTeamsCount = function(response) {};


/**
 * @param {function(Array)} callback
 */
mysr.db.getProjectsCommitCount = function(callback) {};


/**
 * @param {function(*)} response
 */
mysr.db.projectsCommitCount = function(response) {};


/**
 *
 */
mysr.db.projectsTeamsCommits = function() {};


/**
 * @param {function(Array)} callback
 */
mysr.db.getTopProject = function(callback) {};


/**
 *
 */
mysr.db.topProject = function() {};


/**
 * @param {function(Array)} callback
 */
mysr.db.getTopCommiterTeam = function(callback) {};


/**
 * @param {function(*)} response
 */
mysr.db.topCommiterTeam = function(response) {};


/**
 * @param {function(Array)} callback
 */
mysr.db.getTopCommiter = function(callback) {};


/**
 * @param {function(*)} response
 */
mysr.db.topCommiter = function(response) {};


/**
 * @param {function(Array)} callback
 */
mysr.db.getFileName = function(callback) {};


/**
 * @param {Object} file
 * @param {function(Array)} callback
 */
mysr.db.getTeamFileName = function(file, callback) {};


/**
 * @param {function(*)} response
 */
mysr.db.topCommitFileName = function(response) {};


/**
 * @param {Object} file
 * @param {function(*)} response
 */
mysr.db.topTeamCommitFileName = function(file, response) {};


/**
 * @param {function(Array)} callback
 */
mysr.db.getTeamsProjects = function(callback) {};


/**
 * @param {function(*)} response
 */
mysr.db.teamsProjects = function(response) {};


/**
 *
 */
mysr.db.crossProject = function() {};




