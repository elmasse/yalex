[![Build Status](https://travis-ci.org/elmasse/yalex.png?branch=master)](https://travis-ci.org/elmasse/yalex)
#yalex (yet another lexer)

##Install

````bash
npm install git://github.com/elmasse/yalex.git --save
````

##Usage

###Define grammar in json format

````js
var Lexer = require('yalex'),
    lexer, grammar, tokens = [];

grammar = {
    "expressions": {
        '{digit}' : '[0-9]',
        '{number}':  '{digit}+(\\.{digit}+)?(E[+-]?{digit}+)?'
    },
    "rules": {
        '[A-Za-z_]+'    : 'Token.IDENTIFIER|install',
        '{number}'      : 'Token.NUMERIC|install',
        '[ \\s\\n\\t]+' : '', /*NO ACTION*/
        '$'             : 'Token.EOF|install|END'
    }
};

lexer = Lexer.create({
    grammar: grammar,
    helpers: {
        Token: {
            IDENTIFIER: "IDENTIFIER",
            NUMERIC: "NUMERIC",
            EOF: "EOF"
        },
        install: function(token){
            tokens.push(token);
        }
    }
});

//tokenize
lexer.lex('ID ANOTHER_ID 9999');

console.log(tokens);

````

###Use Grammar defined in external json file

Grammar.json

````json
{
    "expressions": {
        "{digit}" : "[0-9]",
        "{number}":  "{digit}+(\\.{digit}+)?(E[+-]?{digit}+)?"
    },
    "rules": {
        "[A-Za-z_]+"    : "Token.IDENTIFIER|install",
        "{number}"      : "Token.NUMERIC|install",
        "[ \\s\\n\\t]+" : "",
        "$"             : "Token.EOF|install|END"
    }
}
````

````js
var Lexer = require('yalex'),
    lexer, tokens = [];


lexer = Lexer.create({
    json : __dirname + './Grammar.json',
    helpers: {
        Token: {
            IDENTIFIER: "IDENTIFIER",
            NUMERIC: "NUMERIC",
            EOF: "EOF"
        },
        install: function(token){
            tokens.push(token);
        }
    }
});

//tokenize
lexer.lex('ID ANOTHER_ID 9999');

console.log(tokens);

````

###Define Lex rules programmaticaly

````js
var Lexer = require('yalex'),
    lexer, init, tokens = [];

lexer = Lexer.create();

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

All this examples will print:

````bash
["IDENTIFIER", "IDENTIFIER", "NUMERIC", "EOF"]
````
