'use strict';

var chai   = require('chai');
var Lexer  = require('../../lib/Lexer');
var Token  = require('../helper/Token');

var expect = chai.expect;

describe('Lexer integration tests', function(){

    describe('Lexer describing grammar programmatically', function(){
        describe('Lexer with IDENTIFIER NUMERIC and EOF rules', function(){
            var lexer,
                tokens = [],
                init;

            lexer = Lexer.create();

            init = lexer.initializer();

            //define expressions
            init ('{digit}')    (/[0-9]/);
            init ('{number}')   (/{digit}+(\.{digit}+)?(E[+-]?{digit}+)?/);
            //define state rules
            init (/[A-Za-z_]+/) (function(/*match*/){ tokens.push(Token.IDENTIFIER); });
            init (/{number}/)   (function(/*match*/){ this.installToken(Token.NUMERIC); });
            init (/[ \s\n\t]+/) (/*No action*/);
            init (/$/)          (function(/*match*/){ tokens.push(Token.EOF); return false;});

            //define auxiliar methods
            init ('installToken') (function(value){tokens.push(value);});


            describe('using lex method', function(){
                it('lex(source) should parse ID NUMERIC ID EOF', function(){
                    var source = 'identifier 0.3E+99 another_ID';

                    tokens = [];

                    lexer.lex(source);

                    expect(tokens).to.have.length(4);
                    expect(tokens).to.have.deep.property('[0]', Token.IDENTIFIER);
                    expect(tokens).to.have.deep.property('[1]', Token.NUMERIC);
                    expect(tokens).to.have.deep.property('[2]', Token.IDENTIFIER);
                    expect(tokens).to.have.deep.property('[3]', Token.EOF);

                });

                it('lex(source) should parse ID NUMERIC ID EOF with escaped symbols', function(){
                    var source = 'identifier\t999\n  another_ID \n';

                    tokens = [];

                    lexer.lex(source);
                    expect(tokens).to.have.length(4);
                    expect(tokens).to.have.deep.property('[0]', Token.IDENTIFIER);
                    expect(tokens).to.have.deep.property('[1]', Token.NUMERIC);
                    expect(tokens).to.have.deep.property('[2]', Token.IDENTIFIER);
                    expect(tokens).to.have.deep.property('[3]', Token.EOF);

                });

                it('lex() should parse ID NUMERIC ID EOF using setSource()', function(){
                    var source = 'identifier 999 another_ID';

                    tokens = [];

                    lexer.setSource(source);

                    lexer.lex();

                    expect(tokens).to.have.length(4);
                    expect(tokens).to.have.deep.property('[0]', Token.IDENTIFIER);
                    expect(tokens).to.have.deep.property('[1]', Token.NUMERIC);
                    expect(tokens).to.have.deep.property('[2]', Token.IDENTIFIER);
                    expect(tokens).to.have.deep.property('[3]', Token.EOF);

                });
            });


            describe('using next method and setSource', function(){

                it('next() should parse ID NUMERIC ID EOF one at a time', function(){
                    var source = 'identifier 999 another_ID';

                    tokens = [];

                    lexer.setSource(source);

                    lexer.next();
                    expect(tokens).to.have.length(1);
                    expect(tokens).to.have.deep.property('[0]', Token.IDENTIFIER);

                    lexer.next();
                    expect(tokens).to.have.length(2);
                    expect(tokens).to.have.deep.property('[1]', Token.NUMERIC);

                    lexer.next();
                    expect(tokens).to.have.length(3);
                    expect(tokens).to.have.deep.property('[2]', Token.IDENTIFIER);

                    lexer.next();
                    expect(tokens).to.have.length(4);
                    expect(tokens).to.have.deep.property('[3]', Token.EOF);

                });
            });

        });
    });
    describe('Lexer with grammar from json', function(){
        var Grammar = {
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

        describe('Lexer with IDENTIFIER NUMERIC and EOF rules', function(){
            var lexer,
                tokens = [];

            lexer = Lexer.create({
                grammar: Grammar,
                helpers: {
                    Token: Token,
                    install: function(token){
                        tokens.push(token);
                    }
                }
            });

            it('lex(source) should parse ID NUMERIC ID EOF', function(){
                var source = 'identifier 0.3E+99 another_ID';

                tokens = [];

                lexer.lex(source);

                expect(tokens).to.have.length(4);
                expect(tokens).to.have.deep.property('[0]', Token.IDENTIFIER);
                expect(tokens).to.have.deep.property('[1]', Token.NUMERIC);
                expect(tokens).to.have.deep.property('[2]', Token.IDENTIFIER);
                expect(tokens).to.have.deep.property('[3]', Token.EOF);

            });

        });       
    });

    describe('Lexer with grammar from file', function(){
        describe('Lexer with IDENTIFIER NUMERIC and EOF rules', function(){
            var lexer,
                tokens = [];

            lexer = Lexer.create({
                json: __dirname+'/Grammar.json',
                helpers: {
                    Token: Token,
                    install: function(token){
                        tokens.push(token);
                    }
                }
            });

            it('lex(source) should parse ID NUMERIC ID EOF', function(){
                var source = 'identifier 0.3E+99 another_ID';

                tokens = [];

                lexer.lex(source);

                expect(tokens).to.have.length(4);
                expect(tokens).to.have.deep.property('[0]', Token.IDENTIFIER);
                expect(tokens).to.have.deep.property('[1]', Token.NUMERIC);
                expect(tokens).to.have.deep.property('[2]', Token.IDENTIFIER);
                expect(tokens).to.have.deep.property('[3]', Token.EOF);

            });

        });       
    });
});
