// Requiring our custom middleware for checking if a user is logged in
// and our sequelize models
const isAuthenticated = require("../config/middleware/isAuthenticated"),
	  isAdmin = require("../config/middleware/isAdmin"),
	  isScheduler = require("../config/middleware/isScheduler"),
	  db = require('../models');

module.exports = function(app) {

	app.get('/admin', isAuthenticated, isScheduler, function(req, res){
		let admin = {admin: false}

		if( req.user.Group.type === 'admin') {
			admin.admin = true;
		}
		
		res.render('admin', admin);
		
	});

	app.get('/admin/vacations', isAuthenticated, isAdmin, function(req, res){
		// if(req.user.group !== 'admin'){
		// 	res.redirect('/');
		// }
		db.VacationRequest.findAll({ })
						  .then( function( data ) {
						  	 res.render('vacationAdmin', {vacation: data});
						  }).catch( function(error) {
						  	 console.log(error.message);
						  });

	});

	app.get('/admin/add-user', isAuthenticated, isAdmin, function( req, res ) {
		let dataObj = {};

		db.Partner.findAll({})
				  .then( function( data ) {
				  	 dataObj.Partner = data;
				  	 db.Group.findAll({}).then(function(data){
				  	 	dataObj.Group = data;
				  	 	db.Status.findAll({}).then(function(data){
				  	 		dataObj.Status = data;
				  	 		res.render('add-user', dataObj);
				  	 	}).catch( function( error ){ console.log(error.message); res.send(400) });
				  	 }).catch( function( error ){ console.log(error.message); res.send(400) });
				  }).catch( function( error ){ console.log(error.message); res.send(400) });
	});

	app.put('/admin/vacations', isAuthenticated, isAdmin, function( req, res ) {
		db.Vacation.update( req.body, {where: {id: req.body.id} })
				   .then( function( data ) {
				   	 res.redirect('/admin/vacations');
				   }).catch( function( error ) {
				   	 console.log(error.message);
				   });
	});

	app.post('/admin/partner', isAuthenticated, isAdmin, function( req, res ) {
		db.Partner.create( req.body )
				  .then( function( data ){
				  	res.render('add-partner');
				  }).catch( function(error) {
				  	console.log(error.message);
				  	res.send(400);
				  });
	});

}