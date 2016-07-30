var db = '172.17.0.1';
var host = 'localhost';
var port = 9876;
var account = {
  host: host,
  port: 3306,
  database: 'shop',
  user: 'root',
  password: ''
};
var headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
};

function nop() {}
var url = require('url');
var querystring = require('querystring');
require('http').createServer(function(req, res) {
  var f404 = function() {
    res.writeHead(404);
    res.end();
  };
  var obj = url.parse(req.url);
  console.log(obj);
  if (obj.pathname.indexOf("/api/") > -1) {
    var query = querystring.parse(obj.query);
    var arr = obj.pathname.split('/');
	console.log(query,arr);
    switch (req.method.toLowerCase()) {
    case "put":
      res.writeHead(200, headers);
      res.end('put');
      break;
    case "post":
      var mysql      = require('mysql2');
      var connection = mysql.createConnection(account);
      var sql = "insert into product values('"+ arr[2] +"', '" + unescape(query.doc) + "');";
      console.log(sql);
      connection.connect(function(err) {
        connection.query(sql, function(err, rows, fields) {
		  console.log(rows);
          connection.end();
          if (err) {
		    throw err;
			console.log(err);
		  }
          res.writeHead(200, headers);
          res.end(JSON.stringify(rows));
        });
      });
      break;
    case "delete":
	  res.writeHead(200, headers);
      res.end('delete');
      break;
    case "get":
	  var mysql      = require('mysql2');
	  var connection = mysql.createConnection(account);
	  var sql = 'select _id, CONVERT(doc USING utf8) as doc from product where _id="'+ arr[2] +'"';
	  connection.connect(function(err) {
        connection.query(sql, function(err, rows, fields) {
		  console.log(rows);
          connection.end();
          if (err) {
		    throw err;
			console.log(err);
		  }
          res.writeHead(200, headers);
          res.end(JSON.stringify(rows));
        });
      });
      break;
    default:
	  res.writeHead(200, headers);
      res.end('xxx');
      break;
    }
  } else if (obj.pathname.substr(0, 6) == "/mrdb/") {
    var qst = querystring.parse(obj.query);
    var arr = obj.pathname.split('/');
    var sql = qst.sql;
    var connection = require('mysql2').createConnection(account);
  } else f404();
}).listen(port);
console.log(JSON.stringify({
  time: new Date().toISOString(),
  event: 'Started',
  name: 'mysql',
  host: host,
  port: port
}));
var signals = {
  'SIGINT': 2,
  'SIGTERM': 15
};
Object.keys(signals).forEach(function(signal) {
  process.on(signal, function() {
    console.log(JSON.stringify({
      time: new Date().toISOString(),
      event: 'Stopped',
      signal: signal,
      name: 'mysql_rest',
      host: host,
      port: port
    }));
    process.exit(128 + signals[signal]);
  });
});
