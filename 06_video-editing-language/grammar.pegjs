Script
  = commands:(Command)+ {
    return commands;
  }

Import
  = 'import' _ Filename _ 'as' _ Variable ';' {
    return 'import statement'
  }
  
Export
  = 'export' _ Variable _ 'as' _ Filename ';' {
    return 'export statement'
  }
  
Slice
  = 'slice' _ Variable _ Timestamp _ 'to' _ Timestamp _ 'as' _ Variable ';' {
    return 'slice statement'
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
    return command
  }
  
Filename
  = ('"'[a-zA-z0-9 ]+.[a-zA-z0-9]+'"') / ([a-zA-z0-9]+.[a-zA-z0-9]+) {
    return 'filename'
  }
  
Variable
  = [a-zA-z0-9]+ {
    return 'variable'
  }
  
Timestamp
  = [0-5][0-9] ':' [0-5][0-9] {
    return 'timestamp'
  }

_ "whitespace"
  = [ \t\n\r]*
