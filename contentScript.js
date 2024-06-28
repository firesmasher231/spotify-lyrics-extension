// const { is } = require("express/lib/request");

artist = "";
title = "";

lyricsElement = null;

// Function to fetch lyrics from the Lyrics.ovh API
let lastTitle = "";

function fetchLyrics(artist, title, callback) {
	var request = new XMLHttpRequest();

	if (lastTitle == title) {
		console.log("Same request, returning");
		return;
	}
	lastTitle = title;

	url = `https://lrclib.net/api/search?artist_name=${encodeURI(
		artist
	)}&track_name=${encodeURI(title)}`;

	console.log("request url", url);
	request.open("GET", url);

	request.onreadystatechange = function () {
		// if (this.readyState === 4) {
		// 	console.log("Status:", this.status);
		// 	console.log("Headers:", this.getAllResponseHeaders());
		// 	console.log("Body:", this.responseText);
		// }
	};

	request.send();

	request.onload = function () {
		console.log("request.status", request.status);
		if (request.status >= 200 && request.status < 400) {
			// Success status codes
			const data = JSON.parse(request.responseText)[0];
			console.log("Data:", data);
			if (data["syncedLyrics"]) {
				console.log("Lyrics found: calling back with lyrics");
				callback(null, data.syncedLyrics);
			} else {
				callback("Lyrics not found", null);
			}
		} else {
			// Error status codes
			callback("Error fetching lyrics", null);
		}
	};
}

async function displayNoneFix() {
	console.log("displayNoneFix called");
	lyricsElement = document.getElementsByClassName("_Wna90no0o0dta47Heiw");

	setTimeout(() => {
		if (lyricsElement.length > 0) {
			lyricsElement[0].style.setProperty("display", "block", "important");
		}
		try {
			for (let c of lyricsElement[0].children) {
				c.style.display = "block";
			}
		} catch (e) {
			console.log("Error while doing lyrics display fix: ", e);
		}
	}, 200);
}

let isHandlingChanges = false;

let previousTitle = "";
let previousArtist = "";

let activeLyric = null;
let activeLyric2 = null;

// Function to sync the lyrics with the song
function syncLyrics(mutationsList, observer) {
	// console.log("syncLyrics called");
	if (!lyricsElement) {
		console.log("Lyrics element not found");
		return;
	}

	const currentTime = document
		.getElementsByClassName("IPbBrI6yF4zhaizFmrg6")[0]
		.innerText.split(":");
	const seconds = parseFloat(currentTime[0]) * 60 + parseFloat(currentTime[1]);

	// Find the active lyric

	let newActiveLyric = null;

	// console.log("isModLyricsEle", isModLyricsEle[0].style.display);
	// console.log("lyricsElement", lyricsElement[0].style.display);

	for (let child of lyricsElement[0].children) {
		if (child.getAttribute("data-time") <= seconds) {
			newActiveLyric = child;
		} else {
			// console.log("breaking:" + child.innerText);
			break;
		}
	}

	// Update the active lyric
	if (activeLyric !== newActiveLyric) {
		if (activeLyric) {
			activeLyric.style.setProperty("color", "white", "important");
		}
		if (newActiveLyric) {
			// newActiveLyric.style.setProperty("color", "#fffa7e", "important");
			newActiveLyric.style.setProperty("color", "#fd4c46", "important");
			newActiveLyric.scrollIntoView({ behavior: "smooth", block: "center" });
			// newActiveLyric.style.setProperty("color", "yellow", "important");
		}
		activeLyric = newActiveLyric;
	}
}

// call syncLyrics every time the song time changes so oberve the song time element which is the div with class IPbBrI6yF4zhaizFmrg6

let songObserver = null;

function startSyncingLyrics() {
	let previousTime = "";

	let songTimeDiv = document.getElementsByClassName("gglUjikTBtMzCZFgSmpS")[0];
	let songTimeElement = document.getElementsByClassName(
		"IPbBrI6yF4zhaizFmrg6"
	)[0];

	// console.log("songTimeElement", songTimeElement);

	songObserver = new MutationObserver(() => {
		// const currentTime = songTimeElement.innerText;
		// console.log("mutation occured: ", currentTime);
		// if (currentTime !== previousTime) {
		// 	previousTime = currentTime;
		syncLyrics();
		// }
	}).observe(songTimeDiv, {
		subtree: true,
		childList: true,
		characterData: true,
	});
}

// stop observing the song time element
function stopSyncingLyrics() {
	if (songObserver) songObserver.disconnect();
}

