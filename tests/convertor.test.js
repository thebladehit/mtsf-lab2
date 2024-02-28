const { convert } = require('../src/convertor');

describe('paragraph', () => {
  test('Wrap text', () => {
    expect(convert('hello')).toBe('<p>hello</p>');
  });

  test('Wrap different paragraphs', () => {
    const input = `hello

    world`;
    const expected = `<p>hello</p><p>
    world</p>`;
    expect(convert(input)).toBe(expected);
  });
});

describe('**word**', () => {
  test('Find **word** patern', () => {
    expect(convert('**hello**')).toBe('<p><b>hello</b></p>');
  });
  
  test('Find **word word** patern', () => {
    expect(convert('**hello world**')).toBe('<p><b>hello world</b></p>');
  });

  test('Not interpret ** single symbol', () => {
    expect(convert('**')).toBe('<p>**</p>');
  });
  
  test('Not interpret ** single symbol in others patterns', () => {
    expect(convert('`**`')).toBe('<p><tt>**</tt></p>');
  });
  
  test('Not interpret ** in word snake_case', () => {
    expect(convert('snake**case')).toBe('<p>snake**case</p>');
  });
});


describe('_word_', () => {
  test('Find _word_ patern', () => {
    expect(convert('_hello_')).toBe('<p><i>hello</i></p>');
  });
  
  test('Find _word word_ patern', () => {
    expect(convert('_hello world_')).toBe('<p><i>hello world</i></p>');
  });

  test('Not interpret _ single symbol', () => {
    expect(convert('_')).toBe('<p>_</p>');
  });
  
  test('Not interpret _ single symbol in others patterns', () => {
    expect(convert('`_`')).toBe('<p><tt>_</tt></p>');
  });
  
  test('Not interpret _ in word snake_case', () => {
    expect(convert('snake_case')).toBe('<p>snake_case</p>');
  });
});


describe('`word`', () => {
  test('Find `word` patern', () => {
    expect(convert('`hello`')).toBe('<p><tt>hello</tt></p>');
  });
  
  test('Find `word word` patern', () => {
    expect(convert('`hello world`')).toBe('<p><tt>hello world</tt></p>');
  });

  test('Not interpret ` single symbol', () => {
    expect(convert('`')).toBe('<p>`</p>');
  });
  
  test('Not interpret _ single symbol in others patterns', () => {
    expect(convert('```')).toBe('<p><tt>`</tt></p>');
  });
  
  test('Not interpret ` in word snake_case', () => {
    expect(convert('snake`case')).toBe('<p>snake`case</p>');
  });
});


describe('```word```', () => {
  test('Find ```word``` patern', () => {
    expect(convert('```hello```')).toBe('<p><pre>hello</pre></p>');
  });

  test('Find ```word word``` patern', () => {
    expect(convert('```hello world```')).toBe('<p><pre>hello world</pre></p>');
  });

  test('Not interpret other tags inside', () => {
    expect(convert('```**hello** _world_```')).toBe('<p><pre>**hello** _world_</pre></p>');
  });
});


describe('Errors', () => {
  test('nested tags', () => {
    expect(() => convert('**_hello_**')).toThrow('Error: invalid markdown nested tags');
  });

  test('open tag', () => {
    expect(() => convert('**hello')).toThrow('Error: invalid markdown not finished tags');
  });
});