'use strict';

var express = require('express'),
 bodyParser = require('body-parser');
 Realm = require('realm');

var app = express();

let postSchema = {
	name: 'Post',
	properties: {
		timestamp: 'date',
		title: 'string',
		content: 'string'
	}
};

var blogRealm = new Realm({
	path: 'blog.realm',
	schema: [postSchema]
});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.post('/write', function(req, res) {
	let title = req.body['title'],
	content = req.body['content'],
	timestamp = new Date();
	blogRealm.write(() => {
	 blogRealm.create('Post', {title: title, content: content, timestamp: timestamp});
	});
	res.sendFile(__dirname + "/write-complete.html");
});

app.get('/', function(req, res){
	let posts = blogRealm.objects('Post').sorted('timestamp', true);
	res.render('index.ejs', {posts: posts});
});

app.listen (3000, function(){
	console.log("Go!");
});

app.get('/write', function(req, res){
	res.sendFile(__dirname + "/write.html");
});

