Script
  = commands:(Command)+ {
    return commands;
  }

Import
  = 'import'_ Filename _ 'as' _ Variable ';' {
    return 'import statement'
  }
  
Slice
  = 'slice' _ Variable _ Timestamp _ 'to' _ Timestamp _ 'as' _ Variable ';' {
    return 'slice statement'
  }
  
Command
  = Import _ / Slice _ {
    return 'command'
  }
  
Filename
  = [a-zA-z0-9]+.[a-zA-z0-9]+ {
    return 'filename'
  }
  
Variable
  = [a-zA-z0-9]+ {
    return 'variable'
  }
  
Timestamp
  = [0-5][0-9]':'[0-5][0-9] {
    return 'timestamp'
  }

_ "whitespace"
  = [ \t\n\r]*
