// const { is } = require("express/lib/request");

artist = "";
title = "";

lyricsElement = null;

// Function to fetch lyrics from the Lyrics.ovh API
function fetchLyrics(artist, title, callback) {
	var request = new XMLHttpRequest();

	// request.open(
	// 	"GET",
	// 	`https://api.lyrics.ovh/v1/Coldplay/Adventure%20of%20a%20Lifetime`
	// );
	url = `https://api.lyrics.ovh/v1/${encodeURI(artist)}/${encodeURI(title)}`;
	console.log("request url", url);
	request.open("GET", url);

	request.onreadystatechange = function () {
		if (this.readyState === 4) {
			console.log("Status:", this.status);
			console.log("Headers:", this.getAllResponseHeaders());
			console.log("Body:", this.responseText);
		}
	};

	request.send();

	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
			// Success status codes
			const data = JSON.parse(request.responseText);
			if (data.lyrics) {
				callback(null, data.lyrics);
			} else {
				callback("Lyrics not found", null);
			}
		} else {
			// Error status codes
			callback("Error fetching lyrics", null);
		}
	};
}

let isHandlingChanges = false;

// Function to handle changes in the target node
function handleChanges(mutationsList, observer) {
	if (isHandlingChanges) return;

	isHandlingChanges = true;

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
							// console.log("Lyrics:\n", lyrics);
							currentFullLyrics = lyrics;

							// console.log("currentFullLyrics", currentFullLyrics);

							for (let line of currentFullLyrics.split("\n")) {
								if (line.includes("Paroles de la chanson")) {
									continue;
								}

								const div = document.createElement("div");
								div.setAttribute("dir", "auto");
								div.setAttribute(
									"class",
									"nw6rbs8R08fpPn7RWW2w SruqsAzX8rUtY2isUZDF"
								);
								div.setAttribute("data-testid", "fullscreen-lyric");

								const innerDiv = document.createElement("div");
								innerDiv.setAttribute("class", "BXlQFspJp_jq9SKhUSP3");
								innerDiv.innerText = line;

								div.appendChild(innerDiv);
								lyricsElement[0].appendChild(div);

								// console.log("line", line);
							}
						}
					});
				}
			}
		}
	}
	setTimeout(() => {
		isHandlingChanges = false;
	}, 100); // 2000 milliseconds = 2 seconds
}

function main() {
	// Configuration object for the observer
	const config = { childList: true, subtree: true };

	try {
		noOriLyricsEle = document.getElementsByClassName("vkO5F4KbLk8mbjZoy1Lf");

		if (noOriLyricsEle[0]) {
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
	} catch (e) {
		console.log("Error", e);
	}

	try {
		lyricsElement = document.getElementsByClassName("_Wna90no0o0dta47Heiw");
	} catch (e) {
		console.log("Error", e);
		// return;
	}

	if (!lyricsElement.length == 0) {
		try {
			overlayEle1 = document.getElementsByClassName("hS_lrRHiW4BSWL8WcE8Q");
			overlayEle2 = document.getElementsByClassName("O7ooKKJG0MArEwDgD6IV");

			// set the overlay elements to none
			overlayEle1[0].style.setProperty("display", "none", "important");
			overlayEle2[0].style.setProperty("display", "none", "important");
		} catch (e) {
			console.log("Error", e);
		}

		// change --show-gradient-over-lyrics of lyrics element to none
		lyricsElement[0].style.setProperty(
			"--show-gradient-over-lyrics",
			"none",
			"important"
		);

		// set all the children of the lyrics element to  none, not deleteing them
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

			if (artist != "") {
				artist = artist.split(",")[0];
			}
			console.log("Detected change, new author:", artist);
		}

		currentFullLyrics = "";

		// Fetch lyrics for the song
		fetchLyrics(artist, title, (error, lyrics) => {
			if (error) {
				console.error(error);
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
			} else {
				// console.log("Lyrics:\n", lyrics);
				currentFullLyrics = lyrics;

				// console.log("currentFullLyrics", currentFullLyrics);

				for (let line of currentFullLyrics.split("\n")) {
					if (line.includes("Paroles de la chanson")) {
						continue;
					}

					const div = document.createElement("div");
					div.setAttribute("dir", "auto");
					div.setAttribute(
						"class",
						"nw6rbs8R08fpPn7RWW2w SruqsAzX8rUtY2isUZDF"
					);
					div.setAttribute("data-testid", "fullscreen-lyric");

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

// Function to convert prices on the page

function runScript() {
	console.log("ran");
	// sleep for 2 seconds
	setTimeout(() => {
		// get children of lyrics
		// console.log(lyrics[0].children);
		// get text of lyrics and print the loaded partial lyrics
		// text = lyrics[0].innerText;
		// console.log;
		// console.log("Lyrics:\n", text);

		main();
	}, 2000);
}

// Call the price conversion function when the page has finished loading
// window.addEventListener("load", runScript);

// Function to detect URL changes
function handleUrlChange() {
	const url = window.location.href;
	if (url.includes("/lyrics")) {
		console.log("Lyrics page detected");

		runScript();
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
