import { parseArgs } from "node:util";

import { Test, BrowserCustom } from "./modules/browser_module/browser.js";
import { BrowserWorker } from "./modules/browser_module/browser.worker.js";
import { FileService } from "./modules/file_module/file.service.js";
import { VprokScript } from "./modules/browser_module/scripts/vprok.script.js";

let t = new Test;
t.method();

(async function () {
   const { positionals, values } = parseArgs({ strict: false });
   const [url, region] = positionals;
   const browser = new BrowserCustom (new FileService);   
   const browserWorker = new BrowserWorker (browser, new VprokScript (url, region));
   await browserWorker.perform();
})();
