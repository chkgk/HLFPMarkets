var express = require('express.io');
var mysql = require('mysql');
var app = express();
var port = 8080;
var fs = require('fs');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'chkgk',
	password: 'kakuro',
	database: 'hlfp'
});

app.http().io();

app.use(express.cookieParser());
app.use(express.session({secret: 'monkey'}));
app.use(express.static(__dirname+'/static'));

app.listen(port);

var connections = Array();
var clients = Array();
var monitors = Array();
var sessioncode = 'NULL';
var ColNames = Array();

var query = connection.query('SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`=\'hlfp\' AND `TABLE_NAME`=\'participants\'', function (err, result) {
	if (err) { console.log(query.sql); throw err; }
	for (x in result) {
		ColNames.push(result[x].COLUMN_NAME)
	}
});

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.htm');
});

app.io.route('register', function(req) {
	connections.push(req.io);
	if (req.data.type == 'client') {
		if (registered(req.data.seat)) {
			req.io.emit('register', {'response':'rejected'}, function () {
				req.io.disconnect();
				console.log("rejected "+req.data.seat);
			});
		} else {
			req.session.starttime = new Date().toString();
			req.session.type = 'client';
			req.session.seat = req.data.seat;
			req.io.join('clients');
			var query = connection.query('INSERT INTO participants SET ?', { sessionid: req.sessionID, seat: req.data.seat, session: sessioncode }, function (err, result) {
					if (err) { console.log(query.sql); throw err }
					req.session.dbid = result.insertId;
					console.log('db: participant created with id '+req.session.dbid);
					req.session.save(function() {
						clients.push({ 'seat': req.data.seat, 'sessionid':req.sessionID, 'socketid':req.io.socket.id, 'dbid': req.session.dbid});
						req.io.emit('register', { response:'accepted', sessionid:req.sessionID});
						app.io.room('monitors').broadcast('list', clients);
						console.log("participant accepted at seat "+req.data.seat);
					});
				});
		}
	} else {
		req.session.starttime = new Date().toString();
		req.session.type = 'monitor';
		req.session.save(function() {
			req.io.join('monitors');		
			monitors.push({'sessionid':req.sessionID, 'socketid':req.io.socket.id});
			req.io.emit('register', { response:'accepted', sessionid:req.sessionID, scode: sessioncode })
			app.io.room('monitors').broadcast('list', clients);
			console.log("monitor connected");
			finished();
		});
	}
});

app.io.route('go', function(req) {
	app.io.room('clients').broadcast('start');
});

app.io.route('setsession', function (req) {
	sessioncode = req.data.scode;
	if (clients.length > 0) {
		var list = Array();
		for (x in clients) {
			list.push(clients[x].dbid);
		}
		var query = connection.query('UPDATE participants SET ? WHERE id IN (?)', [{ session: sessioncode}, list], function (err, result) {
			if (err) { console.log(query.sql); throw err; }
		});
	}
	console.log("Session code: "+sessioncode);
	req.io.emit('sessionset');
});


app.io.route('storeData', function (req) {
	var error = false;
	for (x in req.data) {
		if (ColNames.indexOf(x) == -1) {
			error = true;
		}
	}
	if (error) { console.log(req.data); throw 'db column does not exist'; }
	var query = connection.query('UPDATE participants SET ? WHERE id = ?', [ req.data, req.session.dbid], function (err, result) {
		if (err) { console.log(query.sql); throw err }
	});
});

app.io.route('disconnect', function(req) {
	var i = connections.indexOf(req.io);
	var index = -1;
	connections.splice(i, 1);
	for (x in clients) {
		if (clients[x].sessionid == req.sessionID) {
			index = x;
		}
	}
	if (index > -1) {
		clients.splice(index, 1);
		console.log("client disconnected");
	} else {
		for (x in monitors) {
			if (monitors[x].sessionid == req.sessionID) {
				index = x;
			}
		}
		if (index > -1) {
			monitors.splice(index, 1);
			console.log("monitor disconnected");
		}
	}
	app.io.room('monitors').broadcast('list', clients);
});

app.io.route('ende', function (req) {
	finished();
});

function finished() {
	var fList = [];
	var query = connection.query('SELECT starttime, seat, payoff FROM participants WHERE session = \''+sessioncode+'\' AND payoff != \'NULL\' ORDER BY starttime DESC, seat ASC LIMIT 20', function (err, result) {
		if (err) { console.log(query.sql); throw err; }
		for (x in result) {
			var pay = 6+(Math.ceil((result[x].payoff/10000)/0.2)*0.2);
			fList.push({starttime: result[x].starttime, seat: result[x].seat, payment: pay.toFixed(2)});
		}
		app.io.room('monitors').broadcast('finished', {finished: fList});
	});
}

function registered(pSeat) {
	var found = false;
	for (x in clients) {
		if (clients[x].seat == pSeat) {
			found = true;
		}
	}
	return found;
}