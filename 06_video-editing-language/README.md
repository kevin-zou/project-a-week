# Video editing language
A language and interpreter for programmatic video editing.

This was a little ambitious and I didn't end up getting as far as I would've liked. The biggest hurdle was getting famliliar with a bunch of new libraries (PEG.js, ffmpeg, fluent-ffmpeg) and applying them. That said, this was a lot of fun. I've been meaning to do something that isn't a web project, so this itches that scratch a bit.

## Use
Clone this repository, navigate to it, and install dependencies with `npm install`. Afterward, create a new "script" file or modify the existing one in `examples/script.vel`.

Then run:
```
node index.js path/to/script.vel
```

## Syntax example
The following example takes two input videos, extracts the first 10 seconds from each, and combines them into a single output.

```
import video1.mp4 as video1;
import video2.mp4 as video2;

slice video1 00:00 to 00:10 as clip1;
slice video2 00:00 to 00:10 as clip2;

new track as track1;
add clip1 on track1;
add clip2 on track1;

export track1 as "exported file.mp4";
```

## Syntax
The program interprets the script in sequence, meaning that lines will be executed from top to bottom. For example, you may not use a video slice before it has been defined.

### Import video
`import <path/to/video.mp4> as <video alias>;`

Starting point for a script. Import all assets that you are planning on using.

### Slice video
`slice <video alias> <MM:SS> to <MM:SS> as <slice alias>;`

Define a range in a video to use, and persist this to an alias.

### New track
`new track as <track alias>;`

Create a new "track" to add your videos to.

### Add to track
`add <slice alias> on <track alias>;`

Adds a video slice onto the track. If there are existing slices, the added slice will be appended.

### Export video
`export <track alias> as <path/to/output.mp4>;`

Exports the selected track to the file path specified.

## Technical details
I used [PEG.js](https://pegjs.org) to create a set of grammar rules and an accompanying parser. Once I got a general set of rules down, I started writing the bindings to ffmpeg. This would've been much more difficult if it weren't for the [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) library, which provided an easy interface to using ffmpeg in Node.

## Backstory
Inspiration for this came from a project in a programming languages course I took in university. The task was to create a [domain specific language](https://en.wikipedia.org/wiki/Domain-specific_language) (DSL) from scratch. Our idea was to enable programmatic video editing to the every day user, and we ended up creating a language with basic video/audio actions, as well higher level statements for conditionals and control flow.

## Future improvements
- Support for audio tracks
- Add ability to add clips at specific points in track
- Feedback on progress
- Allow for user options (eg. resolution, frame rate)
- Allow for different video sources (eg. piped in)
- Greater flexibilty (allow users to add entire videos without slicing)
