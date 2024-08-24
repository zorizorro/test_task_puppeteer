import puppeteer from 'puppeteer';


export class BrowserCustom {

    browser;

    remote = puppeteer

    page

    constructor(fileService) {
        this.fileService = fileService;
    }

    async launch(params = null) {
        this.browser = await this.remote.launch(params ? params : { headless: true });
        this.page = await this.browser.newPage()
    }

    async setPageOptions(ua, viewPort, ExtraHTTPHeaders) {
        await this.page.setUserAgent(ua ? ua : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
        await this.page.setViewport(viewPort ? viewPort : { width: 1920, height: 1080 });
        await this.page.setExtraHTTPHeaders(ExtraHTTPHeaders ? ExtraHTTPHeaders : {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
        });
    }

    async goto(task) {
        /*   let defaultopt = { waitUntil: 'domcontentloaded', timeout: 60000 }
          if (task.options) {
              defaultopt = {
                  ...{ waitUntil: 'domcontentloaded', timeout: 60000 },
                  ...options
              }
          } */
        await this.page.goto(task.path, { waitUntil: 'domcontentloaded', timeout: 60000 }/* options */)
    }


    async waitForSelector(task) {
        const { path } = task
        const elem = await this.page.waitForSelector(path)
        if (task.callback) {
            await task.callback(elem)
        }
    }

    async screenshot(task) {
        const { options } = task;
        await this.fileService.scheckDir()
        await this.page.screenshot({ path: `./screens/${(new Date).getTime()}.jpg`, fullPage: true });
    }

    async saveFile(task) {
        const { callback } = task
        const result = callback();
        await this.fileService.save(result)
    }

    async $$(task) {
        const { path, description, options, callback } = task
        const listElems = await this.page.$$(path)
        if (listElems && listElems.length > 0) {
            await callback(this.page, { listElems, options })
        } else throw new Error(`задача ${description} не выполнена`)
    }

    async $(task) {
        const { callback } = task;
        const elem = await this.page.$(task.path)
        if (callback) {
            await callback(this.page, elem)
        }
    }

    async wait() {
        await new Promise((res, rej) => {
            setTimeout(() => res(true), 5000)
        })
    }

    async close() {
        await this.browser.close()
    }
}