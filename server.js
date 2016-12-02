/*Server initialisation*/
var express     =       require('express');
var app         =       express();
var PORT        =       process.env.port || 8080;
var path        =       process.cwd();
var bodyParser  =       require('body-parser');

/*Paths*/
var apiRoutes       =   require('./app/routes/api.js');
var indexRoutes     =   require('./app/routes/index.js');
var authentication  =   require('./app/auth/passport.js');
app.use(express.static(__dirname + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'pug'); //while in dev

/*Authentication initialisation*/
authentication(app);

/*Load routing*/
apiRoutes(app);
indexRoutes(app);

/*Server start*/
app.listen(PORT, function() {
    console.log("App listening on port " + PORT);
});