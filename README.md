# Improved MD -> HTML | ANSI Simple Convertor

This is a simple Mark Down to Html or ANSI convertor. It can convert some md tags to html tags or to ansi escape codes, define bad marking and find nested tags, save output to file or redirect output to stdin.

## Installation

> **NOTE:** You need to install [Node.js](https://nodejs.org/en/download)
1. Clone repository from GitHub
```bash
git clone https://github.com/thebladehit/mtsf-lab2.git
cd mtsf-lab2
```
2. Install dependencies
```bash
npm i
```
3. Run index.js file
```bash
node src/index.js
```

## Usage

1. You can specify the output file using **--out=**
> **NOTE:** if you omit **--out==** the output will be redirected to stdin
```bash
node src/index.js --out=example.html
```
2. You can specify the output format using **--format=**
> **NOTE:** you can specify only two formats: **html** and **ansi**
```bash
node src/index.js --format=ansi
```
3. You can combine flags together
```bash
node src/index.js --format=ansi --out=example.txt
```
### INFO
1. If you do not specify format and do not using **--out=** the output will be **ANSI** as default and directed to stdin.
2. If you specify **--out=**, but do not specify format the output will be **HTML** as default and directed to specified file.

## Run tests

This project has tests and you can run it by:
```bash
npm run test
```

## Lab section
[Failed tests](https://github.com/thebladehit/mtsf-lab2/commit/23f848eb3891b30b3fd533f2caa9d7449209c113)
[Revert commit](https://github.com/thebladehit/mtsf-lab2/commit/6420bb85f8cdf8e71746f19bfb20434d891fe740)

## Conclusion
Використання підходу створення на основі тестів, виявилося дуже ефективним в даному випадку тому, що вносячи багато змін не потрібно кожен раз запускати проєкт з нуля і вводити дані вручну. Можна запустити тести після зміни однією командою і покриються одразу всі випадки. Це дуже економить час та не вимагає такої концентрації як при ручному вводі даних.

Може здатися що на написання тестів іде багато часу, але в майбутньому при розробці проєкту на цих тестах можна буде зекономити набагато більше часу.