var express = require('express');
var app = express();
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

app.get('/', function(req, res) {
	Item.remove({}, function(err, items) {
		console.log('everything removed');
		res.send('everything is gone');
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

app.delete('/api/item/:todo_id', function(req, res) {
	console.log(req.params.todo_id);
	Item.remove({
			_id: req.params.todo_id
	}, function(err, item) {
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


app.get('*', function(req, res) {
	res.sendFile('./public/index.html');
});



app.listen(process.env.PORT || 5000);

