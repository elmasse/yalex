'use strict';

var chai   = require('chai'),
    expect = chai.expect,
    sinon  = require("sinon"),
    sinonChai = require("sinon-chai"),
    Graph  = require('../../lib/Graph'),
    Lexer  = require('../../lib/Lexer');

chai.use(sinonChai);

describe('Lexer unit tests:', function(){

    describe('initializing a new Lexer', function(){
        var sut = Lexer.create(),
            action = sinon.spy(),
            regex = /regex/,
            auxActionName = 'auxiliar', 
            addRuleSpy = sinon.spy(sut.graph, 'addRule'),
            addAuxActionSpy = sinon.spy(sut.graph, 'addAuxiliarAction'),
            setSourceSpy = sinon.spy(sut.graph, 'setSource');

        it('should create the graph and return a function to describe graph\'s rules', function(){
            expect(sut).to.have.property('graph').that.is.an.instanceOf(Graph);
        });


        it('should add rules to its graph using initializer', function(){
            var init = sut.initializer();

            init (regex) (action);

            expect(addRuleSpy).to.have.been.calledWith(regex, action);

            init (regex) ();

            expect(addRuleSpy).to.have.been.calledWith(regex);

        });

        it('should add auxiliar methods to its graph using initializer', function(){
            var init = sut.initializer();

            init (auxActionName) (action);

            expect(addAuxActionSpy).to.be.calledWith(auxActionName, action);

        });

        it('should set the source on its graph when using setSource', function(){
            var source = 'source';

            sut.setSource(source);

            expect(setSourceSpy).to.be.calledWith(source);
        });
    });

    describe('lex() method runs against source until an action returns null', function(){
        var sut = Lexer.create(),
            runSpy = sinon.stub(sut.graph, 'run'),
            setSourceSpy = sinon.spy(sut.graph, 'setSource'),
            actionNext = sinon.spy(sut.graph, 'next'),
            source = 'source';

        runSpy.onCall(0).returns(actionNext);
        runSpy.onCall(1).returns(actionNext);
        runSpy.onCall(2).returns(null);

        it('should execute all matching actions against the given source', function(){
            sut.lex(source);

            expect(setSourceSpy).to.be.calledWith(source);
            expect(runSpy).to.be.called;
            expect(actionNext).to.be.calledTwice;
        });

        it('should execute all matching actions against the source previously set on setSource', function(){
            sut.setSource(source);
            expect(setSourceSpy).to.be.calledWith(source);

            sut.lex();

            expect(runSpy).to.be.called;
            expect(actionNext).to.be.calledTwice;
        });

        it('should execute all matching actions against the given source even if previously set on setSource', function(){
            var source2 = 'another';

            sut.setSource(source);
            expect(setSourceSpy).to.be.calledWith(source);

            sut.lex(source2);
            
            expect(runSpy).to.be.called;
            expect(setSourceSpy).to.be.calledWith(source2);
            expect(actionNext).to.be.calledTwice;
        });

    });

    describe('next() method runs against source for the first rule matched', function(){
        var sut = Lexer.create(),
            runSpy = sinon.stub(sut.graph, 'run'),
            setSourceSpy = sinon.spy(sut.graph, 'setSource'),
            actionNext = sinon.spy(sut.graph, 'next'),
            source = 'source';

        it('should execute the matching action against the given source', function(){
            runSpy.onCall(0).returns(actionNext);

            sut.setSource(source);

            sut.next();

            expect(runSpy).to.be.called;
            expect(setSourceSpy).to.be.calledWith(source);
            expect(actionNext).to.not.be.called;
        });

    });
});