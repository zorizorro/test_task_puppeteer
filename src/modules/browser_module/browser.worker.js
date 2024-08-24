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

    async closeBrowser() {
        await this.browser.close()
    }

    async perform() {
        await this.launchBrowser();
        const script = this.script.getScript();
        for (let i = 0; i < script.length; ++i) {
            let task = script[i]
            const method = task.method;
            if (!(method in this.browser)) throw new Error(`свойство ${method} отсутствует в классе браузера`);

            try {
                console.log(`__________-start________________`)
                if (task.description) console.log(task.description);
                await this.browser[method](task)
                console.log(`__________-fin________________`)
                
            } catch (err) {
                console.log(`ошибка`,err)
                if (task.retry && task.retry > 0) {
                    /* перезапуск задачи  */
                    --i
                }
                throw err
            }

        }

        await this.closeBrowser()

    }


}