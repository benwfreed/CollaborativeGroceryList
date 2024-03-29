var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');



mongoURI = 'mongodb://heroku_mhl9lc6f:nmt4g65blevs8v0d1sbk7hompk@ds023654.mlab.com:23654/heroku_mhl9lc6f';

mongoose.connect(mongoURI);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());



var itemSchema = mongoose.Schema({
	text: String,
	checked: Boolean
});

var Item = mongoose.model('item', itemSchema);

var listSchema = mongoose.Schema({
	items: [String]
});

var List = mongoose.model('list', listSchema);

app.get('/new', function(req, res) {
	List.create({items: []}, function(err, newlist) {
		if (err) {
			res.send(err);
		} else {
			res.redirect('/'+newlist._id);
		}
	});
});

app.get('/api/item', function(req, res) {
	Item.find({}, function(err, items) {
		if (err) {
			res.send(err);
		} else {
			console.log(items);
			res.json(items);
		}
 	});
});

app.post('/api/item', function (req, res) {
	Item.create({
		text: req.body.text,
		done: false
	}, function(err, todo) {
		if (err) {
			res.send(err);
		} else {
			Item.find({}, function(err, items) {
				if (err) {
					res.send(err);
				} else {
					res.json(items);
				}
			});
		}
	});
});

app.delete('/api/item/:list_id/:text', function(req, res) {
	console.log(req.params.list_id);
	console.log(req.params.text);
	List.findOneAndUpdate({
			_id: req.params.list_id
	}, { $pull: {items: req.params.text}}, {new: true}, function(err, list) {
			if (err) {
				res.send(err);
			} else {
				console.log(list);
				res.json(list);
			}
		});
});

app.post('/api/list', function(req, res) {
	List.create({
		items: ['Hello There Yesh']
	}, function(err, list) {
		if (err) {
			res.send(err);
		} else {
			res.send(list);
		}
	});
});

app.get('/api/list/', function(req, res) {
	List.findOne({}, function(err, list) {
		if (err) {
			res.send(err);
		} else {
			console.log('coming from '+req.originalUrl);
			res.send(list);
		}
	})
});

app.get('/api/list/:list_id', function(req, res) {
	List.findOne({_id: req.params.list_id}, function(err, list) {
		if (err) {
			res.send(err);
		} else {
			res.json(list);
		}
	});
});

app.post('/api/list/:list_id', function(req, res) {
	if (req.body.text) {
		List.findOneAndUpdate({_id: req.params.list_id, items: {$ne: req.body.text}},
		{$push: {items: req.body.text}}, {new: true},
		function(err, list) {
			if (err) {
				res.send(err);
			} if (!list) {
				List.findOne({_id: req.params.list_id}, function(err, originalList) {
					if (err) {
						res.send(err);
					} else {
						res.json(originalList);
					}
				});
			} else {
				res.send(list);
			}
		});
	} else {
		List.findOne({_id: req.params.list_id}, function(err, list) {
			if (err) {
				res.send(err);
			} else {
				res.send(list);
			}
		});
	}
});

app.get('/', function(req, res) {
	res.redirect('/new');
});

app.get('*', function(req, res) {
	console.log(req.params);
	res.sendFile(__dirname + '/public/page.html');
});

io.on('connection', function (socket) {
  var referUrl = socket.handshake.headers.referer;
  var path = referUrl.split('/')[3];
  socket.join(path);
  console.log(socket);
  socket.on('update', function (data) {
	  io.to(path).emit('update', {newlist: data});
  });
});


server.listen(process.env.PORT || 3000);

