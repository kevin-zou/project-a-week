const ffmpeg = require('fluent-ffmpeg');

// TODO: Change this and the grammar to accept file paths
const importFile = (state, filename, outputVar) => {
  const { aliases } = state;
  if (aliases[outputVar]) {
    throw Error(`Variable "${outputVar}" already exists`);
  }
  aliases[outputVar] = filename;
}

const exportFile = (state, trackName, outputPath) => {
  const { tracks } = state;
  if (!tracks[trackName]) {
    throw Error(`Variable "${trackName}" does not exist`);
  }
  const track = tracks[trackName];
  // TODO: Check that the track has slices on it
  const { parts } = track;
  const ffmpegCmd = ffmpeg();
  const filters = [];
  let finalFilter = '';
  parts.forEach((part, index) => {
    const { slice, timestamp } = part;
    ffmpegCmd.input(slice.path);
    const startTimeInSeconds = timestampToSeconds(slice.startTime);
    const endTimeInSeconds = timestampToSeconds(slice.endTime);
    const filter = `[${index}:v]trim=start=${startTimeInSeconds}:end=${endTimeInSeconds},setpts=PTS-STARTPTS[v${index}]`;
    filters.push(filter);
    finalFilter += `[v${index}]`;
  });
  finalFilter += `concat=n=${parts.length}:v=1:a=0[outv]`
  filters.push(finalFilter);
  console.log(filters)
  ffmpegCmd
    .complexFilter(filters)
    .outputOptions('-map "[outv]"')
    .audioCodec('copy')
    .output(outputPath)
    .on('error', (err) => {
      throw Error(err)
    })
    .run();
}

const slice = (state, inputVar, startTime, endTime, outputVar) => {
  const { aliases, slices } = state;
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
  const sliced = {
    path: inputPath,
    startTime,
    endTime,
  };
  slices[outputVar] = sliced;
}

const addTrack = (state, name) => {
  const { tracks } = state;
  if (tracks[name]) {
    throw Error(`Track "${name}" already exists`);
  }
  tracks[name] = {
    parts: [],
  };
}

const addToTrack = (state, inputVar, trackName, timestamp) => {
  const { slices, tracks } = state;
  if (!tracks[trackName]) {
    throw Error(`Track "${trackName}" does not exist`);
  }
  if (!slices[inputVar]) {
    throw Error(`Track "${inputVar}" does not exist`);
  }
  const track = tracks[trackName];
  const slice = slices[inputVar];
  track.parts.push({ 
    slice,
    timestamp,
  });
}

function timestampToSeconds(timestamp) {
  const [minutes, seconds] = timestamp.split(':').map(Number);
  if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || seconds < 0) {
    throw new Error('Invalid timestamp format');
  }
  const totalSeconds = minutes * 60 + seconds;
  return totalSeconds;
}

module.exports = {
  addTrack,
  addToTrack,
  exportFile,
  importFile,
  slice,
}
