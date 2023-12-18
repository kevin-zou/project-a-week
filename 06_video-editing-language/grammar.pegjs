{
  const {
    commands,
    state,
  } = options;

  const {
    addTrack,
    addToTrack,
    exportFile,
    importFile,
    slice,
  } = commands;
}

Script
  = commands:(Command)+ {
    return commands;
  }

Import
  = 'import' _ f:Filename _ 'as' _ v:Variable ';' {
    importFile(state, f, v);
  }
  
Export
  = 'export' _ v:Variable _ 'as' _ f:(Filename / FilenameWithQuotes) ';' {
    exportFile(state, v, f);
  }
  
Slice
  = 'slice' _ v1:Variable _ start:Timestamp _ 'to' _ end:Timestamp _ 'as' _ v2:Variable ';' {
    slice(state, v1, start, end, v2);
  }
  
Track
  = 'new track as' _ name:Variable ';' {
    addTrack(state, name);
  }
  
AddToTrack
  = 'add' _ inputVar:Variable _ 'on' _ trackName:Variable timestamp:AddToTrackAt? ';' {
    addToTrack(state, inputVar, trackName, timestamp);
  }

AddToTrackAt
  = _ 'at' _ timestamp:Timestamp {
    return timestamp;
  }
  
Command
  = command:(Import / Export / Slice / Track / AddToTrack) _ {
    return command;
  }
  
Filename
  = [a-zA-z0-9]+.[a-zA-z0-9]+ {
    return text();
  }

FilenameWithQuotes
  = '"'[a-zA-z0-9 ]+.[a-zA-z0-9]+'"' {
    return text();
  }
  
Variable
  = [a-zA-z0-9]+ {
    return text();
  }
  
Timestamp
  = [0-5][0-9] ':' [0-5][0-9] {
    return text();
  }

_ "whitespace"
  = [ \t\n\r]*
