import puppeteer from 'puppeteer-core'
import { getOptions } from './chromeOptions'



const scrollPageToBottom = require('puppeteer-autoscroll-down');


type Filter = {
  carDscript: string,
  make: string,
  model: string,
  year: string,
  version: string,
  state: string
}


async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise<void>((resolve, reject) => {
          // window.scroll(0, document.body.scrollHeight-(document.body.scrollHeight*30/100));
          // console.log(document.body.scrollHeight)
          // console.log(document.body.scrollHeight*30/100)
          // resolve();
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight-(document.body.scrollHeight*30/100);
              window.scrollBy(0, 100);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });
}


async function getOlx( filters: Filter, isDev: boolean ){
  const options = await getOptions(isDev)
  const browser = await puppeteer.launch(options)

  const page = await browser.newPage()
  // await page.setViewport({
  //   width: 1800,
  //   height: 800
  // });

  const url = `https://${(filters.state) ? filters.state : 'www' }.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios/${filters.year}?q=${filters.carDscript}`
  await page.goto(url);

  await page.waitForSelector('#ad-list')

  await page.waitForTimeout(1000);

  const scrollStep = 30 // default
  const scrollDelay = 3 // default
  const lastPosition = await scrollPageToBottom(page, scrollStep, scrollDelay)

  const pageData = await page.evaluate(() => {
    const nodeList = document.querySelectorAll('#ad-list > li > a');

    const cars = []
    Array.from(nodeList).forEach((card) => {
      if (card.querySelector('div > div.fnmrjs-3.eJTbMD > div > div > h2') != null && (card.querySelector('div > div.fnmrjs-3.eJTbMD > div > div > h2') as HTMLElement).innerText != "" &&
          (card.querySelector('div > div.fnmrjs-3.eJTbMD > div > div:nth-child(2) > div > p') as HTMLElement) != null
      ){
        const region = (card.querySelector('div > div.fnmrjs-2.jiSLYe > div.fnmrjs-5.lgAcUq > div:nth-child(1) > div > span') != null) ? (card.querySelector('div > div.fnmrjs-2.jiSLYe > div.fnmrjs-5.lgAcUq > div:nth-child(1) > div > span') as HTMLElement).innerText : ''
        const obj = {
          _id: String(card.getAttribute('data-lurker_list_id')),
          href: String(card['href']),
          origin: 'OLX',
          name: (card.querySelector('div > div.fnmrjs-3.eJTbMD > div > div > h2') as HTMLElement).innerText,
          price: (card.querySelector('div > div.fnmrjs-3.eJTbMD > div > div:nth-child(2) > div > p') as HTMLElement).innerText.replace(/[^\d]/g, '').trim(),
          img: card.getElementsByTagName('img')[0].getAttribute('src').replace('thumbs256x256', 'images'),
          region: region,
          state: region.split('-')[1].trim(),
          city: region.split('-')[0].trim(),
          detail: (card.querySelector('div > div.fnmrjs-2.jiSLYe > div.fnmrjs-4.jflPgo > div.fnmrjs-6.iNpuEh > div:nth-child(3) > span') != null) ? (card.querySelector('div > div.fnmrjs-2.jiSLYe > div.fnmrjs-4.jflPgo > div.fnmrjs-6.iNpuEh > div:nth-child(3) > span') as HTMLElement).innerText : '',
          percent: 0
        }
        obj.price = obj.price.replace(/[^\d]/g, '').trim()

        cars.push(obj)
      }
    })

    return cars;
  })

  await page.close();
  await browser.close();

  return pageData;
}


// async function getFacebook( filters: Filter, isDev: boolean ){
//   const options = await getOptions(isDev)
//   const browser = await puppeteer.launch(options)

//   const page = await browser.newPage()
//   // await page.setViewport({
//   //   width: 1800,
//   //   height: 800
//   // });

//   const url = `https://www.facebook.com/marketplace/category/search/?query=${filters.carDscript} ${(filters.state && filters.state != null) ? filters.state : ''}`
//   await page.goto(url);

