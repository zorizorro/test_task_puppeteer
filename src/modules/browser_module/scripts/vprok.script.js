export class VprokScript {

    result = []

    constructor( url, region ) {
        this.url = url;
        this.region = region;
     }

    getLaunchParams(){
        return { headless: false }
    }

    getPageOptions() {
        return {
            ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
            viewPort: { width: 1920, height: 1080 },
            ExtraHTTPHeaders: { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' }
        }
    }

    script() {
        [
            {
                path: "https://www.vprok.ru/",
                method: "goto",
                description: "переход на основную страницу vprok.ru",
                options: {},
                retry: 0

            },
            {
                path: "#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_withBanner__OeajF.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > div:nth-child(3) > div.UiHeaderHorizontalBase_secondRow__7b4Lk > div > div.UiHeaderHorizontalBase_region__2ODCG",
                method: "waitForSelector",
                description: "Ищем кнопку выбора региона",
                callback: async (foundedElem) => {
                    console.log(`кликаю на кнопку выбора региона `)
                    await foundedElem.click()
                }

            },
            {
                path: "#__next > div.Modal_root__kPoVQ.Modal_open__PaUmT > div > div > div.UiRegionListBase_root__Z4_yT > div.UiRegionListBase_listWrapper__Iqbd5",
                method: "waitForSelector",
                description: "ожидаю модальное окно выбора региона",
            },
            {
                path: `#__next > div.Modal_root__kPoVQ.Modal_open__PaUmT > div > div > div.UiRegionListBase_root__Z4_yT > div.UiRegionListBase_listWrapper__Iqbd5 > ul > li`,
                method: "$$",
                description: "получаю список регионов из отображенного в модальном окне",
                options: {
                    region: this.region // 'Владимирская обл.' /* хардкод */
                },
                callback: async (opt) => {
                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        const text = await page.evaluate(el => el.textContent, item);
                        if (text.includes(opt.region)) {
                            await item.click();
                            break;
                        }
                    }
                },
            },
            {
                /* целевую страницу нужно передавать в скрипт! */
                path: this.url, //"https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202", /* хардкод */
                method: "goto",
                description: "переход на целевую страницу vprok.ru",
                options: {},
                retry: 0
            },
            {
                path: "#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_title__3hOtE > div:nth-child(2) > p",
                method: "waitForSelector",
                description: "Ожидаю отрисовки DOM после перехода",
            },
            {
                path: "",
                method: "screenshot",
                description: "Делаю скриншот полной страницы продукта",
                options: { path: `./screens/${(new Date).getTime()}.jpg` },
                retry: 0
            },
            {
                path: "`#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_informationBlock__vDYCH > div.ProductPage_desktopBuy__cyRrC > div > div > div`",
                method: "waitForSelector",
                description: "Жду элемент артикул ?",
            },
            {
                path: `#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_informationBlock__vDYCH > div.ProductPage_desktopBuy__cyRrC > div > div > div > div.PriceInfo_root__GX9Xp > span`,
                method: "$",
                description: "Ищу текущую цену",
                options: {},
                callback: async (element) => {
                    const spanValue = await page.evaluate(element => element.textContent, spanElement);
                    console.log(`текущая цена`, spanValue)
                    /**тут нужно this получить из класса скрипта */
                    this.result.push(spanValue)
                },
                retry: 0
            },
            {
                path: "#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_informationBlock__vDYCH > div.ProductPage_desktopBuy__cyRrC > div > div > div > div.PriceInfo_root__GX9Xp > div > span.Price_price__QzA8L.Price_size_XS__ESEhJ.Price_role_old__r1uT1",
                method: "$",
                description: "Получить цену без скидки",
                options: {},
                callback: async (element) => {
                    if (element) {
                        const spanValue = await page.evaluate(element => element.textContent, spanElement);
                        console.log(`старая цена`, spanValue)
                        this.result.push(spanValue)
                    }
                },
            },
            {
                path: "#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_title__3hOtE > div.ProductPage_actionsRow__KE_23 > div > div.ActionsRow_reviewsWrapper__D7I6c > a.ActionsRow_reviews__AfSj_",
                method: "$",
                description: "Получить голоса",
                options: {},
                callback: async (element) => {
                    if (element) {
                        const spanValue = await page.evaluate(element => element.textContent, spanElement);
                        console.log(`голоса`, spanValue)
                        this.result.push(spanValue)
                    }
                },
            },
            {
                path: `#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_title__3hOtE > div.ProductPage_actionsRow__KE_23 > div > div.ActionsRow_reviewsWrapper__D7I6c > a.ActionsRow_stars__EKt42`,
                method: "$",
                description: "Получить рейтинг",
                options: {},
                callback: async (element) => {
                    if (element) {
                        const spanValue = await page.evaluate(element => element.textContent, spanElement);
                        console.log(`рейтинг`, spanValue)
                        this.result.push(spanValue)
                    }
                },
            },

            {
                method: "saveFile",
                description: "сохранить файл",
                options: {},
                callback: () => {
                    return this.result
                },
                retry: 0
            },

        ]
    }

}