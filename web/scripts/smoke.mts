import { chromium, type Page } from "playwright";

const BASE = "http://127.0.0.1:5173";

async function clickDefaultOk(page: Page) {
  await page
    .locator(".win-window .win-btn.default")
    .filter({ hasText: "OK" })
    .click();
}

async function clickWinBtn(page: Page, text: string) {
  await page.locator(".win-window .win-btn").filter({ hasText: text }).click();
}

async function dismissMsg(page: Page) {
  await page.waitForSelector(".msgbox");
  await page.locator(".msgbox .win-btn.default").click();
  await page.waitForSelector(".msgbox", { state: "detached" });
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
  });
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  page.setDefaultTimeout(10000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto(BASE);
  await page.waitForSelector(".desktop-icon");

  await page.getByRole("button", { name: /GoFlow/ }).dblclick();
  await page.waitForSelector("text=FLUID FLOW SIMULATION", { timeout: 6000 });

  await page
    .locator('label.win-check:has-text("outlet pressure defined") input')
    .check();
  await clickDefaultOk(page);
  await page.waitForSelector("text=Fixed Outlet Pressure Error Message");
  await dismissMsg(page);
  await page
    .locator('label.win-check:has-text("outlet pressure defined") input')
    .uncheck();

  await page.getByText("Flashed wellstream").click();
  await page.getByText("Benedict Webb Rubin").click();
  await page.waitForSelector("text=Selection of Equation of State");
  await dismissMsg(page);
  await page.getByText("Black oil correlation").click();
  await page.getByText("Redlich Kwong Soave").click();

  await clickDefaultOk(page);
  await page.waitForSelector("text=1st SECTION");
  await clickDefaultOk(page);
  await page.waitForSelector("text=AMBIENT TEMPERATURES");
  await clickDefaultOk(page);
  await page.waitForSelector("text=DISTANCE AND ELEVATION");
  await clickDefaultOk(page);
  await page.waitForSelector("text=OIL FLOW CHARACTERISTICS");
  await clickDefaultOk(page);
  await page.waitForSelector("text=PARAMETER  SENSITIVITY");
  await clickDefaultOk(page);
  await page.waitForSelector("text=Calculating");
  await page.waitForSelector("text=Run complete", { timeout: 6000 });

  await clickWinBtn(page, "Print");
  await page.waitForSelector("text=PRINT OPTIONS");
  await clickDefaultOk(page);
  if (await page.locator(".msgbox").isVisible()) {
    await dismissMsg(page);
  }
  await page.waitForSelector("text=PREVIEW OF RESULTS");
  await page.waitForSelector("text=Demosum2.flw");
  await clickWinBtn(page, "Exit");

  await clickWinBtn(page, "Graph");
  await page.getByRole("button", { name: /Live: Dist v Pressure/ }).click();
  await page.waitForSelector("text=Distance v Pressure");
  await clickWinBtn(page, "Exit");
  await clickWinBtn(page, "Exit");
  await clickWinBtn(page, "End");
  await page.waitForSelector(".desktop-icon");

  await page.getByRole("button", { name: /PrepFlow/ }).dblclick();
  await page.waitForSelector("text=FLASH SEPARATION", { timeout: 6000 });
  await clickWinBtn(page, "Graph");
  await page.waitForSelector("text=PHASE ENVELOPE");
  await clickWinBtn(page, "Exit");
  await clickWinBtn(page, "End");

  await page.getByRole("button", { name: /HeatFlow/ }).dblclick();
  await page.waitForSelector("text=CALCULATION OF OHTCs", { timeout: 6000 });
  await clickWinBtn(page, "Data");
  await page.waitForSelector("text=THERMAL CONDUCTIVITY");
  await clickWinBtn(page, "Exit");
  await clickDefaultOk(page);
  await page.waitForSelector("text=Run Number Warning");
  await dismissMsg(page);
  await page.waitForSelector("text=OHTC =");
  await clickDefaultOk(page);
  await clickWinBtn(page, "End");

  await page.getByRole("button", { name: /WellFlow/ }).dblclick();
  await page.waitForSelector("text=HORIZONTAL WELL SIMULATION", { timeout: 6000 });
  await clickDefaultOk(page);
  await page.waitForSelector("text=HORIZONTAL SECTION");
  await clickDefaultOk(page);
  await page.waitForSelector("text=HEEL PI");
  await clickDefaultOk(page);
  await clickWinBtn(page, "End");

  if (errors.length) {
    console.error("PAGE ERRORS:", errors);
    process.exit(1);
  }
  console.log("SMOKE OK");
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
