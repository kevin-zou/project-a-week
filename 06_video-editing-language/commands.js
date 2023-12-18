const ffmpeg = require('fluent-ffmpeg');

// TODO: Change this and the grammar to accept file paths
const importFile = (state, filename, outputVar) => {
  const { aliases } = state;
  if (aliases[outputVar]) {
    throw Error(`Variable "${outputVar}" already exists`);
  }
  aliases[outputVar] = filename;
}

const slice = (state, inputVar, startTime, endTime, outputVar) => {
  const { aliases, ffmpegObjects } = state;
  if (!aliases[inputVar]) {
    throw Error(`Variable "${inputVar}" does not exist`);
  }
  if (aliases[outputVar]) {
    throw Error(`Variable "${outputVar}" already exists`);
  }
  if (!(startTime < endTime)) {
    throw Error(`Start time must be less than end time`);
  }

  const inputPath = aliases[inputVar];
  const sliced = ffmpeg(inputPath)
    .setStartTime(startTime)
    .setDuration(endTime - startTime);
  ffmpegObjects[outputVar] = sliced;
}

module.exports = {
  importFile,
  slice,
}
