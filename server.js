// Memanggil module/package yg diperlukan
const express    = require('express');
const bodyParser = require('body-parser');
const app  = express();
const router = express.Router();
const port = 8080;
const User = require('./app/models/user'); // Model user

// menggunakan body parser untuk get data dari http request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Buat koneksi ke db mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/sample', {
  useMongoClient: true,
});

// routes index
router.get('/', function(req, res) {
	res.json({
		message:"Hello world, Simple REST API"
	});
});

 // create a user (POST)
router.route('/users') 
	.post(function(req, res) {
		var user = new User();
		user.username = req.body.username;
		user.password = req.body.password;
		user.name     = req.body.name;
		user.email	  = req.body.email;
		user.save(function(err) {
			if(err){
				res.send(err);
			} else {
				res.json({
					message:'data user berhasil dibuat'
				});
			}
		});
	})
	 // Menampilkan semua data user (GET)
	.get(function(req, res) { 
		User.find(function(err, users) {
			if(err) res.send('err');
			else res.json(users);
		});
	});


	// Menampilkan detail data seorang user (GET)
	router.route('/users/:username')
		.get(function(req, res) {
			User.findOne({
				username:req.params.username
			}, function(err, user) {
				if(err) res.send(err);
				else res.json(user);
			});
		})
		// update data user (PUT) 
		.put(function(req, res) {
			User.findOne({
				username: req.params.username
			}, function(err, user) {
				if(err) res.send(err);
				else {
					user.username = req.body.username;
					user.password = req.body.password;
					user.name     = req.body.name;
					user.email    = req.body.email;
					user.save(function(err) {
						if(err) res.send(err);
						else res.json({
							message:'data user diupdate'
						});
					});
				}
			});
		})
		// menghapus data user (Delete)
		.delete(function(req, res) {
			User.remove({
				username:req.params.username
			}, function(err, user) {
				if(err) res.send(err);
				else res.json({
					message:'user dihapus'
				});
			});
		});

// prefix for route 
app.use('/api', router); app.listen(port); 
console.log('Service berjalan pada port : ' + port);