// Parcours automatisé de la maquette : les 10 missions, sans erreur JavaScript ni défilement horizontal.
// Lancer : npm test (Chromium de Playwright) ou CHROMIUM_PATH=/chemin/vers/chrome npm test
import { chromium } from "@playwright/test";

const page_url = new URL("../maquette/index.html", import.meta.url).href;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const errors = [];
let ok = true;

for (const [name, viewport] of [["ordinateur", { width: 1366, height: 860 }], ["téléphone", { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${name} : ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`${name} (console) : ${m.text()}`));
  await page.goto(page_url);
  await page.waitForTimeout(800);
  if (name === "ordinateur") {
    const info = page.locator("#infoBody"), modal = page.locator("#modal"), objects = page.locator("#objects");
    const go = async (room) => { await page.getByRole("button", { name: "Navigateur" }).click(); await modal.getByRole("button", { name: room }).click(); await page.waitForTimeout(300); };
    await page.getByRole("button", { name: /Ma main/ }).click();
    await modal.getByRole("button", { name: "Poser sur mon bureau" }).first().click();
    await info.getByRole("button", { name: "Terminer" }).first().click();
    await page.getByRole("button", { name: /Ma main/ }).click();
    await modal.getByRole("button", { name: "Passer à…" }).first().click();
    await page.locator("#cSend").click();
    await objects.getByRole("button", { name: "Mur à post-it" }).click();
    await info.getByRole("button", { name: "Je prends" }).first().click();
    await go(/Hall clients/);
    await objects.getByRole("button", { name: /Atelier Brume/ }).click();
    await info.getByRole("button", { name: /Relancer/ }).click();
    await objects.getByRole("button", { name: /Galerie Opale sonne/ }).click();
    await info.getByRole("button", { name: /Faire entrer/ }).first().click();
    await go(/Salle commune/);
    await objects.getByRole("button", { name: "Cartons sans responsable" }).click();
    await info.getByRole("button", { name: "Je prends" }).first().click();
    await page.locator("#chatKind").selectOption("bloque");
    await page.locator("#chat").getByRole("button", { name: "Dire" }).click();
    await page.locator("#presence").getByRole("button", { name: /Charles/ }).click();
    await objects.getByRole("button", { name: "Charge de la semaine" }).click();
    await info.getByRole("button", { name: "Je la reprends" }).first().click();
    await go(/Campagne printemps/);
    const done = await page.locator("#missions .mission.ok").count();
    const total = await page.locator("#missions .mission").count();
    console.log(`Missions : ${done}/${total}`);
    if (done !== total) ok = false;
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(`${name} : débordement horizontal ${overflow} px`);
  if (overflow > 1) ok = false;
  await ctx.close();
}
await browser.close();
if (errors.length) { console.error(errors.join("\n")); ok = false; }
console.log(ok ? "Parcours réussi." : "Parcours en échec.");
process.exit(ok ? 0 : 1);
