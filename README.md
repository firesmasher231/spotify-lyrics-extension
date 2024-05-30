# 🎵 Spotify Lyrics Returner 🎵

Welcome to **Spotify Lyrics Returner** – the ultimate tool to bring back lyrics to your Spotify web player for free! 🎤✨

## About the Project

Spotify put the lyrics behind a paywall, my friend still wanted access to those sweet lyrics. The result? This spaghetti-o code that just about works.

Entire thing was coded in about two hours so apologies for the mess of the code :P

(and yes this readme is chatgpt generated)

Before:

<img src="https://github.com/firesmasher231/spotify-lyrics/assets/66473811/f06a5e58-7143-412e-93c5-8f2917f88af2" alt="drawing" width="400"/>

After:

<img src="https://github.com/firesmasher231/spotify-lyrics/assets/66473811/8efddca2-abe0-4503-88eb-5a0c5ab06143" alt="drawing" width="400"/>



## Features

- **🎶 Fetch Lyrics**: Automatically fetches lyrics for the currently playing song.
- **🔄 Real-time Updates**: Updates lyrics as you navigate through your playlist.

## Installation

### Prerequisites

- Any Chromium based browser

### Steps

1. **Download the Extension**:

   - Get the latest `.crx` file from the [Releases](https://github.com/your-username/spotify-lyrics-returner/releases) section.

2. **Enable Developer Mode in your browser**:

   - Go to `{YOUR BROWSER HERE}://extensions/` and toggle the "Developer mode" switch on the top right. (Replace `{YOUR BROWSER HERE}` with `chrome`, `edge`, `opera`, etc.)

3. **Install the Extension**:

   - Drag and drop the downloaded `.crx` file onto the Extensions page.
   - Confirm the installation by clicking "Add extension".

4. **Enjoy Your Lyrics**:
   - Open Spotify in your browser and navigate to the lyrics page. The extension will automatically fetch and display the lyrics for the current song.

## How It Works

This extension uses a content script to detect changes on the Spotify web player. When a song with no native lyrics is played or a song is played but , it fetches the lyrics from the Lyrics.ovh API and displays them in a customized overlay.

## Development

### Getting Started

Clone the repository:

```sh
git clone https://github.com/your-username/spotify-lyrics-returner.git
cd spotify-lyrics-returner
```
