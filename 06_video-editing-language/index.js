const { readFile } = require('fs/promises');
const peg = require('pegjs');
const commands = require('./commands.js')

const STATUS = {
  ERROR: 'ERROR',
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
};

function log(msg, status) {
  console.log(`[${status}] ${msg}`);
}

async function main() {
  // Initialize state
  const state = {
    aliases: {},
    slices: {},
    tracks: {},
  };

  const pegRules = await readFile('grammar.pegjs', 'utf8');
  const script = await readFile('script.vel', 'utf8');
  log('Script loaded', STATUS.INFO);
  const parser = peg.generate(pegRules);
  try {
    parser.parse(script, {
      commands,
      state,
    });
    log('Script parsed', STATUS.INFO);
  } catch (err) {
    log(err, STATUS.ERROR);
  }
  console.log({state})
}

main();
