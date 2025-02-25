
const state = {
	currentSong: {
		artist: "",
		title: "",
	},
	isProcessing: false,
	observer: null,
	retryAttempts: 0,
	maxRetries: 3,
	retryTimeout: null,
	currentTime: 0,
	duration: 0,
	timestamps: [],
	updateInterval: null,
};

const SPOTIFY_SELECTORS = {
	TITLES: "PGSe59fD1Hwc9yUM2d3U",
	NO_LYRICS_NOTICE: "vkO5F4KbLk8mbjZoy1Lf",
	NO_LYRICS_MESSAGE: "rEN7ncpaUeSGL9z0RCQD",
	LYRICS_WRAPPER: "FUYNhisXTCmbzt9IDxnT",
	LYRICS_CONTAINER: "_Wna90no0o0dta47Heiw",
	SONG_CHANGE_CONTAINER: "deomraqfhIAoSB3SgXpu",
	OVERLAY_ELEMENTS: ["hS_lrRHiW4BSWL8WcE8Q", "O7ooKKJG0MArEwDgD6IV"],
	PROGRESS_BAR: "playback-progressbar",
	PLAYER_CONTROLS: "player-controls",
	CURRENT_TIME: "playback-position",
	DURATION: "playback-duration",
	SYNCED_LYRICS: '[data-testid="fullscreen-lyric"]',
	LYRICS_TIMING: '[data-testid="progress-bar"]',
};

// print functions
const logger = {
	log: (...args) => console.log("[Spotify Lyrics]:", ...args),
	error: (...args) => console.error("[Spotify Lyrics Error]:", ...args),
};

