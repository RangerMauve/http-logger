function getData(callback) {
	var req = new XMLHttpRequest();
	req.open("GET", "/logdata.json");
	req.onload = function () {
		callback(JSON.parse(req.responseText));
	}
	req.send(null);
}

function makeHeaders(data) {
	return Object.keys(data[0]).reduce(function (p, e) {
		return p +
			'\t<th class="' +
			e + '">' + e +
			'<span onclick="toggleHiddenColumns(this.parentElement)">&#x25c9;</span>' +
			'<span>&#x25BE</span>' +
			'</th>\n';
	}, "<thead><tr>\n") + "</tr></thead>";
}

function makeRow(data) {
	var res = "",
		k, v, k2, v2;
	for (k in data) {
		v = data[k];
		if (v) {
			if ('object' == typeof v) {
				if (Object.keys(v).length) {
					res += '\t<td class="' + k + '"><span onclick="toggleHidden(this.children)">';
					res += '\t<div>[Object]</div>\n\t<div class="hidden">\n'
					for (k2 in v) {
						v2 = JSON.stringify(v[k2]);
						if (v2) res += "\t\t<div>" + k2 + ":" + v2 + "</div>\n"
					}
					res += "\t</div>"
				} else {
					res += '\t<td class="' + k + '"><span>';
				}
			} else {
				res += '\t<td class="' + k + '"><span>';
				if (k.toLowerCase().indexOf('timestamp') >= 0) {
					var date = new Date(data[k]);
					data[k] =
						date.getFullYear() +
						"/" + date.getMonth() +
						"/" + date.getDate() +
						" " + date.getHours() + (date.getHours() < 10 ? "0" : "") +
						":" + date.getMinutes() + (date.getMinutes() < 10 ? "0" : "") +
						":" + date.getSeconds() + (date.getSeconds() < 10 ? "0" : "");
				}
				res += data[k];
			}
			res += "</span></td>\n";
		}
	}
	return res;
}

function makeRows(data) {
	return data.reduce(function (p, e) {
		return p + "<tr>" + makeRow(e) + "</tr>\n";
	}, "<tbody>\n\n") + "\n</tbody>";
}

function makeTable() {
	var toHide = document.querySelectorAll("th.short");
	console.log("Re-creating the table");
	getData(function (data) {
		if (!data.length) return document.getElementById("logs").innerHTML = "<h>No Logs Found</h>";
		var tablehtml = "";
		tablehtml += makeHeaders(data);
		tablehtml += makeRows(data);
		document.getElementById("logs").innerHTML = tablehtml;
		for (var i = 0; i < toHide.length; ++i)
			toggleHiddenColumns(toHide[i]);
		if (!toHide.length)
			toggleHiddenColumns(document.querySelector(".agent"));
	});
}

function toggleHidden(elms) {
	if (!elms) return;
	if (elms.length)
		for (var i = 0; i < elms.length; ++i)
			toggleHidden(elms[i]);
	else elms.classList.toggle("hidden");
}

function toggleHiddenColumns(elm) {
	var elms = document.querySelectorAll("." + elm.classList[0]);
	for (var i = 0; i < elms.length; ++i) elms[i].classList.toggle("short");
}


function autoRefresh() {
	makeTable();
	if (autoRefresh.shouldRefresh)
		setTimeout(autoRefresh, autoRefresh.time || 5000);
}

function toggleAutoRefresh(elm) {
	autoRefresh.shouldRefresh = !! elm.checked;
	if (elm.checked) {
		autoRefresh();
	}
}

makeTable();