//   //await page.waitForSelector('body > div:nth-child(2) > div > div:nth-child(1) > div > div.rq0escxv.l9j0dhe7.du4w35lb > div > div > div.j83agx80.cbu4d94t.d6urw2fd.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.pfnyh3mw.jifvfom9.gs1a9yip.owycx6da.btwxx1t3.j83agx80.buofh1pr.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb.cbu4d94t.d2edcug0.hpfvmrgz.rj1gh0hx.buofh1pr.g5gj957u.j83agx80.dp1hu0rb > div > div > div.fome6x0j.tkqzz1yd.aodizinl.fjf4s8hc.f7vcsfb0 > div:nth-child(2) > div.bq4bzpyk.j83agx80.btwxx1t3.lhclo0ds.jifvfom9.muag1w35.dlv3wnog.enqfppq2.rl04r1d5')
//   //div > div:nth-child(1) > div > div.rq0escxv.l9j0dhe7.du4w35lb > div > div > div.j83agx80.cbu4d94t.d6urw2fd.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.jifvfom9.gs1a9yip.owycx6da.btwxx1t3.buofh1pr.dp1hu0rb > div.rq0escxv.l9j0dhe7.du4w35lb.j83agx80.cbu4d94t.g5gj957u.d2edcug0.hpfvmrgz.rj1gh0hx.buofh1pr.dp1hu0rb > div > div > div.ldhj9swq.f0t0fhil.rguv2o1t.mkhogb32 > div.tnfywhyr.qcbh9iyx.l0iu167d.m7uviv85.sj5x9vvc.cxgpxx05.nkil8b7s.rq0escxv.l82x9zwi.uo3d90p7 > div > span > div > div > div > div > label > input')
//   // const scrollStep = 10 // default
//   // const scrollDelay = 5 // default
//   // const lastPosition = await scrollPageToBottom(page, scrollStep, scrollDelay)

//   await page.waitForTimeout(4000);

//   const pageData = await page.evaluate(() => {

//     //  console.log(document.querySelector('body > div').getAttribute('id'))
//     document.querySelector('body > div').setAttribute('id', 'facebook')
//     //  console.log(document.querySelector('body > div').getAttribute('id'))
//     //console.log('#'+document.querySelector('body > div').getAttribute('id')+' > div > div:nth-child(1) > div > div.rq0escxv.l9j0dhe7.du4w35lb > div > div > div.j83agx80.cbu4d94t.d6urw2fd.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.pfnyh3mw.jifvfom9.gs1a9yip.owycx6da.btwxx1t3.j83agx80.buofh1pr.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb.cbu4d94t.d2edcug0.hpfvmrgz.rj1gh0hx.buofh1pr.g5gj957u.j83agx80.dp1hu0rb > div > div > div.fome6x0j.tkqzz1yd.aodizinl.fjf4s8hc.f7vcsfb0 > div:nth-child(2) > div.bq4bzpyk.j83agx80.btwxx1t3.lhclo0ds.jifvfom9.muag1w35.dlv3wnog.enqfppq2.rl04r1d5 > div')

//     const nodeList = document.querySelectorAll('#facebook > div > div:nth-child(1) > div > div.rq0escxv.l9j0dhe7.du4w35lb > div > div > div.j83agx80.cbu4d94t.d6urw2fd.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.pfnyh3mw.jifvfom9.gs1a9yip.owycx6da.btwxx1t3.j83agx80.buofh1pr.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb.cbu4d94t.d2edcug0.hpfvmrgz.rj1gh0hx.buofh1pr.g5gj957u.j83agx80.dp1hu0rb > div > div > div.fome6x0j.tkqzz1yd.aodizinl.fjf4s8hc.f7vcsfb0 > div:nth-child(2) > div.bq4bzpyk.j83agx80.btwxx1t3.lhclo0ds.jifvfom9.muag1w35.dlv3wnog.enqfppq2.rl04r1d5 > div');
//                                                 // body > div:nth-child(2) > div > div:nth-child(1) > div > div.rq0escxv.l9j0dhe7.du4w35lb > div > div > div.j83agx80.cbu4d94t.d6urw2fd.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.jifvfom9.gs1a9yip.owycx6da.btwxx1t3.buofh1pr.dp1hu0rb > div.rq0escxv.l9j0dhe7.du4w35lb.j83agx80.cbu4d94t.g5gj957u.d2edcug0.hpfvmrgz.rj1gh0hx.buofh1pr.dp1hu0rb > div > div > div.fome6x0j.tkqzz1yd.aodizinl.fjf4s8hc.f7vcsfb0 > div:nth-child(2) > div.bq4bzpyk.j83agx80.btwxx1t3.lhclo0ds.jifvfom9.muag1w35.dlv3wnog.enqfppq2.rl04r1d5
//     const cars = []
//     Array.from(nodeList).forEach((card) => {

