import { parseArgs } from "node:util";
import puppeteer from 'puppeteer';
import fs from "fs"
import path from "path"

const { positionals, values } = parseArgs({ strict: false });

(async () => {
    console.time('time')
    const [url, region] = positionals;
    console.log(`args`, url, region)
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
    await page.setUserAgent(ua);
    await page.setViewport({ width: 1920, height: 1080 });

    await page.setExtraHTTPHeaders({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
    });

    console.log(`открываю сайт`)
    const vprok = 'https://www.vprok.ru/'
    await page.goto(vprok, { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log(`сайт открыт`)

    console.log(`ищу элемент`)
    /* to do puppeteer имеет какой то свой вариант работы с xpath, разобраться */
    const sccElem = `#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_withBanner__OeajF.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > div:nth-child(3) > div.UiHeaderHorizontalBase_secondRow__7b4Lk > div > div.UiHeaderHorizontalBase_region__2ODCG`  // `//*[@class="UiHeaderHorizontalBase_region__2ODCG"]`
    const elem = await page.waitForSelector(sccElem)
    console.log(`нашел элемент`)

    console.log(`кликнул элемент`)
    await elem.click()

    /* ожидаю окна выбора региона*/
    const regionSelector = `#__next > div.Modal_root__kPoVQ.Modal_open__PaUmT > div > div > div.UiRegionListBase_root__Z4_yT > div.UiRegionListBase_listWrapper__Iqbd5`;
    await page.waitForSelector(regionSelector);

    /* получаю список  */
    console.log(`получаю список`)
    const listRegions = `#__next > div.Modal_root__kPoVQ.Modal_open__PaUmT > div > div > div.UiRegionListBase_root__Z4_yT > div.UiRegionListBase_listWrapper__Iqbd5 > ul > li`

    const items = await page.$$(listRegions); 

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const text = await page.evaluate(el => el.textContent, item);
        if (text.includes(region)) {
            await item.click();
            break;
        }
    }

    /*  нужно перейти по ссылке */
    console.log(`переход по ссылке из парметра`)
    const productUrl = url ? url : `https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202`;
    await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 60000 })


    const articulElem = `#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_title__3hOtE > div:nth-child(2) > p`;
    await page.waitForSelector(articulElem)

    console.log(`делаю скриншот`)
    await page.screenshot({ path: `./screens/${(new Date).getTime()}.jpg`, fullPage: true });


    const priceBlock = `#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_informationBlock__vDYCH > div.ProductPage_desktopBuy__cyRrC > div > div > div`;

    await page.waitForSelector(priceBlock)

    const result = []

    const currentPrice = `#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_informationBlock__vDYCH > div.ProductPage_desktopBuy__cyRrC > div > div > div > div.PriceInfo_root__GX9Xp > span`

    console.log(`ищу текущую цену`)

    let spanElement = await page.$(currentPrice)
    const spanValue = await page.evaluate(element => element.textContent, spanElement);
    result.push(spanValue)
    console.log(`текущая цена`, spanValue)


    const oldPrice = `#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_informationBlock__vDYCH > div.ProductPage_desktopBuy__cyRrC > div > div > div > div.PriceInfo_root__GX9Xp > div > span.Price_price__QzA8L.Price_size_XS__ESEhJ.Price_role_old__r1uT1`

    let oldPriceelem = await page.$(oldPrice)
    if (oldPriceelem) {
        const oldPriceelemValue = await page.evaluate(element => element.textContent, oldPriceelem);
        result.push(`старая цена: ` + oldPriceelemValue)
        console.log(`старая цена`, oldPriceelemValue)
    }

    const votes = `#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_title__3hOtE > div.ProductPage_actionsRow__KE_23 > div > div.ActionsRow_reviewsWrapper__D7I6c > a.ActionsRow_reviews__AfSj_`
    let voteselem = await page.$(votes)
    const voteselemValue = await page.evaluate(element => element.textContent, voteselem);
    result.push(voteselemValue)
    console.log(`голоса`, voteselemValue)

    const rating = `#__next > div.FeatureAppLayoutBase_layout__0HSBo.FeatureAppLayoutBase_hideBannerMobile__97CUm.FeatureAppLayoutBase_hideBannerTablet__dCMoJ.FeatureAppLayoutBase_hideBannerDesktop__gPdf1 > main > div:nth-child(3) > div > div.ProductPage_title__3hOtE > div.ProductPage_actionsRow__KE_23 > div > div.ActionsRow_reviewsWrapper__D7I6c > a.ActionsRow_stars__EKt42`;

    let ratingelem = await page.$(rating)
    if (ratingelem) {
        const ratingelemValue = await page.evaluate(element => element.title, ratingelem);
        result.push(ratingelemValue)
        console.log(`рейтинг`, ratingelemValue)
    }

    const directoryPath = './screens/';
    const fileName = `${(new Date).getTime()}.txt`;
    const fileContent = result.join(', ');
    fs.writeFile(path.join(directoryPath, fileName), fileContent, (err) => {
        if (err) {
            console.error('Произошла ошибка при создании файла:', err);
            return;
        }
        console.log('Файл успешно создан и сохранен.');
    });
    console.log('скрипт успешно завершен');
    await browser.close();
    console.timeEnd('time')

})();




