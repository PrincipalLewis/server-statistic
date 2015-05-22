/**
 * @namespace
 */
mysr = {};


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
 * @param {function(Array)} callback
 */
mysr.db.getProjectsCommitCount = function(callback) {};


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
 *
 */
mysr.db.topCommiterTeam = function(response) {};


/**
 * @param {function(Array)} callback
 */
mysr.db.getTopCommiter = function(callback) {};


/**
 *
 */
mysr.db.topCommiter = function(response) {};


/**
 * @param {function(Array)} callback
 */
mysr.db.getFileName = function(callback) {};


/**
 *
 */
mysr.db.topCommitFileName = function(response) {};


/**
 *
 */
mysr.db.topTeamCommitFileName = function(file, response) {};


/**
 * @param {function(Array)} callback
 */
mysr.db.getTeamsProjects = function(callback) {};


/**
 *
 */
mysr.db.crossProject = function() {};




