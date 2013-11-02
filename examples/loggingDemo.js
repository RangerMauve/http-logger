var logger = require("../").logger;
var connect = require("connect");
var path = require("path");
var app = connect();

// Log to a file
app.use(logger(path.join(__dirname,"log.txt")));

// Also log to the console
app.use(logger());

app.use(function(req,res,next){
	res.end("Desu");
});

app.listen(31337);