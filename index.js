const puppeteer = require("puppeteer");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");
const crxBase = path.join(__dirname, "./crx");

async function injectCode(np_token) {
    console.log("np_token", np_token)
    const result = await ejs.renderFile(path.join(__dirname, "./inject.ejs"), {
        np_token: np_token,
    });
    fs.writeFileSync(path.join(crxBase, "./inject.js"), result);
}
async function openBroswer() {
    await injectCode(process.env.np_token)
    const pathToExtension = crxBase;
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
    });
    const page = await browser.newPage()
    page.goto("chrome-extension://abkfmhgelokjichceahibpbmnhfgknjl/index.html")
}
openBroswer()