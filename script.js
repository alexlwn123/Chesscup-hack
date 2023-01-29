const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { By } = require("selenium-webdriver");

const binaryPath = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";

let setup = () => { 
  cheaty = function () {
    chessDiv = document.querySelector("#tsk > div")
    const properties = Object.keys(chessDiv);
    propsKey = properties[0];
    const chessMoves = chessDiv[propsKey].return.memoizedState.moves;
    if (chessMoves.length === 0) return;
    moves = [];
    for (let i = 0; i < chessMoves.length; i++) {
      if (i % 2 == 0) {
        moves.push(chessMoves[i]);
      }
    }
    console.log(moves[0].join(','));
    return moves[0];
  };
};

let solvePuzzle = async (moves, driver) => {
  for (const move of moves) {
    const start = move.substring(0,2)
    const end = move.substring(2);

    const pieces = await driver.findElements(By.css('#dirty > div > piece'));

    let startPiece;
    for (const x of pieces) {
      const sq = await x.getAttribute('cgKey');
      if (sq === start) {
        startPiece = x;
        break;
      }
    }
    console.log("TODO", start, end);

    await driver.actions()
      .move({origin: startPiece})
      .press()
      .release()
      .perform();

    console.log('clicked 1:', start);

    const squares = await driver.findElements(By.css('#dirty > div > square'));
    let endPiece;
    for (const x of squares) {
      const sq = await x.getAttribute('cgKey');
      if (sq === end) {
        endPiece = x;
        break;
      }
    }

    await driver.actions()
      .move({origin: endPiece})
      .press()
      .release()
      .pause(500)
      .perform();

    console.log('clicked 2:', end);
  }

}

(async () => {
  const options = new chrome.Options().setBinaryPath(binaryPath);
  // options.add_argument('--headless')
  // .addExtensions(getRequestlyExtension("chrome"));

  driver = await new webdriver.Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  // await driver.manage().setTimeouts({ implicit: 10 });

  // await importRequestlySharedList(driver, URL);

  await driver.get("https://chesscup.org/");

  //__reactInternalInstance$qvgh4exfuap.return.memoizedState.moves
  //__reactInternalInstance$q1w5d6zgodd.return.memoizedState.moves[0]
  //#tsk > div
  ///html/body/div/div[2]/div[2]/div/div
  //document.querySelector("#tsk > div")
  //__reactInternalInstance$2vt6opizec
  // //*[@id="dirty"]/div
  //*[@id="dirty"]/div
  // board --> /html/body/div/div[2]/div[2]/div/div/div[1]/div[1]/div/div/div[1]/div
  // card --> /html/body/div/div[2]/div[2]/div/div/div[1]/div[1]/div/div[1]
  // skip --> //*[@id="tsk"]/div/div[1]/div[2]/div/div[3]/div/span
  // pieces --> #dirty > div > piece

  //LOGIN //*[@id="navbarSupportedContent"]/ul[2]/li[4]/a
  const user = "";
  const password = "";
  await driver.findElement(By.xpath('//*[@id="navbarSupportedContent"]/ul[2]/li[4]/a')).click()

  await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="inputEmail"]')), 15000);
  // userbox //*[@id="inputEmail"]
  await driver.findElement(By.xpath('//*[@id="inputEmail"]')).sendKeys(user);
  // passbox //*[@id="inputPassword"]
  await driver.findElement(By.xpath('//*[@id="inputPassword"]')).sendKeys(password);
  // enter //*[@id="wrp"]/div[2]/div[2]/form/button
  await driver.findElement(By.xpath('//*[@id="wrp"]/div[2]/div[2]/form/button')).click();

  await driver.executeScript(setup);

  await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="testpng"]/div[1]/div/div[1]/div[2]/div[3]')), 15000);
  //survival
  // await driver.findElement(By.xpath('//*[@id="testpng"]/div[1]/div/div[1]/div[2]/div[3]')).click()
  // 5 mins
  await driver.findElement(By.xpath('//*[@id="testpng"]/div[1]/div/div[1]/div[2]/div[2]')).click()
  // 3 mins
  // await driver.findElement(By.xpath('//*[@id="testpng"]/div[1]/div/div[1]/div[2]/div[1]')).click()

  await driver.findElement(By.xpath('//*[@id="testpng"]/div[1]/div/div[2]/div/button')).click()
  // let skip = await driver.wait(webdriver.until.elementIsVisible(By.xpath('//*[@id="tsk"]/div/div[1]/div[2]/div/div[3]/div/span')), 16000);

  await driver.wait(webdriver.until.elementLocated(By.xpath('//*[@id="tsk"]/div/div[1]/div[2]/div/div[3]/div/span')), 15000);

  // const board = await driver.findElement(By.xpath('#dirty > div'))
  myMoves = [];

  const cdpConnection = await driver.createCDPConnection('page');
    await driver.onLogEvent(cdpConnection, (event) => {
      const res = event['args'][0]['value'];
      console.log(res);
      myMoves = res.split(',')
    });


  for (let i=0; true; i++) {
    console.log('PUZZLE:', i+1);

    try {
      await driver.executeScript('return cheaty()');
      console.log('cheaty done...')

      await driver.wait(() => {return myMoves.length > 0}, 15000);
      console.log('moves received...')

      await solvePuzzle(myMoves, driver);
      console.log('puzzle solved');
    } catch (e) {
      console.error('Error:', e);
      await driver.executeScript(setup);
    }
    myMoves = [];
    await driver.actions().clear();
    console.log('actions cleared')
  }

  // await driver.quit();



})();