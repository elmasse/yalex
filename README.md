#yalex (yet another lexer)

##Install

````bash
npm install git://github.com/elmasse/yalex.git --save
````

##Usage

###Define Lex rules

````js
var Lexer = require('yalex'),
    lexer, init, tokens = [];

lexer = new Lexer();

init = lexer.initializer();

//rules:
init (/[A-Za-z_]+/) (function(/*match*/){ tokens.push("IDENTIFIER"); return this.next();});
init (/[0-9]+/)     (function(/*match*/){ tokens.push("NUMERIC"); return this.next();});
init (/[ \s\n\t]+/) (/*No action*/);
init (/$/)          (function(/*match*/){ tokens.push("EOF"); return null;});

//tokenize
lexer.lex('ID ANOTHER_ID 9999');

console.log(tokens);
````

This will print:

````bash
["IDENTIFIER", "IDENTIFIER", "NUMERIC", "EOF"]
````
