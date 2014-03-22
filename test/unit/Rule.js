'use strict';

var chai   = require('chai'),
    expect = chai.expect,
    sinon = require("sinon"),    
    sinonChai = require("sinon-chai"),
    Rule  = require('../../lib/Rule');

chai.use(sinonChai);

describe('Rule unit tests:\n - A Rule holds a regex and the action to be executed', function(){

    describe('Rule constructor accepts a config object', function(){
        var regex = /$/,
            action = function(){},
            sut;


        it('should create a rule with regex and action', function(){
            sut = new Rule({regex: regex, action: action});

            expect(sut).to.have.property('regex').that.is.a('RegExp');
            expect(sut).to.have.property('action').that.is.a('Function');
        });

        it('should call setter for regex if param is present in the config object', function(){
            var setterSpy = sinon.spy(Rule.prototype, 'setRegex');

            sut = new Rule({regex: regex});
            expect(setterSpy).to.be.calledWith(regex);
        });

        it('should call setter for action if param is present in the config object', function(){
            var setterSpy = sinon.spy(Rule.prototype, 'setAction');

            sut = new Rule({action: action});
            expect(setterSpy).to.be.calledWith(action);
        });

    });

    describe('Rule regex setter', function(){
        var regex = /$/,
            sut;

        sut = new Rule();

        it('should wrap the regex to test matches that start with the given regex', function(){
            var wrapRegex = new RegExp('^('+regex.source+')');
            sut.setRegex(regex);
            expect(sut.regex).to.be.eql(wrapRegex);
        });
    });


    describe('Rule matches', function(){
        var sut = new Rule({regex:/[A-Za-z]+/}),
            onlyText = 'OnlyTextShouldMatch',
            onlyNumbers = '99999';

        it('should use the wrapped regex in with the given input',function(){
            var matchSpy = sinon.spy(String.prototype, 'match');
            
            sut.matches(onlyText);

            expect(matchSpy).to.be.calledWith(sut.regex);
            String.prototype.match.restore();
        });

        it('should return an array that contains the matched value',function(){
            var match = sut.matches(onlyText);

            expect(match).to.be.an('array');
            expect(match[0]).to.be.eql(onlyText);
        });

        it('should return null if value doesn\'t match',function(){
            var match = sut.matches(onlyNumbers);

            expect(match).to.be.a('null');
        });



    });

    describe('Rule skip', function() {
        var sut = new Rule({regex:/[A-Za-z]+/}),
            onlyText = 'OnlyTextShouldMatch';

        it('should return null once if skip was executed on the rule',function(){
            var matchSpy = sinon.spy(String.prototype, 'match');
            
            sut.skip();

            sut.matches(onlyText);
            expect(matchSpy).to.not.be.called;

            sut.matches(onlyText);
            expect(matchSpy).to.be.calledWith(sut.regex);
            
            String.prototype.match.restore();
        });

    });
});