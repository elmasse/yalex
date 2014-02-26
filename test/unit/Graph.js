'use strict';

var chai   = require('chai'),
    expect = chai.expect,
    sinon  = require("sinon"),
    sinonChai = require("sinon-chai"),
    Rule   = require('../../lib/Rule'),
    Graph  = require('../../lib/Graph');

chai.use(sinonChai);

describe('Graph unit tests:\n - A Graph holds a set of rules and is responsible to execute the action asociated to the matched rule', function(){

    describe('Adding rules to the current Graph', function(){
        var sut = new Graph(),
            regex = /[A-Z]+/,
            action = function(){};

        it('should have an empty set of rules when creating a new Graph', function(){
            expect(sut).to.have.property('rules').that.is.an('array');
            expect(sut).to.have.property('rules').that.is.empty;            
        });

        it('should create a new Rule with the given regex and action and add it to the current set', function(){
            sut.addRule(regex, action);

            expect(sut.rules).to.have.deep.property('[0]').that.is.an.instanceOf(Rule);
            expect(sut.rules).to.have.deep.property('[0]').that.have.property('action').that.is.eql(action);
        });

        it('should create a new Rule with the given regex and noOp when no action is passed', function(){
            sut.addRule(regex);

            expect(sut.rules).to.have.deep.property('[1]').that.is.an.instanceOf(Rule);
            expect(sut.rules).to.have.deep.property('[1]').that.have.property('action').that.is.eql(sut.noOp);
        });

    });

    describe('Run rules against the given source', function(){

        describe('Single rule matching', function(){
            var sut = new Graph(),
                regex = /[a-z]+/,
                spyAction = sinon.spy(),
                matchStub;

            sut.addRule(regex, spyAction);

            matchStub = sinon.stub(sut.rules[0], 'matches');
            matchStub.returns(['input']);

            it('should call action on the matching rule with the graph scope', function(){
                sut.run('input');

                expect(spyAction).to.be.called;
                expect(spyAction).to.be.calledOn(sut);
            });

        });

        describe('Multi rule matching', function(){
            var spyAction1 = sinon.spy(),
                spyAction2 = sinon.spy(),
                matchRule1Stub, matchRule2Stub;

            it('should call action on the longest matching rule', function(){
                var sut = new Graph();

                sut.addRule(/rule1/, spyAction1);
                sut.addRule(/rule2/, spyAction2);
                
                matchRule1Stub = sinon.stub(sut.rules[0], 'matches');
                matchRule1Stub.returns(['input']);

                matchRule2Stub = sinon.stub(sut.rules[1], 'matches');
                matchRule2Stub.returns(['longestmatch']);

                sut.run('input');

                expect(spyAction2).to.be.called;
                expect(spyAction2).to.be.calledOn(sut);                
                expect(spyAction1).to.not.be.called;
            });

            it('should call the latest defined rule if matching terms have same length', function(){
                var sut = new Graph();

                sut.addRule(/rule1/, spyAction1);
                sut.addRule(/rule2/, spyAction2);
                
                matchRule1Stub = sinon.stub(sut.rules[0], 'matches');
                matchRule1Stub.returns(['same']);

                matchRule2Stub = sinon.stub(sut.rules[1], 'matches');
                matchRule2Stub.returns(['same']);

                sut.run('input');

                expect(spyAction2).to.be.called;
                expect(spyAction2).to.be.calledOn(sut);
                expect(spyAction1).to.not.be.called;

            });

        });

        describe('No rule matching', function(){
            var sut = new Graph(),
                regex = /[a-z]+/,
                spyAction = sinon.spy(),
                matchStub;

            sut.addRule(regex, spyAction);

            matchStub = sinon.stub(sut.rules[0], 'matches');
            matchStub.returns(null);

            it('should throw Error when no rule matching is found', function(){
                expect(function(){sut.run('input');}).to.throw(Error);
                expect(spyAction).to.not.be.called;
            });

        });


    });

});