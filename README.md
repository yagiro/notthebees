# Subtitle Search Client

A Next.js application that allows users to search for subtitles using the OpenSubtitles API.

## Features

- Text-based subtitle search
- File hash-based subtitle search
- Multi-language selection
- Download links for subtitles
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- OpenSubtitles API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your OpenSubtitles API key:
   ```
   NEXT_PUBLIC_OPENSUBTITLES_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a text query or file hash in the respective input fields
2. Select one or more languages from the dropdown
3. Click the Search button
4. View the results and click on the Download link to get the subtitle file

## Getting an OpenSubtitles API Key

1. Go to [OpenSubtitles](https://www.opensubtitles.org/)
2. Create an account or sign in
3. Go to your profile settings
4. Generate an API key
5. Copy the API key and paste it in your `.env.local` file

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Headless UI
- Hero Icons
- Axios
