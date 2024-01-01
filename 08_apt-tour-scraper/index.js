import Puppeteer from 'puppeteer';

const getPlayers = async () => {
  const browser = await Puppeteer.launch({
    // Uncomment below to see browser instance (eg. for debugging)
    // headless: false,
    headless: 'new',
    defaultViewport: null,
  });

  const page = await browser.newPage();
  // In headless mode, we need to set user agent so that the site doesn't block the request
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  await page.goto('https://www.atptour.com/en/rankings/singles', {
    waitUntil: 'domcontentloaded',
  });

  const players = await page.evaluate(() => {
    console.log({ document });
    const playerRows = document.querySelectorAll('table.mega-table.desktop-table > tbody > tr:not(.lower-row)');
    // NOTE: The 11th row is a placeholder row that visually separates top 10 players from everyone else
    // If you want to fetch anything past top 10, you should explicitly avoid this row or handle it not having content
    const data = Array.from(playerRows)
      .slice(0, 10)
      .map((playerRow) => {
        const name = playerRow.querySelector('td.player ul.player-stats li.name span').innerText;
        const rank = playerRow.querySelector('td.rank').innerText;
        return { name, rank };
      });
    return data;
  });

  console.log(players);
  await browser.close();
};

getPlayers();
