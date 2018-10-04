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

app.get("/", function(req, res){
	res.render("home");
//	res.type("text/plain");
//	res.send("Meadowlark Travel");
});

app.get("/tours/hood-river", function(req, res){
	res.render("tours/hood-river");
});

app.get("/tours/request-group-rate", function(req, res){
	res.render("tours/request-group-rate");
});

app.get("/datetime", function(req, res){
	res.render("datetime", {datetime: new Date().toString()});
});

app.get("/about", function(req, res){

	res.render("about", { fortunes: fortune.getFortune(), pageTestScript: "/qa/tests-about.js" });
	
//	res.type("text/plain");
//	res.send("About Meadowlark Travel");
});

app.get("/header", function(req, res){
	res.set("Content-Type", "text/plain");
	var s = "";
	for(var name in req.headers) {s += name + ": " + req.headers[name] + "/n"};
	res.send(s);
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