//       if (card.querySelector('div > span > div > div > a') != null && card.querySelector('div > span > div > div > a').getAttribute('href') != "" &&
//           card.querySelector('div > span > div > div > a > div > div.rq0escxv.j83agx80.cbu4d94t.i1fnvgqd.muag1w35.pybr56ya.f10w8fjw.k4urcfbm.c7r68pdi.suyy3zvx > div:nth-child(1) > span > div > span') != null &&
//           (card.querySelector('div > span > div > div > a > div > div.rq0escxv.j83agx80.cbu4d94t.i1fnvgqd.muag1w35.pybr56ya.f10w8fjw.k4urcfbm.c7r68pdi.suyy3zvx > div:nth-child(1) > span > div > span') as HTMLElement).innerText != ""
//       ){
//         const region = (card.querySelector('div > span > div > div > a > div > div.rq0escxv.j83agx80.cbu4d94t.i1fnvgqd.muag1w35.pybr56ya.f10w8fjw.k4urcfbm.c7r68pdi.suyy3zvx > div:nth-child(3) > span > div > span > span') != null) ? (card.querySelector('div > span > div > div > a > div > div.rq0escxv.j83agx80.cbu4d94t.i1fnvgqd.muag1w35.pybr56ya.f10w8fjw.k4urcfbm.c7r68pdi.suyy3zvx > div:nth-child(3) > span > div > span > span') as HTMLElement).innerText : ''
//         const obj = {
//           _id: (card.querySelector('div > span > div > div > a') != null) ? card.querySelector('div > span > div > div > a').getAttribute('href').split('/')[3] : '', //tirar id da 3 posição
//           href: (card.querySelector('div > span > div > div > a') != null) ? 'https://www.facebook.com'+card.querySelector('div > span > div > div > a').getAttribute('href') : '',
//           origin: 'FCBK',
//           name: (card.querySelector('div > span > div > div > a > div > div.rq0escxv.j83agx80.cbu4d94t.i1fnvgqd.muag1w35.pybr56ya.f10w8fjw.k4urcfbm.c7r68pdi.suyy3zvx > div:nth-child(2) > span > div > span > span') != null) ? (card.querySelector('div > span > div > div > a > div > div.rq0escxv.j83agx80.cbu4d94t.i1fnvgqd.muag1w35.pybr56ya.f10w8fjw.k4urcfbm.c7r68pdi.suyy3zvx > div:nth-child(2) > span > div > span > span') as HTMLElement).innerText : '',
//           price: (card.querySelector('div > span > div > div > a > div > div.rq0escxv.j83agx80.cbu4d94t.i1fnvgqd.muag1w35.pybr56ya.f10w8fjw.k4urcfbm.c7r68pdi.suyy3zvx > div:nth-child(1) > span > div > span') as HTMLElement).innerText.replace(/[^\d]/g, '').trim(),
//           img: (card.querySelector('div > span > div > div > a > div > div.l9j0dhe7 > div > div > div > div > div > img') != null) ? card.querySelector('div > span > div > div > a > div > div.l9j0dhe7 > div > div > div > div > div > img').getAttribute('src') : '',
//           region: region,
//           state: region.split(',')[1].trim(),
//           city: region.split(',')[0].trim(),
//           detail: (card.querySelector('div > span > div > div > a > div > div.rq0escxv.j83agx80.cbu4d94t.i1fnvgqd.muag1w35.pybr56ya.f10w8fjw.k4urcfbm.c7r68pdi.suyy3zvx > div:nth-child(4) > div > span > span') != null) ? (card.querySelector('div > span > div > div > a > div > div.rq0escxv.j83agx80.cbu4d94t.i1fnvgqd.muag1w35.pybr56ya.f10w8fjw.k4urcfbm.c7r68pdi.suyy3zvx > div:nth-child(4) > div > span > span') as HTMLElement).innerText : '',
//           percent: 0
//         }
//         cars.push(obj)
//       }
//     })

//     return cars;
//   })


//   await page.close();
//   await browser.close();

//   return pageData;
// }


