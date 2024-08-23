import puppeteer from 'puppeteer';


export class BrowserCustom {

    browser = puppeteer;
    
    remote = puppeteer

    constructor( fileService) {
        this.fileService = fileService;
    }

    async launch(params = null) {
        await this.remote.launch(params ? params  :{ headless: true } );
        await this.remote.newPage()
    }

   /*  async newPage(task) {
        await this.remote.newPage()
    } */

    async setPageOptions(ua, viewPort, ExtraHTTPHeaders) {
        await this.remote.setUserAgent(ua ? ua : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
        await this.remote.setViewport(viewPort ? viewPort : { width: 1920, height: 1080 });

        await this.remote.setExtraHTTPHeaders(ExtraHTTPHeaders ? ExtraHTTPHeaders : {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
        });
    }

    async goto(task) {
        let defaultopt = { waitUntil: 'domcontentloaded', timeout: 60000 }
        if (task.options) {
            defaultopt = {
                ...{ waitUntil: 'domcontentloaded', timeout: 60000 },
                ...options
            }
        }
        await this.remote.goto(path, options)
    }


    async waitForSelector(task) {
        const { path } = task
        const elem = await this.waitForSelector(path)
        if (task.callback) {
            await task.callback(elem)
        }
    }

    async screenshot(task) {
        const {options} = task;
        await pathis.remote.screenshot({ path: options.path });
    }

    async savFile(task) {
        const {callback } = task
        const result = callback();
        this.fileService.savFile(result)
    }

    async $$(task) {
        const { path, description, options, callback } = task
        const listElems = await this.remote.$$(path)
        if (listElems && listElems.length > 0) {
            await callback(options)
        } else throw new Error(`задача ${description} не выполнена`)
    }

    async $(task){
        const {callback} = task;
        const elem = await this.remote.$(task.path)
        if(callback){
            callback(elem)
        }
    }

    async close(){
        await this.remote.close()
    }
}


export class Test{
        method(){
            console.log(`heloo`)
        }
}