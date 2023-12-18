{
  const {
    commands,
    state,
  } = options;

  const {
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
  = 'export' _ Variable _ 'as' _ Filename ';' {
    return 'export statement'
  }
  
Slice
  = 'slice' _ v1:Variable _ start:Timestamp _ 'to' _ end:Timestamp _ 'as' _ v2:Variable ';' {
    slice(state, v1, start, end, v2);
  }
  
Track
  = 'new track as' _ Variable ';' {
    return 'track statement'
  }
  
AddToTrack
  = 'add' _ Variable _ 'on' _ Variable timestamp:(_ 'at' _ Timestamp) ? ';' {
    return timestamp ? 'add to track timestamp' : 'add to track'
  }
  
Command
  = command:(Import / Export / Slice / Track / AddToTrack) _ {
    return command;
  }
  
Filename
  = ('"'[a-zA-z0-9 ]+.[a-zA-z0-9]+'"') / ([a-zA-z0-9]+.[a-zA-z0-9]+) {
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
