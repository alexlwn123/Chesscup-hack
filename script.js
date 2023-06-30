var webdriver = require("selenium-webdriver");
var chrome = require("selenium-webdriver/chrome");
require("dotenv").config();

if (!process.env.CHROME_BINARY_PATH || !process.env.USERNAME || !process.env.PASSWORD || !process.env.MODE) {
  console.error("Please set the following environment variables: CHROME_BINARY_PATH, USERNAME, PASSWORD, MODE");
  console.error("See sample.env for an example.");
  process.exit(1);
}
var binaryPath = process.env.CHROME_BINARY_PATH

let setup = () => {
  cheaty = function () {
    chessDiv = document.querySelector("#tsk > div");
    const properties = Object.keys(chessDiv);
    propsKey = properties[0];
    const chessMoves = chessDiv[propsKey].return.memoizedState.moves[0];
    if (chessMoves.length === 0) return;
    const chessHistory = chessDiv[propsKey].return.memoizedState.historyy;
    // console.log("move #", chessHistory.length);
    moves = [];
    for (let i = chessHistory.length; i < chessMoves.length; i++) {
      if (i % 2 == 0) {
        moves.push(chessMoves[i]);
      }
    }
    console.log(moves.join(","));
    return moves;
  };
};
let makeMove = async (move, driver) => {
  const start = move.substring(0, 2);
  const end = move.substring(2);

  const pieces = await driver.findElements(
    webdriver.By.css("#dirty > div > piece")
  );

  let startPiece;
  for (const x of pieces) {
    const sq = await x.getAttribute("cgKey");
    if (sq === start) {
      startPiece = x;
      break;
    }
  }
  console.log("TODO", start, end);

  await driver
    .actions()
    .move({ origin: startPiece })
    .press()
    .release()
    // .pause(200)
    .perform();

  console.log("clicked 1:", start);

  const squares = await driver.findElements(
    webdriver.By.css("#dirty > div > square")
  );
  let endPiece;
  for (const x of squares) {
    const sq = await x.getAttribute("cgKey");
    if (sq === end.substring(0, 2)) {
      endPiece = x;
      break;
    }
  }

  await driver
    .actions()
    .move({ origin: endPiece })
    .press()
    .release()
    // .pause(300)
    .perform();

  if (end.length === 3) {
    const promotionMap = {
      'q': 1,
      'r': 2,
      'n': 3,
      'b': 4
    }
    await driver
      .findElement(
        webdriver.By.xpath(`//*[@id="promote-to"]/li[${promotionMap[end[2]]}]`)
      )
      .click();
  }
  console.log("clicked 2:", end);
};
let solvePuzzle = async (moves, driver) => {
  for (const move of moves) {
    await makeMove(move, driver);
  }
};
const init = async () => {
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

  //dark mode //*[@id="darkModeToggler"]
  await driver.findElement(webdriver.By.xpath('//*[@id="darkModeToggler"]')).click();

  //LOGIN //*[@id="navbarSupportedContent"]/ul[2]/li[4]/a
  const user = process.env.USERNAME;
  const password = process.env.PASSWORD;
  await driver
    .findElement(
      webdriver.By.xpath('//*[@id="navbarSupportedContent"]/ul[2]/li[4]/a')
    )
    .click();

  await driver.wait(
    webdriver.until.elementLocated(webdriver.By.xpath('//*[@id="inputEmail"]')),
    15000
  );
  // userbox //*[@id="inputEmail"]
  await driver
    .findElement(webdriver.By.xpath('//*[@id="inputEmail"]'))
    .sendKeys(user);
  // passbox //*[@id="inputPassword"]
  await driver
    .findElement(webdriver.By.xpath('//*[@id="inputPassword"]'))
    .sendKeys(password);
  // enter //*[@id="wrp"]/div[2]/div[2]/form/button
  await driver
    .findElement(webdriver.By.xpath('//*[@id="wrp"]/div[2]/div[2]/form/button'))
    .click();

  await driver.executeScript(setup);

  await driver.wait(
    webdriver.until.elementLocated(
      webdriver.By.xpath('//*[@id="testpng"]/div[1]/div/div[1]/div[2]/div[3]')
    ),
    15000
  );

  const mode = process.env.MODE;
  if (mode === "0") {
    // 3 mins
    await driver
      .findElement(
        webdriver.By.xpath('//*[@id="testpng"]/div[1]/div/div[1]/div[2]/div[1]')
      ).click();
  } else if (mode === "1") {
    // 5 mins
    await driver
      .findElement(
        webdriver.By.xpath('//*[@id="testpng"]/div[1]/div/div[1]/div[2]/div[2]')
      )
      .click();
  } else if (mode === "2") {
    // survival
    await driver
      .findElement(
        webdriver.By.xpath('//*[@id="testpng"]/div[1]/div/div[1]/div[2]/div[3]')
      )
      .click();
  }

  // Start
  await driver
    .findElement(
      webdriver.By.xpath('//*[@id="testpng"]/div[1]/div/div[2]/div/button')
    )
    .click();

  // Wait for board to load
  await driver.wait(
    webdriver.until.elementLocated(
      webdriver.By.xpath('//*[@id="tsk"]/div/div[1]/div[2]/div/div[3]/div/span')
    ),
    15000
  );
};

const solveAway = async () => {
  // const board = await driver.findElement(webdriver.By.xpath('#dirty > div'))
  myMoves = [];

  const cdpConnection = await driver.createCDPConnection("page");
  await driver.onLogEvent(cdpConnection, (event) => {
    const res = event["args"][0]["value"];
    console.log("received", res);
    myMoves = res.split(",");
  });

  for (let i = 0; true; i++) {
    console.log("PUZZLE:", i + 1);

    try {
      await driver.executeScript("return cheaty()");
      console.log("cheaty done...");

      await driver.wait(() => {
        return myMoves.length > 0;
      }, 1000);
      await makeMove(myMoves[0], driver);
      console.log("moves received...");

      // await solvePuzzle(myMoves, driver);
      console.log("puzzle solved");
    } catch (e) {
      console.error("Error:", e);
      await driver.executeScript(setup);
    }
    myMoves = [];
    await driver.actions().clear();
    console.log("actions cleared");
  }

  // await driver.quit();
}
const main = async () => {
  await init();
  await solveAway();
};

module.exports = main();