var http_log = require("../");
var path = require("path");

http_log.server(
	path.join(__dirname,"log.txt")
).listen(31337);