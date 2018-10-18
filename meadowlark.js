var express = require("express");

var app = express();

var fortune = require("./fortune");

var handlebars = require("express-handlebars")
	.create({defaultLayout: "main"});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3001);

app.use(function(req, res, next){
	res.locals.showTests = app.get("env") !== "production" && req.query.test === "1";
	next();
});


app.use(function(req, res, next){
	if(!res.locals.partials) res.locals.partials = {};
 	res.locals.partials.weatherContext = {
		locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
}
	next();
});

app.use(require("body-parser").urlencoded({extended: true }));

var credentials = require("./credentials.js")

app.use(require("cookie-parser")(credentials.cookieSecret));


app.get("/", function(req, res){
//	res.cookie("monster", "nom nom");
	console.log()
	res.render("home");
//	res.type("text/plain");
//	res.send("Meadowlark Travel");
});


app.get("/newsletter",function(req, res){
res.render("newsletter", { csrf: "CSRF token goes here"});
});
/*
app.post("/process", function(req, res){

console.log("Form (from querystrin: " + req.query.form);
console.log("CSRF token(from hidden form field): " + req.body._csrf);
console.log("Name (from visible form field): " + req.body.name);
console.log("Email (from visible form field): " + req.body.email);
res.redirect(303, "/thank you");
});
*/
app.get("/newsletters",function(req, res){
res.render("newsletters", { csrf: "CSRF token goes here"});

});
app.post("/process", function(req, res){
	if(req.xhr || req.accepts("json,html")==="json"){
	console.log(JSON.stringify(req.body));
res.send({
 
	success: true,
	message: "Hello World!"
	 });
}
else{

res.redirect(303,"/thank-you");
}

});

app.get("/tours/hood-river", function(req, res){
	res.render("tours/hood-river");
});

app.get("/tours/request-group-rate", function(req, res){
	res.render("tours/request-group-rate");
});

app.get("/tours-info",function(req, res){
	res.render("tours-info",{
		currency:{
			name: "United States dollars",
			abbrev: "USD",
			},
		tours: [
			{name: "Hood River", price: "$99.95"},
			{name: "Oregon Coast", price: "$159.95"},
			],
		specialUrl: "/january-special",
		currencies: ["USD", "GBP", "BTC"],
	});
});

app.get("/datetime", function(req, res){
	res.render("datetime", {datetime: new Date().toString()});
});

app.get("/about", function(req, res){

	res.render("about", { fortunes: fortune.getFortune(), pageTestScript: "/qa/tests-about.js" });
	
//	res.type("text/plain");
//	res.send("About Meadowlark Travel");
});


app.use(express.static(__dirname + "/public"));

// custom 404 page
app.use(function(req, res){
	res.type("text/plain");
	res.status(404);
	res.send("404 - Not Found");
});

//custom 500 page
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type("text/plain");
	res.status(500);
	res.send("500 - server Error");
});
app.listen(app.get("port"), function(){
	console.log( "Express started on http://localhost:" + app.get("port") + "; press Ctrl-C to terminate.");
});
