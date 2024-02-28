const { convert } = require('../src/convertor');

const runTest = (mode, tests) => {
  for (const [description, value] of Object.entries(tests)) {
    describe(description, () => {
      for (const [testName, testValue] of Object.entries(value)) {
        test(testName, () => {
          expect(convert(testValue.input, mode)).toBe(testValue.expected);
        });
      }
    });
  }

  describe('Errors', () => {
    test('nested tags', () => {
      expect(() => convert('**_hello_**', mode)).toThrow('Error: invalid markdown nested tags');
    });
  
    test('open tag', () => {
      expect(() => convert('**hello', mode)).toThrow('Error: invalid markdown not finished tags');
    });
  });
}

describe('HTML', () => {
  const tests = {
    paragraph: {
      'Wrap text': {input: 'hello', expected: '<p>hello</p>'},
      'Wrap different paragraphs': {input: `hello

      world`, expected: `<p>hello</p><p>
      world</p>`},
    }, 
    '**word**': {
      'Find **word** patern': {input: '**hello**', expected: '<p><b>hello</b></p>'},
      'Find **word word** patern': {input: '**hello world**', expected: '<p><b>hello world</b></p>'},
      'Not interpret ** single symbol': {input: '**', expected: '<p>**</p>'},
      'Not interpret ** single symbol in others patterns': {input: '`**`', expected: '<p><tt>**</tt></p>'},
      'Not interpret ** in word snake_case': {input: 'snake**case', expected: '<p>snake**case</p>'},
    },
    '_word_': {
      'Find _word_ patern': {input: '_hello_', expected: '<p><i>hello</i></p>'},
      'Find _word word_ patern': {input: '_hello world_', expected: '<p><i>hello world</i></p>'},
      'Not interpret _ single symbol': {input: '_', expected: '<p>_</p>'},
      'Not interpret _ single symbol in others patterns': {input: '`_`', expected: '<p><tt>_</tt></p>'},
      'Not interpret _ in word snake_case': {input: 'snake_case', expected: '<p>snake_case</p>'},
    },
    '`word`': {
      'Find `word` patern': {input: '`hello`', expected: '<p><tt>hello</tt></p>'},
      'Find `word word` patern': {input: '`hello world`', expected: '<p><tt>hello world</tt></p>'},
      'Not interpret ` single symbol': {input: '`', expected: '<p>`</p>'},
      'Not interpret ` single symbol in others patterns': {input: '```', expected: '<p><tt>`</tt></p>'},
      'Not interpret ` in word snake_case': {input: 'snake`case', expected: '<p>snake`case</p>'},
    },
    '```word```': {
      'Find ```word``` patern': {input: '```hello```', expected: '<p><pre>hello</pre></p>'},
      'Find ```word word``` patern': {input: '```hello world```', expected: '<p><pre>hello world</pre></p>'},
      'Not interpret other tags inside': {input: '```**hello** _world_```', expected: '<p><pre>**hello** _world_</pre></p>'},
    }
  };
  runTest('html', tests);
});

describe('ANSI', () => {
  const tests = {
    paragraph: {
      'Wrap text': {input: 'hello', expected: 'hello'},
      'Wrap different paragraphs': {input: `hello

      world`, expected: `hello

      world`},
    }, 
    '**word**': {
      'Find **word** patern': {input: '**hello**', expected: '\x1B[1mhello\x1B[22m'},
      'Find **word word** patern': {input: '**hello world**', expected: '\x1B[1mhello world\x1B[22m'},
      'Not interpret ** single symbol': {input: '**', expected: '**'},
      'Not interpret ** single symbol in others patterns': {input: '`**`', expected: '\x1B[7m**\x1B[27m'},
      'Not interpret ** in word snake_case': {input: 'snake**case', expected: 'snake**case'},
    },
    '_word_': {
      'Find _word_ patern': {input: '_hello_', expected: '\x1B[3mhello\x1B[23m'},
      'Find _word word_ patern': {input: '_hello world_', expected: '\x1B[3mhello world\x1B[23m'},
      'Not interpret _ single symbol': {input: '_', expected: '_'},
      'Not interpret _ single symbol in others patterns': {input: '`_`', expected: '\x1B[7m_\x1B[27m'},
      'Not interpret _ in word snake_case': {input: 'snake_case', expected: 'snake_case'},
    },
    '`word`': {
      'Find `word` patern': {input: '`hello`', expected: '\x1B[7mhello\x1B[27m'},
      'Find `word word` patern': {input: '`hello world`', expected: '\x1B[7mhello world\x1B[27m'},
      'Not interpret ` single symbol': {input: '`', expected: '`'},
      'Not interpret ` single symbol in others patterns': {input: '```', expected: '\x1B[7m`\x1B[27m'},
      'Not interpret ` in word snake_case': {input: 'snake`case', expected: 'snake`case'},
    },
    '```word```': {
      'Find ```word``` patern': {input: '```hello```', expected: '\x1B[7mhello\x1B[27m'},
      'Find ```word word``` patern': {input: '```hello world```', expected: '\x1B[7mhello world\x1B[27m'},
      'Not interpret other tags inside': {input: '```**hello** _world_```', expected: '\x1B[7m**hello** _world_\x1B[27m'},
    }
  };
  runTest('ansi', tests);
});