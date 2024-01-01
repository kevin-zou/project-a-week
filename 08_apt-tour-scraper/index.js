import Puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const ATP_TOUR_SITE_ROOT = 'https://www.atptour.com';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

Puppeteer.use(StealthPlugin());

async function getPlayerDetails() {
  const browser = await Puppeteer.launch({
    // Uncomment below to see browser instance (eg. for debugging)
    // headless: false,
    headless: 'new',
    defaultViewport: null,
  });

  const page = await browser.newPage();
  // In headless mode, we need to set user agent so that the site doesn't block the request
  await page.setUserAgent(USER_AGENT);
  await page.goto(`${ATP_TOUR_SITE_ROOT}/en/rankings/singles`, {
    waitUntil: 'domcontentloaded',
  });
  const playerLinks = await page.evaluate(() => {
    const playerRows = document.querySelectorAll('table.mega-table.desktop-table > tbody > tr:not(.lower-row)');
    // NOTE: The 11th row is a placeholder row that visually separates top 10 players from everyone else
    // If you want to fetch anything past top 10, you should explicitly avoid this row or handle it not having content
    const links = Array.from(playerRows)
      .slice(0, 10)
      .map((playerRow) => {
        const playerLink = playerRow.querySelector('td.player ul.player-stats li.name a').getAttribute('href');
        return playerLink;
      });
    return links;
  });

  const playerDetails = await Promise.all(
    playerLinks.map(async (link) => {
      // Get player details
      const playerPage = await browser.newPage();
      await playerPage.setUserAgent(USER_AGENT);
      await playerPage.goto(`${ATP_TOUR_SITE_ROOT}${link}`, {
        waitUntil: 'domcontentloaded',
      });
      const nameEle = await playerPage.waitForSelector('div.player_profile > div.player_name');
      const name = await nameEle.evaluate((ele) => ele.textContent.trim());
      const rankEle = await playerPage.waitForSelector('div.player_profile > div.atp_player-stats > div.stats-content > div.player-stats-details > div.stat');
      const rankText = await rankEle.evaluate((ele) => ele.textContent.trim()); // This comes back as "X Rank", so we parse the rank number
      const rank = parseInt(rankText.split(' ')[0]);
      const racketEle = await playerPage.waitForSelector('div.atp_player-equipment > div.highlights > div:nth-child(1) > a > div.content > h3');
      const racket = await racketEle.evaluate((ele) => ele.textContent.trim());
      playerPage.close();
      return { name, rank, racket };
    })
  );

  await browser.close();
  return playerDetails;
};

const data = await getPlayerDetails();
console.log(data);
