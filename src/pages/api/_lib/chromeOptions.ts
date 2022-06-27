// import chrome from 'chrome-aws-lambda'

const exePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  // process.platform === "win32"
  //   ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  //   : process.platform === "linux"
  //   ? "/usr/bin/google-chrome-stable"//"/usr/bin/google-chrome"
  //   : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

interface Options {
  args: string[]
  executablePath: string
  headless: boolean
  //defaultViewport: any
}

export async function getOptions(isDev: boolean): Promise<Options> {
  let options: Options

  //if (isDev) {
    options = {
      args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-infobars',
              '--window-position=0,0',
              '--ignore-certifcate-errors',
              '--ignore-certifcate-errors-spki-list',
              '--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"'
            ],
      executablePath: exePath,
      headless: true
    }
  //}

  // else {
  //   options = {
  //     args: chrome.args,
  //     executablePath: await chrome.executablePath,
  //     headless: chrome.headless
  //   }
  // }

  return options
}