async function getIcar( filters: Filter, isDev: boolean ){
  try {
    const options = await getOptions(isDev)
    const browser = await puppeteer.launch(options)

    const page = await browser.newPage()
    await page.setViewport({
      width: 1800,
      height: 800
    });

    const url = `https://www.icarros.com.br/comprar/${(filters.state) ? filters.state + '/' : '' }${filters.make}/${filters.model}/${filters.year}`
    await page.goto(url);

    await page.waitForSelector('#anunciosForm > ul')

    await page.waitForTimeout(1000);

    const scrollStep = 20 // default
    const scrollDelay = 5 // default
    const lastPosition = await scrollPageToBottom(page, scrollStep, scrollDelay)

    const pageData = await page.evaluate(() => {
      const nodeList = document.querySelectorAll('#anunciosForm > ul > li');

      const cars = []
      Array.from(nodeList).forEach((card) => {
        if (card.querySelector('div > a > h2') != null &&
            (card.querySelector('div > a > h3') as HTMLElement).innerText != "" &&
            (card.querySelector('div > div.clearfix.dados_anuncio > div:nth-child(3) > div > p:nth-child(3) > span:nth-child(1)') != null) &&
            (card.querySelector('div > div.clearfix.dados_anuncio > div:nth-child(3) > div > p:nth-child(3) > span:nth-child(2)') as HTMLElement).innerText != ''
        ){
          const obj = {
            _id: card.getAttribute('id'),
            href: String(card.querySelector('div > a')['href']),
            origin: 'ICAR',
            name: (card.querySelector('div > a > h2 > span > span') as HTMLElement).innerText + ' ' + (card.querySelector('div > a > h2') as HTMLElement).innerText,
            price: (card.querySelector('div > a > h3') as HTMLElement).innerText,
            img: String(card.querySelector('div > div.clearfix.dados_anuncio > a > img')['src']).replace('imgadicionalanuncio/1/', 'imgadicionalanuncio/5/'),
            region: (card.querySelector('div > div.clearfix.dados_anuncio > div:nth-child(3) > div > p:nth-child(3) > span:nth-child(1)') as HTMLElement).innerText + ' - ' + (card.querySelector('div > div.clearfix.dados_anuncio > div:nth-child(3) > div > p:nth-child(3) > span:nth-child(2)') as HTMLElement).innerText,
            state: (card.querySelector('div > div.clearfix.dados_anuncio > div:nth-child(3) > div > p:nth-child(3) > span:nth-child(2)') as HTMLElement).innerText,
            city: (card.querySelector('div > div.clearfix.dados_anuncio > div:nth-child(3) > div > p:nth-child(3) > span:nth-child(1)') as HTMLElement).innerText,
            detail: (card.querySelector('div > div.clearfix.dados_anuncio > div.dados_veiculo > a > ul > li.usado > p') as HTMLElement).innerText + ' km',
            percent: 0
          }
          obj.price = String(parseFloat(obj.price.replace(/[^\d]/g, '').trim())/100)
          cars.push(obj)
        }
      })

      return cars;
    })

    await page.close();
    await browser.close();

    return pageData;
  } catch (error) {
    console.log("falha getIcar chome" + error)
  }
}


async function getMlb( filters: Filter, isDev: boolean ){
  try {
    const options = await getOptions(isDev)
    const browser = await puppeteer.launch(options)

    const page = await browser.newPage()
    // await page.setViewport({
    //   width: 1800,
    //   height: 800
    // });

    const url = `https://lista.mercadolivre.com.br/veiculos/${filters.carDscript.replace(/\s/g, '-')}_YearRange_${filters.year}-${filters.year}_NoIndex_True`
    await page.goto(url);

    await page.waitForSelector('#root-app > div > div > section')

    await page.waitForTimeout(1000);

    const scrollStep = 30 // default
    const scrollDelay = 5 // default
    const lastPosition = await scrollPageToBottom(page, scrollStep, scrollDelay)

    const pageData = await page.evaluate(() => {
      const nodeList = document.querySelectorAll('#root-app > div > div > section > ol > li');

      const cars = []
      Array.from(nodeList).forEach((card) => {
        if (card.querySelector('div > div > a > div > div.ui-search-item__group.ui-search-item__group--title > h2') != null &&
            (card.querySelector('div > div > a > div > div.ui-search-item__group.ui-search-item__group--title > h2') as HTMLElement).innerText != "" &&
            (card.querySelector('div > div > a > div > div.ui-search-item__group.ui-search-item__group--location > span') != null) &&
            (card.querySelector('div > div > a > div > div.ui-search-item__group.ui-search-item__group--location > span') as HTMLElement).innerText != ''
        ){
          const region = (card.querySelector('div > div > a > div > div.ui-search-item__group.ui-search-item__group--location > span') != null) ? (card.querySelector('div > div > a > div > div.ui-search-item__group.ui-search-item__group--location > span') as HTMLElement).innerText : ''
          const obj = {
            _id: String(card.querySelector('div > div > div.ui-search-result__bookmark > form > input[type=hidden]:nth-child(5)')['value']),
            href: String(card.querySelector('div > div > a')['href']),
            origin: 'MLB',
            name: (card.querySelector('div > div > a > div > div.ui-search-item__group.ui-search-item__group--title > h2') as HTMLElement).innerText,
            price: (card.querySelector('div > div > a > div > div.ui-search-item__group.ui-search-item__group--price > div > div > span > span.price-tag-amount > span.price-tag-fraction') as HTMLElement).innerText,
            img: card.getElementsByTagName('img')[0].getAttribute('src'),
            region: region,
            state: region.split('-')[1].trim(),
            city: region.split('-')[0].trim(),
            detail: (card.querySelector('div > div > a > div > div.ui-search-item__group.ui-search-item__group--attributes > ul > li:nth-child(2)') as HTMLElement).innerText,
            percent: 0
          }
          obj.price = obj.price.replace(/[^\d]/g, '').trim()
          cars.push(obj)
        }
      })

      return cars;
    })

    await page.close();
    await browser.close();

    return pageData;
  } catch (error) {
    console.log("falha getMlb chome" + error)
  }
}


