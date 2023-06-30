# Chesscup-hack
Demolishes my favorite chess site for puzzles: [https://chesscup.org](https://chesscup.org)

Scrapes puzzle answers from browser state. Solver bot uses browser automation via Selenium.

Currently holds the All-Time #1 position in all modes: 3-minute, 5-minute, and survival mode.

Tweet: https://twitter.com/_AlexLewin/status/1673532600143560705

## Usage

Clone the repo and install dependencies   
```bash
git clone git@github.com:alexlwn123/Chesscup-hack.git
cd Chesscup-hack
npm i
cp sample.env .env
```
Create an account at chesscup.org and update .env
```env
USERNAME=example@email.com
PASSWORD=examplePassword
MODE=2
CHROME_BINARY_PATH=/Applications/ExampleBrowserFile.app/Contents/MacOS/ExampleBrowser
```
#### Modes Legend

* **Mode 0** -> 3 minutes  
* **Mode 1** -> 5 minutes  
* **Mode 2** -> survival

Run the bot
```bash
npm run start
```

Note: *I use MacOS and Brave browser. That's the only configuration I've tested. No guarentees this works with any other environment.*

---

## Leaderboards

<img width="1520" alt="image" src="https://user-images.githubusercontent.com/43247027/215305524-294ec7fe-f450-4841-ad72-53ce156b9445.png">

<img width="1468" alt="image" src="https://user-images.githubusercontent.com/43247027/215305511-7c58f261-0b5e-41b9-a776-c9b6d38920b4.png">

<img width="1508" alt="image" src="https://user-images.githubusercontent.com/43247027/215305518-ca8545e5-4f97-48ce-8797-634d127ab140.png">

Updated Survival Leaderboard (6/30/23)
![image](https://github.com/alexlwn123/Chesscup-hack/assets/43247027/db4a196f-db67-43fe-b458-1b84e35549ad)
