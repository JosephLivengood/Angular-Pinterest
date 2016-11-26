/*Server initialisation*/
var express     =       require('express');
var app         =       express();
var PORT        =       process.env.port || 8080;
var path        =       process.cwd();

/*Paths*/
var apiRoutes       =   require('./app/routes/api.js');
var indexRoutes     =   require('./app/routes/index.js');

/*Rendered pug while in dev*/
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

/*Load routing*/
apiRoutes(app);
indexRoutes(app);

/*Server start*/
app.listen(PORT, function() {
    console.log("App listening on port " + PORT);
});