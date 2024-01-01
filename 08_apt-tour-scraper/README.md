# ATP Tour Player Data Scraper
A small Node script to scrape the ATP Tour top 10 singles players.

## Installation and use
To install and use, you need [Node](https://nodejs.org/en).

From there, navigate to the project's root directory and run:
```bash
npm install
```

To use:
```bash
npm run start
```

# Technical details
The library used to faciliate the web scraping is [Puppeteer](https://pptr.dev), and it's the only dependency in this project. I initially considered using Axios/Fetch to request the webpage, then parse through the DOM to scrape the data, but I figured that for my first forray into web scraping I should take a more abstract approach.

## Future improvements
- Introduce throttling to "respectfully" scrape
- Scrape more than the top 10
