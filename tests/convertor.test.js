const { convert } = require('../src/convertor');

describe('paragraph', () => {
  test('Wrap text', () => {
    expect(convert('hello', 'html')).toBe('<p>hello</p>');
  });

  test('Wrap different paragraphs', () => {
    const input = `hello

    world`;
    const expected = `<p>hello</p><p>
    world</p>`;
    expect(convert(input, 'html')).toBe(expected);
  });
});

describe('**word**', () => {
  test('Find **word** patern', () => {
    expect(convert('**hello**', 'html')).toBe('<p><b>hello</b></p>');
  });
  
  test('Find **word word** patern', () => {
    expect(convert('**hello world**', 'html')).toBe('<p><b>hello world</b></p>');
  });

  test('Not interpret ** single symbol', () => {
    expect(convert('**', 'html')).toBe('<p>**</p>');
  });
  
  test('Not interpret ** single symbol in others patterns', () => {
    expect(convert('`**`', 'html')).toBe('<p><tt>**</tt></p>');
  });
  
  test('Not interpret ** in word snake_case', () => {
    expect(convert('snake**case', 'html')).toBe('<p>snake**case</p>');
  });
});


describe('_word_', () => {
  test('Find _word_ patern', () => {
    expect(convert('_hello_', 'html')).toBe('<p><i>hello</i></p>');
  });
  
  test('Find _word word_ patern', () => {
    expect(convert('_hello world_', 'html')).toBe('<p><i>hello world</i></p>');
  });

  test('Not interpret _ single symbol', () => {
    expect(convert('_', 'html')).toBe('<p>_</p>');
  });
  
  test('Not interpret _ single symbol in others patterns', () => {
    expect(convert('`_`', 'html')).toBe('<p><tt>_</tt></p>');
  });
  
  test('Not interpret _ in word snake_case', () => {
    expect(convert('snake_case', 'html')).toBe('<p>snake_case</p>');
  });
});


describe('`word`', () => {
  test('Find `word` patern', () => {
    expect(convert('`hello`', 'html')).toBe('<p><tt>hello</tt></p>');
  });
  
  test('Find `word word` patern', () => {
    expect(convert('`hello world`', 'html')).toBe('<p><tt>hello world</tt></p>');
  });

  test('Not interpret ` single symbol', () => {
    expect(convert('`', 'html')).toBe('<p>`</p>');
  });
  
  test('Not interpret _ single symbol in others patterns', () => {
    expect(convert('```', 'html')).toBe('<p><tt>`</tt></p>');
  });
  
  test('Not interpret ` in word snake_case', () => {
    expect(convert('snake`case', 'html')).toBe('<p>snake`case</p>');
  });
});


describe('```word```', () => {
  test('Find ```word``` patern', () => {
    expect(convert('```hello```', 'html')).toBe('<p><pre>hello</pre></p>');
  });

  test('Find ```word word``` patern', () => {
    expect(convert('```hello world```', 'html')).toBe('<p><pre>hello world</pre></p>');
  });

  test('Not interpret other tags inside', () => {
    expect(convert('```**hello** _world_```', 'html')).toBe('<p><pre>**hello** _world_</pre></p>');
  });
});


describe('Errors', () => {
  test('nested tags', () => {
    expect(() => convert('**_hello_**', 'html')).toThrow('Error: invalid markdown nested tags');
  });

  test('open tag', () => {
    expect(() => convert('**hello', 'html')).toThrow('Error: invalid markdown not finished tags');
  });
});