


/**
 *
 * @param {http.IncomingMessage} response
 * @constructor
 */
mysr.Response = function(response) {
  this.__httpResponse = response;
};


mysr.Response.prototype.__HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'text/plain' };


/**
 * @param {String} data
 */
mysr.Response.prototype.ok = function(data) {

  this.__httpResponse.writeHead(mysr.StatusCode.OK, this.__HEADERS);

  this.__httpResponse.end(data);
};


/**
 * @param {number} code
 * @param {string} message
 */
mysr.Response.prototype.error = function(code, message) {
  this.__httpResponse.writeHead(code, this.__HEADERS);

  this.__httpResponse.end(message);
};
