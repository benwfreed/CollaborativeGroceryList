var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');

mongoURI = 'mongodb://heroku_mhl9lc6f:nmt4g65blevs8v0d1sbk7hompk@ds023654.mlab.com:23654/heroku_mhl9lc6f';

mongoose.connect(mongoURI);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));


var itemSchema = mongoose.Schema({
	text: String,
	checked: Boolean
});

var Item = mongoose.model('item', itemSchema);


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

app.delete('/api/item/:item_id', function(req, res) {
	console.log(req.params.item_id);
	Item.remove({
			_id: req.params.item_id
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
	res.sendFile(__dirname + '/public/index.html');
});



app.listen(process.env.PORT || 5000);

