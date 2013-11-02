var connect = require("connect");
var url = require("url");
var fs = require("fs");
var path = require("path")

module.exports = {
	logger: function (logname) {
		return function (req, res, next) {
			connect.json()(req, res, function () {
				connect.urlencoded()(req, res, function () {
					var logmsg = {
						method: req.method || "",
						ip: req.connection.remoteAddress,
						url: req.url,
						timeStamp: Date.now(),
						agent: req.headers["user-agent"],
						hostname: req.headers["host"],
						body: req.body||{},
						session: req.session||{},
						params: req.params||{},
						cookies: req.cookies||{}
					};
					if (logname) {
						fs.appendFile(
							logname,
							JSON.stringify(logmsg) + "\n",
							function () {}
						);
					} else {
						console.log(logmsg);
					}
					next();
				});
			});
		}
	},
	server: function (options) {
		var logname, app, port, filedata = "[]";

		// Parse out options
		if ((typeof options) === 'string') {
			logname = options;
		} else {
			port = options.port;
			logname = options.logName || "http_log.log";
		}

		// Set up file watcher to parse the log file
		function updateFileData(){
			fs.readFile(logname, function (err, data) {
				if (data) {
					a = data.toString().split("\n");
					if (a.length) a.pop();
					filedata = "[" + a.join() + "]";
				}
			});
		}
		fs.watchFile(logname, updateFileData);
		updateFileData();

		// Set up server
		app = connect();
		app.use(connect.static("./serverfiles"));
		app.use(function (req, res, next) {
			res.setHeader("Content-Type", "application/json");
			res.end(filedata);
		});

		// Start the server and return a reference to it
		if (port) app.listen(port);
		return app;
	}
}