async function fetchLyrics(artist, title) {
	try {
		if (!artist || !title) {
			logger.error("Missing artist or title");
			return null;
		}

		// this ver get the first artist only
		const mainArtist = artist.split(/[,&]|feat\.?|ft\.?|featuring/i)[0].trim();
		logger.log("Using main artist:", mainArtist);

		// 
		const cleanForUrl = (text) => {
			return (
				text
					.trim()
					.toLowerCase()
					// Remove featuring
					.replace(/\s*[\(\[](feat|ft|featuring).+?[\)\]]/gi, "")
					.replace(/\s*-\s*(feat|ft|featuring).+$/gi, "")
					// Remove anything in parentheses or brackets
					.replace(/[\(\[].+?[\)\]]/g, "")
					// Remove special characters but keep apostrophes
					.replace(/[^a-z0-9\s'-]/g, "")
					// Clean up any leftover dashes or spaces
					.replace(/\s+/g, "-")
					.replace(/-+/g, "-")
					.trim()
			);
		};

		// Try multiple combinations of artist and title
		const attempts = [
			// First attempt: Clean both artist and title
			{
				artist: cleanForUrl(mainArtist),
				title: cleanForUrl(title),
			},
			// Second attempt: Just the main title (before any dash)
			{
				artist: cleanForUrl(mainArtist),
				title: cleanForUrl(title.split("-")[0]),
			},
			// Third attempt: Remove everything after feat/ft
			{
				artist: cleanForUrl(mainArtist),
				title: cleanForUrl(title.replace(/\s*(feat|ft|featuring).+$/i, "")),
			},
			// Fourth attempt: Just the first word of the title
			{
				artist: cleanForUrl(mainArtist),
				title: title.split(" ")[0].toLowerCase(),
			},
		];

		logger.log("Will try these combinations:", attempts);

		// Try each combination
		for (const attempt of attempts) {
			try {
				const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(
					attempt.artist
				)}/${encodeURIComponent(attempt.title)}`;

				logger.log("Attempting to fetch lyrics from:", url);

				const response = await fetch(url);
				if (response.ok) {
					const data = await response.json();
					if (data.lyrics) {
						logger.log("Found lyrics with combination:", attempt);
						return data.lyrics;
					}
				}
			} catch (e) {
				logger.error("Failed attempt:", attempt, e);
				continue; // Try next combination
			}
		}

		// If we get here, none of the attempts worked
		throw new Error("Could not find lyrics with any combination");
	} catch (error) {
		logger.error("Failed to fetch lyrics:", error);
		return null;
	}
}

// DOM manipulation functions
function createLyricsElement(lyrics) {
	const container = document.createElement("div");
	container.className = "gqaWFmQeKNYnYD5gRv3x custom-lyrics-container";

	const content = document.createElement("div");
	content.className = SPOTIFY_SELECTORS.LYRICS_CONTAINER;
	content.style.setProperty("--show-gradient-over-lyrics", "none", "important");

	if (!lyrics) {
		const errorDiv = document.createElement("div");
		errorDiv.className = "lyrics-error";
		errorDiv.textContent = "Could not find lyrics for this song 😢";
		content.appendChild(errorDiv);
	} else {
		// Try to get synced lyrics from Spotify first
		const syncedLyrics = document.querySelectorAll(
			SPOTIFY_SELECTORS.SYNCED_LYRICS
		);
		const hasSyncedTimings = syncedLyrics.length > 0;

		// Reset timestamps array
		state.timestamps = [];

		// Parse lyrics and timestamps
		lyrics.split("\n").forEach((line, index) => {
			if (line.includes("Paroles de la chanson")) return;

			const lineDiv = document.createElement("div");
			lineDiv.className =
				"nw6rbs8R08fpPn7RWW2w SruqsAzX8rUtY2isUZDF lyrics-line unplayed";
			lineDiv.setAttribute("data-testid", "fullscreen-lyric");

			// Try to get actual timestamp from Spotify's synced lyrics
			let timestamp;
			if (hasSyncedTimings && syncedLyrics[index]) {
				const timing = syncedLyrics[index].getAttribute("data-timing");
				if (timing) {
					timestamp = formatTime(Math.floor(parseFloat(timing) / 1000));
				}
			}

			// Fallback to estimated timestamp if no synced timing available
			if (!timestamp) {
				timestamp = formatTime(
					Math.floor((index / lyrics.split("\n").length) * state.duration)
				);
			}

			state.timestamps.push(timestamp);
			lineDiv.setAttribute("data-timestamp", timestamp);

			const timestampSpan = document.createElement("span");
			timestampSpan.className = "lyrics-timestamp";
			timestampSpan.textContent = timestamp;

			const textDiv = document.createElement("div");
			textDiv.className = "BXlQFspJp_jq9SKhUSP3";
			textDiv.textContent = line;

			lineDiv.appendChild(timestampSpan);
			lineDiv.appendChild(textDiv);

			// Add click handler with improved seeking
			lineDiv.addEventListener("click", async () => {
				const time = parseTimestamp(timestamp);
				await seekToTime(time);
				// Highlight the clicked line immediately
				document
					.querySelectorAll(".lyrics-line.current")
					.forEach((el) => el.classList.remove("current"));
				lineDiv.classList.add("current");
			});

			content.appendChild(lineDiv);
		});

		// Start tracking time
		startTimeTracking();
	}

	container.appendChild(content);
	return container;
}

function hideSpotifyElements() {
	const elementsToHide = [
		SPOTIFY_SELECTORS.NO_LYRICS_NOTICE,
		SPOTIFY_SELECTORS.NO_LYRICS_MESSAGE,
		...SPOTIFY_SELECTORS.OVERLAY_ELEMENTS,
	];

	elementsToHide.forEach((className) => {
		const elements = document.getElementsByClassName(className);
		Array.from(elements).forEach((element) => {
			element.style.setProperty("display", "none", "important");
		});
	});
}

// Core functionality
async function updateLyrics(artist, title) {
	if (!artist || !title) return;

	state.isProcessing = true;

	try {
		// Clean up existing custom lyrics
		const existingLyrics = document.getElementsByClassName(
			"custom-lyrics-container"
		);
		Array.from(existingLyrics).forEach((elem) => elem.remove());

		// Hide Spotify elements
		hideSpotifyElements();

		// Fetch and display new lyrics
		const lyrics = await fetchLyrics(artist, title);
		const lyricsElement = createLyricsElement(lyrics);

		const wrapper = document.getElementsByClassName(
			SPOTIFY_SELECTORS.LYRICS_WRAPPER
		)[0];
		if (wrapper) {
			wrapper.appendChild(lyricsElement);
		}
	} catch (error) {
		logger.error("Error updating lyrics:", error);
	} finally {
		state.isProcessing = false;
	}
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleSongChange(mutationsList) {
	if (state.isProcessing) return;

	try {
		state.isProcessing = true;

		// Clear any pending retry
		if (state.retryTimeout) {
			clearTimeout(state.retryTimeout);
			state.retryTimeout = null;
		}

		const titles = document.getElementsByClassName(SPOTIFY_SELECTORS.TITLES);
		const noLyricsMessage = document.getElementsByClassName(
			SPOTIFY_SELECTORS.NO_LYRICS_MESSAGE
		);

		// Wait briefly for Spotify's UI to stabilize
		await delay(100);

		// Update the cleanText function for better text cleaning
		const cleanText = (text) => {
			return text
				.trim()
				.replace(/\n/g, "") // Remove newlines
				.replace(/\s*[\(\[](feat|ft|featuring).+?[\)\]]/gi, "") // Remove featuring in parentheses
				.replace(/\s*-\s*(feat|ft|featuring).+$/gi, "") // Remove featuring after dash
				.replace(/\s*\(.+?\)/g, "") // Remove anything in parentheses
				.replace(/\s*\[.+?\]/g, "") // Remove anything in brackets
				.replace(/\s+/g, " ") // Normalize spaces
				.trim();
		};

		// If we don't have titles yet but haven't exceeded retry attempts
		if (titles.length < 2 && state.retryAttempts < state.maxRetries) {
			state.retryAttempts++;
			logger.log(`Retry attempt ${state.retryAttempts}/${state.maxRetries}`);

			state.retryTimeout = setTimeout(() => {
				state.isProcessing = false;
				handleSongChange(mutationsList);
			}, 500 * state.retryAttempts);

			return;
		}

		// Reset retry counter if we have titles
		if (titles.length >= 2) {
			state.retryAttempts = 0;
		}

		// Handle no-lyrics message
		if (noLyricsMessage.length > 0 && titles.length >= 2) {
			const newTitle = cleanText(titles[0].innerText);
			const newArtist = cleanText(titles[1].innerText);

			logger.log(
				"No lyrics detected, attempting to fetch for:",
				newTitle,
				"by",
				newArtist
			);
			await updateLyrics(newArtist, newTitle);
			return;
		}

		// Regular song change detection
		if (titles.length >= 2) {
			const newTitle = cleanText(titles[0].innerText);
			const newArtist = cleanText(titles[1].innerText);

			if (
				newTitle !== state.currentSong.title ||
				newArtist !== state.currentSong.artist
			) {
				state.currentSong.title = newTitle;
				state.currentSong.artist = newArtist;

				logger.log("Song changed:", { title: newTitle, artist: newArtist });
				await updateLyrics(newArtist, newTitle);
			}
		}
	} catch (error) {
		logger.error("Error in handleSongChange:", error);
	} finally {
		state.isProcessing = false;
	}
}

function setupObserver() {
	if (state.observer) {
		state.observer.disconnect();
	}

	// Watch multiple containers for changes
	const targetNodes = [
		document.getElementsByClassName(SPOTIFY_SELECTORS.SONG_CHANGE_CONTAINER)[0],
		document.getElementsByClassName(SPOTIFY_SELECTORS.LYRICS_WRAPPER)[0],
		document.getElementsByClassName(SPOTIFY_SELECTORS.NO_LYRICS_NOTICE)[0],
		document.querySelector('[data-testid="lyrics-content"]'), // Add this new selector
	].filter(Boolean);

	if (targetNodes.length === 0) {
		// Retry setup if no nodes found
		setTimeout(setupObserver, 1000);
		return;
	}

	state.observer = new MutationObserver(handleSongChange);

	targetNodes.forEach((node) => {
		state.observer.observe(node, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
		});
	});

	logger.log("Observer setup complete on", targetNodes.length, "nodes");
}

// Initialize extension
async function initialize() {
	logger.log("Initializing extension");

	// Clear any existing state
	if (state.observer) {
		state.observer.disconnect();
	}
	state.isProcessing = false;
	state.retryAttempts = 0;

	// Wait for Spotify to fully load
	await delay(1000);

	// Handle initial state
	const titles = document.getElementsByClassName(SPOTIFY_SELECTORS.TITLES);
	if (titles.length >= 2) {
		state.currentSong.title = titles[0].innerText;
		// Get first artist only
		state.currentSong.artist = titles[1].innerText
			.split(/[,&]|feat\.?|ft\.?|featuring/i)[0]
			.trim();
		await updateLyrics(state.currentSong.artist, state.currentSong.title);
	}

	setupObserver();

	// Inject styles
	injectStyles();
}

// URL change detection
function handleUrlChange() {
	const url = window.location.href;
	if (url.includes("/lyrics")) {
		logger.log("Lyrics page detected");
		setTimeout(initialize, 1000); // Wait for page to load
	}
}

// Setup URL change listener
let lastUrl = location.href;
new MutationObserver(() => {
	const url = location.href;
	if (url !== lastUrl) {
		lastUrl = url;
		handleUrlChange();
	}
}).observe(document, { subtree: true, childList: true });

// Initial check
window.addEventListener("load", handleUrlChange);

// Add new styles to the document
function injectStyles() {
	const styles = `
		.lyrics-line {
			cursor: pointer;
			transition: opacity 0.3s ease;
			opacity: 0.5;
		}
		.lyrics-line:hover {
			opacity: 1 !important;
		}
		.lyrics-line.played {
			opacity: 1;
		}
		.lyrics-line.current {
			opacity: 1;
			font-weight: bold;
		}
		.lyrics-line.unplayed {
			opacity: 0.5;
		}
		.lyrics-timestamp {
			display: none;
			color: #b3b3b3;
			font-size: 0.8em;
			margin-right: 8px;
		}
		.lyrics-line:hover .lyrics-timestamp {
			display: inline;
		}
	`;

	const styleSheet = document.createElement("style");
	styleSheet.textContent = styles;
	document.head.appendChild(styleSheet);
}

// Function to parse timestamp from Spotify's format
function parseTimestamp(timestamp) {
	const [mins, secs] = timestamp.split(":");
	return parseInt(mins) * 60 + parseInt(secs);
}

// Function to format seconds to MM:SS
function formatTime(seconds) {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Function to seek to specific time
async function seekToTime(time) {
	const progressBar = document.querySelector(
		`[data-testid="${SPOTIFY_SELECTORS.PROGRESS_BAR}"]`
	);
	if (!progressBar) return;

	try {
		const percent = (time / state.duration) * 100;

		// Create and dispatch mouse events for better interaction
		const rect = progressBar.getBoundingClientRect();
		const x = rect.left + rect.width * (percent / 100);
		const y = rect.top + rect.height / 2;

		// Mouse down event
		progressBar.dispatchEvent(
			new MouseEvent("mousedown", {
				bubbles: true,
				cancelable: true,
				clientX: x,
				clientY: y,
			})
		);

		// Small delay to simulate click
		await delay(50);

		// Mouse up event
		progressBar.dispatchEvent(
			new MouseEvent("mouseup", {
				bubbles: true,
				cancelable: true,
				clientX: x,
				clientY: y,
			})
		);

		// Update the current time immediately
		state.currentTime = time;
		updateLyricsHighlight();
	} catch (error) {
		logger.error("Error seeking to time:", error);
	}
}

// Function to update lyrics highlighting
function updateLyricsHighlight() {
	const currentTime = state.currentTime;
	let currentIndex = -1;

	state.timestamps.forEach((timestamp, index) => {
		const line = document.querySelector(`[data-timestamp="${timestamp}"]`);
		if (!line) return;

		if (parseTimestamp(timestamp) <= currentTime) {
			line.classList.add("played");
			line.classList.remove("unplayed");
			currentIndex = index;
		} else {
			line.classList.remove("played");
			line.classList.add("unplayed");
		}
	});

	// Update current line highlight
	document
		.querySelectorAll(".lyrics-line.current")
		.forEach((el) => el.classList.remove("current"));
	if (currentIndex >= 0) {
		const currentLine = document.querySelector(
			`[data-timestamp="${state.timestamps[currentIndex]}"]`
		);
		if (currentLine) currentLine.classList.add("current");
	}
}

// Function to start time tracking
function startTimeTracking() {
	if (state.updateInterval) {
		clearInterval(state.updateInterval);
	}

	state.updateInterval = setInterval(() => {
		const timeElement = document.querySelector(
			`[data-testid="${SPOTIFY_SELECTORS.CURRENT_TIME}"]`
		);
		const durationElement = document.querySelector(
			`[data-testid="${SPOTIFY_SELECTORS.DURATION}"]`
		);

		if (timeElement && durationElement) {
			state.currentTime = parseTimestamp(timeElement.textContent);
			state.duration = parseTimestamp(durationElement.textContent);
			updateLyricsHighlight();
		}
	}, 100);
}
