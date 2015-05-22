var a = [{'1':'1','2':'2'},{'2':'2','3':'3'},{'3':'3','2':'2'},{'4':'4','2':'2'}];
var b = JSON.stringify(a);
var c = JSON.parse(b);

console.log(b[0]);
console.log(c);

//var pg = require('node-pg');
//
//var query = ' BETWEEN $since AND since $until';
//
//console.log(pg.prepareQuery(query, {'since': "123", 'until': "321"}), complete, cancel);
