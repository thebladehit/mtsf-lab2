'use strict';

const path = require('node:path');
const { convert } = require('./convertor.js');
const { readFile, writeFile } = require('./fs.js');

const convertMdToHtml = async (filePath) => {
  try {
    const absolutePath = path.join(__dirname, filePath);
    const data = await readFile(absolutePath);
    let outPath;
    let format;
    if (process.argv.length > 2) {
      for (let i = 2; i < process.argv.length; i++) {
        const arg = process.argv[i];
        if (arg.startsWith('--out=')) outPath = arg.split('=')[1];
        else if (arg.startsWith('--format=')) format = arg.split('=')[1];
      }
    }
    format = outPath ? format ? format : 'html' : format ? format : 'ansi';
    const convertedData = convert(data, format);
    if (outPath) {
      const absOutPath = path.resolve(__dirname, outPath);
      await writeFile(absOutPath, convertedData);
    } else console.log(convertedData);
  } catch (err) {
    console.log(err);
    process.exit(err.code)
  }
};

process.stdin.setEncoding('utf8');
process.stdout.write('File name: ');
process.stdin.on('data', (data) => {
  process.stdin.pause();
  convertMdToHtml(data.trim());
});