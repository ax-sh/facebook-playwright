const chrome = require("chrome-cookies-secure");
const puppeteer = require("puppeteer");

const url = "https://www.facebook.com/";
const profile = null; //'Profile 1'
const getCookies = (callback) => {
  chrome.getCookies(
    url,
    "puppeteer",
    function (err, cookies) {
      if (err) {
        // console.log(err, "error");
        return;
      }
      // console.log(cookies, "cookies");
      callback(cookies);
    },
    profile
  ); // e.g. 'Profile 2'
};

async function getAsyncTokenFromPage(page) {
  return page.evaluate(() => {
    const data = require("DTSGInitData");
    // console.log(data,"data")
    return data;
  });
}

async function process(page) {
  await page.waitForTimeout(1000);

  const tokens = await getAsyncTokenFromPage(page);
  console.log(tokens, "<<<<<");
  // debugger;
}

getCookies(async (cookies) => {
  const headless = true;
  const devtools = !headless;
  const browser = await puppeteer.launch({
    headless,
    devtools,
  });
  try {
    const page = await browser.newPage();

    await page.setCookie(...cookies);
    await page.goto(url);
    await process(page);
  } finally {
    await browser.close();
  }
});