let handleChangesLastTitle = "";

// Function to handle changes in the target node
function handleChanges(mutationsList, observer) {
	displayNoneFix();
	if (isHandlingChanges) return;

	isHandlingChanges = true;

	stopSyncingLyrics();
	startSyncingLyrics();

	const temptitles = document.getElementsByClassName("PGSe59fD1Hwc9yUM2d3U");

	if (temptitles.length > 0) {
		name = temptitles[0].innerText;

		if (name == handleChangesLastTitle) {
			return;
		}
	}

	for (let mutation of mutationsList) {
		if (mutation.type === "childList" || mutation.type === "subtree") {
			const titles = document.getElementsByClassName("PGSe59fD1Hwc9yUM2d3U");

			try {
				isModLyricsEle = document.getElementsByClassName("noOriLyricsEle");

				if (isModLyricsEle[0]) {
					isModLyricsEle[0].style.setProperty("display", "none", "important");
				}
			} catch (e) {
				console.log("Error", e);
			}

			if (titles.length > 0) {
				name = titles[0].innerText;
				artist = titles[1].innerText;
				console.log("Detected change, new text:", name);
				title = name;
				console.log("Detected change, new author:", artist);

				// Configuration object for the observer
				const config = { childList: true, subtree: true };

				try {
					noOriLyricsEle = document.getElementsByClassName(
						"vkO5F4KbLk8mbjZoy1Lf"
					);

					console.log(
						"Detected change, does spotify have lyrics:",
						noOriLyricsEle[0].innerText
					);

					if (noOriLyricsEle[0] && !isModLyricsEle[0]) {
						// ie if the lyrics div is not already created as spotify does not create it for lyrics it doesnt have
						noOriLyricsEle[0].style.setProperty("display", "none", "important");

						wrapper = document.getElementsByClassName("FUYNhisXTCmbzt9IDxnT");

						const div = document.createElement("div");
						div.setAttribute("class", "gqaWFmQeKNYnYD5gRv3x noOriLyricsEle");

						const innerDiv1 = document.createElement("div");
						innerDiv1.setAttribute("class", "_Wna90no0o0dta47Heiw");
						innerDiv1.style.setProperty(
							"--show-gradient-over-lyrics",
							"none",
							"important"
						);

						const innerDiv2 = document.createElement("div");
						innerDiv2.setAttribute("dir", "auto");
						innerDiv2.setAttribute(
							"class",
							"nw6rbs8R08fpPn7RWW2w SruqsAzX8rUtY2isUZDF"
						);
						innerDiv2.setAttribute("data-testid", "fullscreen-lyric");
						innerDiv2.style.setProperty("display", "none", "important");

						const innerDiv3 = document.createElement("div");
						innerDiv3.setAttribute("class", "BXlQFspJp_jq9SKhUSP3");

						innerDiv2.appendChild(innerDiv3);
						innerDiv1.appendChild(innerDiv2);
						innerDiv1.appendChild(innerDiv2);

						div.appendChild(innerDiv1);
						wrapper[0].appendChild(div);
					}
					if (noOriLyricsEle[0]) {
						// if spotify has lyrics
						try {
							noOriLyricsEle[0].style.setProperty(
								"display",
								"none",
								"important"
							);
							isModLyricsEle[0].style.setProperty(
								"display",
								"block",
								"important"
							);
						} catch (e) {
							console.log("Error", e);
						}
					}
				} catch (e) {
					console.log("Error", e);
				}

				try {
					lyricsElement = document.getElementsByClassName(
						"_Wna90no0o0dta47Heiw"
					);
				} catch (e) {
					console.log("Error", e);
				}

				if (!lyricsElement.length == 0) {
					// create the lyrics element if it does not exist
					overlayEle1 = document.getElementsByClassName("hS_lrRHiW4BSWL8WcE8Q");
					overlayEle2 = document.getElementsByClassName("O7ooKKJG0MArEwDgD6IV");

					try {
						overlayEle1[0].style.setProperty("display", "none", "important");
						overlayEle2[0].style.setProperty("display", "none", "important");
					} catch (e) {
						console.log("Error", e);
					}
					// set the overlay elements to none

					// change --show-gradient-over-lyrics of lyrics element to none
					lyricsElement[0].style.setProperty(
						"--show-gradient-over-lyrics",
						"none",
						"important"
					);

					// delete all the children of the lyrics element
					for (let child of lyricsElement[0].children) {
						child.style.setProperty("display", "none", "important");
					}
					// Target node to observe (assume the parent element of the titles)
					const targetNode = document.getElementsByClassName(
						"deomraqfhIAoSB3SgXpu"
					)[0]; // Adjust this to be the closest stable parent element

					// Create an instance of MutationObserver with the callback function
					const observer = new MutationObserver(handleChanges);

					// Start observing the target node with the specified configuration
					observer.observe(targetNode, config);

					// Optionally: Handle the initial state if needed
					const initialTitles = document.getElementsByClassName(
						"PGSe59fD1Hwc9yUM2d3U"
					);
					if (initialTitles.length > 0) {
						name = initialTitles[0].innerText;
						artist = initialTitles[1].innerText;
						console.log("Detected change, new text:", name);
						title = name;

						// if (title == previousTitle) return;

						if (artist != "") {
							artist = artist.split(",")[0];
						}
						console.log("Detected change, new author:", artist);
					}

					currentFullLyrics = "";

					// Fetch lyrics for the song
					fetchLyrics(artist, title, (error, lyrics) => {
						if (error) {
							if (error == "Error fetching lyrics") {
								console.log("Error fetching lyrics");
								const div = document.createElement("div");
								div.setAttribute("dir", "auto");
								div.setAttribute(
									"class",
									"nw6rbs8R08fpPn7RWW2w SruqsAzX8rUtY2isUZDF"
								);
								div.setAttribute("data-testid", "fullscreen-lyric");

								const innerDiv = document.createElement("div");
								innerDiv.setAttribute("class", "BXlQFspJp_jq9SKhUSP3");
								innerDiv.innerText = "Error fetching lyrics, sorry! :(";

								div.appendChild(innerDiv);
								lyricsElement[0].appendChild(div);
							}
							console.error(error);
						} else {
							currentFullLyrics = lyrics;

							for (let line of currentFullLyrics.split("\n")) {
								if (line.includes("Paroles de la chanson")) {
									continue;
								}

								// line looks like this   '[01:04.22] I got a lot on my mind', we need to extract the time and the lyrics
								let time = line.match(/\[(.*?)\]/);
								if (!time) {
									continue;
								}
								line = line.replace(time[0], "");
								line = line.trim();

								const div = document.createElement("div");
								div.setAttribute("dir", "auto");
								div.setAttribute(
									"class",
									"nw6rbs8R08fpPn7RWW2w SruqsAzX8rUtY2isUZDF"
								);
								div.setAttribute("data-testid", "fullscreen-lyric");

								time = time[0].replace("[", "").replace("]", "");

								let seconds = Math.floor(
									parseFloat(time.split(":")[0]) * 60 +
										parseFloat(time.split(":")[1])
								);

								// add time to the div so that it can be used to sync the lyrics, but convert from [01:04.22] to 64.22
								// div.setAttribute("data-time", time[0]);
								div.setAttribute("data-time", seconds);

								const innerDiv = document.createElement("div");
								innerDiv.setAttribute("class", "BXlQFspJp_jq9SKhUSP3");
								innerDiv.innerText = line;

								div.appendChild(innerDiv);
								lyricsElement[0].appendChild(div);
							}
						}
					});
				}
			}
		}
	}
	setTimeout(() => {
		isHandlingChanges = false;
	}, 100);
}

function main() {
	handleChanges([{ type: "childList" }], null);

	startSyncingLyrics();
}

function runScript() {
	setTimeout(() => {
		main();
	}, 500);
}

// Function to detect URL changes
function handleUrlChange() {
	const url = window.location.href;
	if (url.includes("/lyrics")) {
		console.log("Lyrics page detected");

		// runScript();
		// wait till div with class vkO5F4KbLk8mbjZoy1Lf or _Wna90no0o0dta47Heiw is loaded, then run the main function
		const interval = setInterval(() => {
			const wrapper =
				document.getElementsByClassName("zPI8TW58LMxEQDIq_GdA").length +
				document.getElementsByClassName("e7eFLioNSG5PAi1qVFT4").length;
			console.log("Checking for wrapper: ", wrapper, "elements");
			if (wrapper > 0) {
				clearInterval(interval);
				main();
			}
		}, 200);
	}
}

// Listen for URL changes
let lastUrl = location.href;
new MutationObserver(() => {
	const url = location.href;
	if (url !== lastUrl) {
		lastUrl = url;
		handleUrlChange();
	}
}).observe(document, { subtree: true, childList: true });

// Initial check

window.addEventListener("load", handleUrlChange());
// window.addEventListener("load", startObservingSongTime());
