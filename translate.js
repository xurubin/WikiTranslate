var translations = {};
var lang = 'zh';

function query(link, title, onsuccess) {
    var match = link.match(/\/wiki\/(.*)$/);
	if (!match)
		return;

	var title = match[1];
	var url = "/w/api.php?action=query&prop=langlinks&format=json&lllimit=10&lllang=" + lang + "&titles=" + title
	$.ajax({
		url: url,
		dataType: "json",
	}).done(function ( data ) {
		var pages = data.query.pages;
		var page = null;
		for(var pid in pages) {
		    page = pages[pid];
		}
		var langlinks = page.langlinks;
		var new_title = title;
		if (langlinks) {
			for (var i=0; i<langlinks.length; i++)
				new_title = new_title + '\n' + langlinks[i]['lang'] + ':' + langlinks[i]['*'];
		} else 
			new_title = new_title + '\n' + '(None)';
		
		translations[link] = new_title;
		onsuccess(new_title);
	}).fail(function ( data ) {
		alert("query failed.");
	});
}

$('a').hover(function() {
	var href = $(this);
    var url = href.attr("href");
	if (url in translations) {
		href.attr("title", translations[url]);
	} else {
		query(url, href.attr("title"), function (tooltip) {
			href.attr("title", tooltip);
		});
	}
});