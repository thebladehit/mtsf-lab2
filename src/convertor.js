'use strict';

const regExpes = [
  {
    regExp: /```.+?```/s,
    length: 3,
    symbol: '```',
    changeToStart: { ansi: '\x1B[7m', html: '<pre>' },
    changeToEnd: { ansi: '\x1B[27m', html: '</pre>' },
    nestedTag: true,
    fn: (data) => {
      preData.push(data);
      return '~!!!~';
    }
  },
  {
    regExp: /([^A-Za-z0-9_\u0400-\u04FF*_`]|^)\*\*.+?\*\*([^A-Za-z0-9_\u0400-\u04FF*_`]|$)/u,
    length: 2,
    symbol: '**',
    changeToStart: { ansi: '\x1B[1m', html: '<b>' },
    changeToEnd: { ansi: '\x1B[22m', html: '</b>' },
    nestedTag: false
  },
  {
    regExp: /([^A-Za-z0-9_\u0400-\u04FF*_`]|^)_.+?_([^A-Za-z0-9_\u0400-\u04FF*_`]|$)/,
    symbol: '_',
    length: 1,
    changeToStart: {ansi: '\x1B[3m', html: '<i>' },
    changeToEnd: { ansi: '\x1B[23m', html: '</i>' },
    nestedTag: false
  },
  {
    regExp: /([^A-Za-z0-9_\u0400-\u04FF*_`]|^)`.+?`([^A-Za-z0-9_\u0400-\u04FF*_`]|$)/,
    symbol: '`',
    length: 1,
    changeToStart: { ansi: '\x1B[7m', html: '<tt>' },
    changeToEnd: { ansi: '\x1B[27m', html: '</tt>' },
    nestedTag: false
  },
];

const regExpesError = [
  /(^|\s)\*\*([\w\u0400-\u04FF])+/,
  /(^|\s)_([\w\u0400-\u04FF])+/,
  /(^|\s)`([\w\u0400-\u04FF])+/,
  /(^|\s)```([\w\u0400-\u04FF])+/
];

const preData = [];

const availableModes = ['html', 'ansi'];

const isValidMode = (mode) => availableModes.includes(mode);

const addParagrapgs = (data) => {
  data = '<p>' + data;
  let idx;
  while ((idx = data.indexOf('\n\n')) != -1 || (idx = data.indexOf('\r\n')) != -1) {
    data = data.slice(0, idx) + '</p><p>' + data.slice(idx + 1);
  }
  data = data + '</p>';
  return data;
};

const isNestedTag = (data) => {
  for (const regExp of regExpes) {
    if (data.match(regExp.regExp) != null) return true;
  }
  return false;
}

const isInvalidTags = (data) => {
  for (const regExp of regExpesError) {
    if (data.match(regExp) != null) return true;
  }
  return false;
};

const deleteInternalSymbols = (data, symbols) => {
  while (preData.length) {
    data = data.replace(symbols, preData.pop());
  }
  return data;
};

const convert = (data, mode) => {
  if (!isValidMode(mode)) {
    const err = new Error('Error: invalid mode type');
    err.code = 406;
    throw err;
  }
  for (const regExp of regExpes) {
    let match;
    while ((match = data.match(regExp.regExp)) != null) {
      const symbolIndexStart = match[0].indexOf(regExp.symbol);
      const midx = match.index + symbolIndexStart;
      let mlength = match[0].length - symbolIndexStart;
      let preformatedData = data.slice(midx + regExp.length, midx + mlength);
      const symbolIndexEnd = preformatedData.lastIndexOf(regExp.symbol);
      const endIdx = midx + symbolIndexEnd
      preformatedData = preformatedData.slice(0, symbolIndexEnd);
      const formatedData = regExp.fn ? regExp.fn(preformatedData) : preformatedData;
      if (!regExp.nestedTag && isNestedTag(' ' + formatedData)) {
        const err = new Error('Error: invalid markdown nested tags');
        err.code = 406;
        throw err;
      }
      data = data.slice(0, midx) + regExp.changeToStart[mode] + formatedData + regExp.changeToEnd[mode] + data.slice(endIdx + regExp.length * 2); 
    }
  }
  if (isInvalidTags(data)) {
    const err = new Error('Error: invalid markdown not finished tags');
    err.code = 406;
    throw err;
  }
  if (mode === 'html') data = addParagrapgs(data);
  data = deleteInternalSymbols(data, '~!!!~');
  return data;
};

module.exports = { convert };