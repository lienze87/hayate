import fs from 'fs';
import readline from 'readline';

const readFile = readline.createInterface({
  input: fs.createReadStream('source.ts'),
  output: fs.createWriteStream('result.ts'),
  terminal: false,
});

readFile.on('line', transform).on('close', function () {
  console.log(`Created "${this.output.path}"`);
});

let needTransform = true;

function transform(line) {
  let modified = '';

  if (needTransform) {
    if (line.includes('declare type')) {
      modified = line.replace('declare type', 'const');

      if (line.includes(';')) {
        let leftVal = modified.split('=')[0];
        let rightVal = modified.split('=')[1];

        const keys = rightVal.match(/\w+(\[\])?/g);
        modified = `${leftVal} = [${keys?.map((key) => `'${key}'`)}]`;
      }
    }

    if (line.includes('interface')) {
      modified = line.replace('interface', 'const');
      if (line.includes('{')) {
        modified = modified.replace('{', '= {');
      } else {
      }
    }

    if (line.includes(':')) {
      let required = true;
      if (line.includes('?')) {
        required = false;
      }
      const keys = line.match(/\w+(\[\])?/g);

      modified = `  ${keys[0]}: { type: '${keys.slice(1).join(',')}', required: ${required}},`;
    }
  }

  this.output.write(`${modified || line}\n`);
}

function tokenizer(input) {
  let current = 0;
  let tokens = [];
  while (current < input.length) {
    let char = input[current];

    if (char === '=') {
      tokens.push({ type: 'paren', value: '=' });
      current++;
      continue;
    }
    if (char === '{') {
      tokens.push({ type: 'paren', value: '{' });
      current++;
      continue;
    }
    if (char === '}') {
      tokens.push({ type: 'paren', value: '{' });
      current++;
      continue;
    }
    if (char === '<') {
      tokens.push({ type: 'paren', value: '<' });
      current++;
      continue;
    }
    if (char === '>') {
      tokens.push({ type: 'paren', value: '>' });
      current++;
      continue;
    }
    if (char === '(') {
      tokens.push({ type: 'paren', value: '(' });
      current++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: 'paren', value: ')' });
      current++;
      continue;
    }
    if (char === '[') {
      tokens.push({ type: 'paren', value: '[' });
      current++;
      continue;
    }
    if (char === ']') {
      tokens.push({ type: 'paren', value: ']' });
      current++;
      continue;
    }
    if (char === '|') {
      tokens.push({ type: 'paren', value: '|' });
      current++;
      continue;
    }
    if (char === '&') {
      tokens.push({ type: 'paren', value: '&' });
      current++;
      continue;
    }
    if (char === ',') {
      tokens.push({ type: 'paren', value: ',' });
      current++;
      continue;
    }
    if (char === '?') {
      tokens.push({ type: 'paren', value: '?' });
      current++;
      continue;
    }
    if (char === ':') {
      tokens.push({ type: 'paren', value: ':' });
      current++;
      continue;
    }
    if (char === ';') {
      tokens.push({ type: 'paren', value: ';' });
      current++;
      continue;
    }

    if (char === '.' && input[++current] && input[++current] === '.') {
      tokens.push({ type: 'paren', value: '...' });
      current += 2;
      continue;
    }

    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }
    if (char === '"') {
      let value = '';
      char = input[++current];

      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      char = input[++current];
      tokens.push({ type: 'string', value });

      continue;
    }

    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = '';

      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: 'number', value });

      continue;
    }

    let LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = '';

      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: 'name', value });
      continue;
    }

    tokens.push({ type: 'special', value: char });
    current++;
    continue;
  }

  return tokens;
}

function parser(tokens) {
  let current = 0;
  function walk() {
    let token = tokens[current];
    if (token.type === 'number') {
      current++;
      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }
    if (token.type === 'string') {
      current++;

      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }
    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current];
      let node = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      };
      token = token = tokens[++current];
      while (token.type !== 'paren' || (token.type === 'paren' && token.value !== ')')) {
        node.params.push(walk());
        token = tokens[current];
      }
      current++;
      return node;
    }
    throw new TypeError(token.type);
  }
  let ast = {
    type: 'Program',
    body: [],
  };
  while (current < tokens.length) {
    ast.body.push(walk());
  }
  return ast;
}

function generation() {}
