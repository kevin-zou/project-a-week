const { readFile } = require('fs/promises');
const peg = require('pegjs');
const commands = require('./commands.js')
const { STATUS } = require('./constants.js');

function log(msg, status) {
  console.log(`[${status}] ${msg}`);
}

async function main() {
  const path = process.argv[2];
  if (!path) {
    log('No path provided', STATUS.ERROR);
    return;
  }

  // Initialize state
  const state = {
    aliases: {},
    slices: {},
    tracks: {},
    log,
  };

  try {
    const pegRules = await readFile('grammar.pegjs', 'utf8');
    const script = await readFile(path, 'utf8');
    log('Script loaded', STATUS.INFO);
    const parser = peg.generate(pegRules);
    parser.parse(script, {
      commands,
      state,
    });
    log('Script parsed', STATUS.INFO);
  } catch (err) {
    let msg = err;
    if (err.location) {
      err += `(Line ${err.location.start.line}, column ${err.location.start.column})`;
    }
    log(msg, STATUS.ERROR);
    process.exit(1);
  }
}

main();
