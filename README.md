[![Build Status](https://travis-ci.org/elmasse/yalex.png?branch=master)](https://travis-ci.org/elmasse/yalex)
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

lexer = Lexer().create();

init = lexer.initializer();

//expressions
init ('{digit}')      (/[0-9]/);
//rules:
init (/[A-Za-z_]+/)   (function(/*match*/){ tokens.push("IDENTIFIER"); });
// - using expressions
init (/{digit}+/)     (function(/*match*/){ tokens.push("NUMERIC"); });
init (/[ \s\n\t]+/)   (/*No action*/);
init (/$/)            (function(/*match*/){ tokens.push("EOF"); return false;});

//tokenize
lexer.lex('ID ANOTHER_ID 9999');

console.log(tokens);
````

This will print:

````bash
["IDENTIFIER", "IDENTIFIER", "NUMERIC", "EOF"]
````
