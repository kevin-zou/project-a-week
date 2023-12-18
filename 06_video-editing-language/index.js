const { readFile } = require('fs/promises');
const peg = require('pegjs');
const commands = require('./commands.js')

async function main() {
  const pegRules = await readFile('grammar.pegjs', 'utf8');
  const script = await readFile('script.vel', 'utf8');
  const parser = peg.generate(pegRules);
  console.log(parser.parse(script, commands));
}

main();