async function getWbmtr( filters: Filter, isDev: boolean ){
  try {
    const options = await getOptions(isDev)
    const browser = await puppeteer.launch(options)

    const page = await browser.newPage()

    await page.setViewport({
      width: 1000,
      height: 800
    })

    const url = `https://www.webmotors.com.br/carros/estoque?tipoveiculo=carros&anode=${filters.year}&anoate=${filters.year}&marca1=${filters.make}&modelo1=${filters.model}&versao1=${filters.version}`
    await page.goto(url);

    await page.waitForSelector('#root > main > div.container > div.Search-result.Search-result--container-right > div:nth-child(4) > div > div:nth-child(1) > div > div:nth-child(1)')

    await autoScroll(page);

    const pageData = await page.evaluate(() => {
      const nodeList = document.querySelectorAll('#root > main > div.container > div.Search-result.Search-result--container-right > div:nth-child(4) > div > div:nth-child(1) > div > div.sc-hMFtBS.cVTeoI'); //sc-hMFtBS cVTeoI

      const cars = []
      Array.from(nodeList).forEach((card) => {
        if (
          (card.querySelector('div > div.sc-jnlKLf.ebrEBm > a.sc-gxMtzJ.sc-dfVpRl.ewffVg > div.sc-jqCOkK.hfnddN > h3') != null) &&
          (card.querySelector('div > div.sc-gGBfsJ.hNZIGH > div > div.PhotoSlider--container > a:nth-child(1) > img') != null) &&
          (card.querySelector('div > div.sc-gGBfsJ.hNZIGH > div > div.PhotoSlider--container > a:nth-child(1)') != null) &&
          (card.querySelector('#valorVerParcelas > strong') != null)
        ){
          const region = ((card.querySelector('div > div.sc-jnlKLf.ebrEBm > div > div.sc-ksYbfQ.bMwBUN > a > span')) != null) ? ((card.querySelector('div > div.sc-jnlKLf.ebrEBm > div > div.sc-ksYbfQ.bMwBUN > a > span') as HTMLElement).innerText) : ''
          const obj = {
            _id: (card.querySelector('div > div.sc-jnlKLf.ebrEBm > div > div.sc-ksYbfQ.bcIfbW > div').getAttribute('data-test-id').replace('card_favorite_', '')),
            href: (String(card.querySelector('div > div.sc-gGBfsJ.hNZIGH > div > div.PhotoSlider--container > a:nth-child(1)')['href'])),
            origin: 'WBMTR',
            name: ((card.querySelector('div > div.sc-jnlKLf.ebrEBm > a.sc-gxMtzJ.sc-dfVpRl.ewffVg > div.sc-jqCOkK.hfnddN > h2') as HTMLElement).innerText) + ' ' +((card.querySelector('div > div.sc-jnlKLf.ebrEBm > a.sc-gxMtzJ.sc-dfVpRl.ewffVg > div.sc-jqCOkK.hfnddN > h3') as HTMLElement).innerText),
            price: ((card.querySelector('#valorVerParcelas > strong') as HTMLElement).innerText),
            img: (String(card.querySelector('div > div.sc-gGBfsJ.hNZIGH > div > div.PhotoSlider--container > a:nth-child(1) > img')['src']).replace('w=249&h=186&q=70', 'w=1920&h=1440&q=75')),
            region: region,
            state: region.split('-')[1].trim(),
            city: region.split('-')[0].trim(),
            detail: (card.querySelector('div > div.sc-jnlKLf.ebrEBm > a.sc-gxMtzJ.fSIAtN > div > div:nth-child(2) > span') as HTMLElement).innerText,
            percent: 0
          }
          obj.price = obj.price.replace(/[^\d]/g, '').trim()
          cars.push(obj)
        }
      })

      return cars;
    })

    await page.close();
    await browser.close();

    return pageData;
  } catch (error) {
    console.log("falha getWbmtr chome" + error)
  }
}

export { getOlx, getMlb, getIcar, getWbmtr }
