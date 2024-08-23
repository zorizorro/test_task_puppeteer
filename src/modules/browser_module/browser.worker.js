export class BrowserWorker {

    browser
    script

    constructor(browser, script) {
        this.browser = browser 
        this.script = script 
    }


    async launchBrowser() {
        await this.browser.launch(this.script.getLaunchParams())
        await this.setPageOptions()
    }

    async setPageOptions() {
        const { ua, viewPort, ExtraHTTPHeaders } = this.script.getPageOptions()
        await this.browser.setPageOptions(ua, viewPort, ExtraHTTPHeaders)
    }

    async closeBrowser(){
        await this.browser.cloes()
    }

    async perform() {

        await this.launchBrowser();

        for (let i = 0; i < this.script.length; ++i) {
            let task = this.script[i]
            const method = task.method;
            if (!(method in this.browser)) throw new Error(`свойство ${method} отсутсвует в классе браузера`);

            try {
                if (task.description) console.log(task.description);
                await this.browser[method](task)
            } catch (err) {
                /* если ошибка - какие то действия */
                if (task.retry && task.retry > 0) {
                    /* перезапуск задачи  */
                    --i
                }
            }

        }

        await this.closeBrowser()

    }


}