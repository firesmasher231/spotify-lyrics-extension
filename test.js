// Function to search for recordings using MusicBrainz API
async function findAlbum(title, artist) {
	try {
		// Search for recordings that match the title and artist
		const searchUrl = `https://musicbrainz.org/ws/2/recording/?query=recording:${encodeURIComponent(
			title
		)}%20AND%20artist:${encodeURIComponent(artist)}&fmt=json`;
		const searchResponse = await fetch(searchUrl);
		const searchData = await searchResponse.json();

		// Find the recording with the closest duration match
		const recordings = searchData.recordings;
		// console.log(recordings);
		const recording = recordings.find(
			(rec) =>
				// Math.abs(rec.length - duration) < 1000 &&
				!rec["releases"][0]["release-group"]["title"].includes("Apple") &&
				!rec["releases"][0]["release-group"]["title"].includes("Promo")
		);

		// console.log(
		// 	recordings.find(
		// 		(rec) => !rec["releases"][0]["release-group"]["title"].includes("Apple")
		// 	)
		// );

		// const recording = recordings[0];
		// console.log(
		// 	recording["releases"][0]["release-group"]["title"].includes("Apple")
		// );
		// console.log(recording["releases"][0]["release-group"].id);
		console.log(recording);
		if (recording) {
			// Fetch release groups (albums) for the found recording

			const releaseGroupUrl = `https://musicbrainz.org/ws/2/release-group/${recording["releases"][0]["release-group"]["id"]}?fmt=json`;
			console.log(releaseGroupUrl);
			const releaseGroupResponse = await fetch(releaseGroupUrl);
			const releaseGroupData = await releaseGroupResponse.json();

			return releaseGroupData;
		} else {
			return "No matching recording found";
		}
	} catch (error) {
		console.error("Error finding album:", error);
	}
}

// Example usage
const songTitle = "Shape of You";
const artistName = "Ed Sheeran";
const songDuration = 290000; // duration in milliseconds

findAlbum(songTitle, artistName)
	.then((album) => {
		console.log("Album found:", album);
	})
	.catch((error) => {
		console.error("Error:", error);
	});
