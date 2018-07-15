chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			videoDumper();
			smokeAdblockBlockerRemover();
		}
	}, 10);
});

function videoDumper() {
	var videoElements = document.getElementsByTagName('video');
	var length = videoElements.length;

	console.log('[VideoDumper] Processing document with url: "' + window.location.href + '"...');
	if (length == 0) {
		console.log('[VideoDumper] No video element on this document.');
		return;
	} else {
		console.log('[VideoDumper] Found ' + length + ' video element(s).');
	}

	/*
	 * Injecting css
	 */
	var css = '.videodumper, .videodumper a { /*text-align: center;*/ z-index : 1;  font-family: "Avenir Next", Helvetica; font-size: 3rem; color: #999; line-height: 1.1; -moz-text-fill-color: white; -webkit-text-fill-color: white; -moz-text-stroke-color: #666; -webkit-text-stroke-color: #666; -moz-text-stroke-width: 2px; -webkit-text-stroke-width: 2px;}';
	var head = document.head || document.getElementsByTagName('head')[0];
	var style = document.createElement('style');

	style.type = 'text/css';
	if (style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}
	head.appendChild(style);

	/*
	 * Injecting JS
	 */
	var div = document.createElement('div');
	div.className = "videodumper";
	div.style.position = 'fixed';
	div.style.top = 0;
	// div.style.right = 0;
	document.body.appendChild(div);

	/*
	 * Links & listener for auto-update
	 */
	document.addEventListener("click", function() {
		console.log('[VideoDumper] ------------------------');
		console.log('[VideoDumper] Clicked on body, refresing and dumping all value: ' + length + ' video element(s).');

		var links = '';
		for (var i = 0; i < length; i++) {
			var video = videoElements[i];

			if (video.src == null) {
				continue;
			}

			var sources = video.getElementsByTagName('source');
			if (sources.length == 0) {
				console.log('[VideoDumper] [Item] videoId: ' + i + ', url: "' + video.src + '"');
				links += '<a href="' + video.src + '">#' + i + '-> ' + (video.src.startsWith('blob:') ? 'blob:' : 'link:') + /* '<br>' + */+' ' + getFilename(video.src) + '</a><br>';
			} else {
				console.log('[VideoDumper] Source(s) found. Advanced dumping enabled!');

				var sourceLinks = '';
				for (var j = 0; j < sources.length; j++) {
					var source = sources[j];

					if (source.src == null) {
						continue;
					}

					console.log('[VideoDumper] [Item] sourceId: ' + i + ', type: "' + source.type + '", url: "' + source.src + '"');
					sourceLinks += '<a href="' + source.src + '">source#' + j + ',type=' + source.type + '-> ' + (video.src.startsWith('blob:') ? 'blob' : 'link') + '</a><br>';
				}
				links += sourceLinks;
			}

		}

		div.innerHTML = links;
	});

	/*
	 * Auto-click for openload site
	 */// Thanks:
	// https://greasyfork.org/en/scripts/34206-stream-to-vlc/code
	// if (window.location.href.indexOf('openload.co') != -1) {
	var videooverlay = document.getElementById('videooverlay');
	if (videooverlay != undefined) {
		videooverlay.click();
	}
	// }
}


/*
 * Remove AdBlock-Blocker
 */
function smokeAdblockBlockerRemover() {
	var adblockroutine = 0;
	var adblockmaxroutine = 100;

	var adblockblockerid = setInterval(function() {
		adblockroutine++;
		// console.log('[VideoDumper] [Utils] "Smoke AdBlock-Blocker": routine
		// #' + adblockroutine + ' out of ' + adblockmaxroutine);

		var adblockblocker = document.getElementsByClassName('smoke-base');
		if (adblockblocker.length > 0) {
			console.log('[VideoDumper] [Utils] "Smoke AdBlock-Blocker": removing ' + adblockblocker.length + ' locking shadow frame. ('  + window.location.href + ')');
			for (var i = 0; i < adblockblocker.length; i++) {
				adblockblocker[i].parentNode.remove();
			}
			clearInterval(adblockblockerid);
		} else {
			if (adblockroutine == adblockmaxroutine) {
				console.log('[VideoDumper] [Utils] "Smoke AdBlock-Blocker": seems not have any "smoke" based AdBlock-Blocker. ('  + window.location.href + ')');
			}
		}

		if (adblockroutine == adblockmaxroutine) {
			clearInterval(adblockblockerid);
		}
	}, 100);
}

function getFilename(url) {
	if (url) {
		var match = url.toString().match(/.*\/(.+?)\./);
		if (match && match.length > 1) {
			return match[1];
		}
	}
	return "<empty.filename>";
}