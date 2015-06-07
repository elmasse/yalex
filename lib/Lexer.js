'use strict';

var cocktail     = require('cocktail'),
    Configurable = require('cocktail-trait-configurable'),
    Graph        = require('./Graph'),
    fs           = require('fs');

cocktail.mix({
    '@exports': module,
    '@as'     : 'class',

    '@traits' : [Configurable],

    /**
     * @private {Graph}
     */
    graph: null,


    '@static': {
        /**
         * @method create
         * Returns a lexer instance created with the given options.
         * @params options {Object}
         * - grammar {Object}
         * - helpers {Object}
         * - json {String} path to json file containing the grammar definition. Optional
         * - source {String} source to be analyzed. Optional
         */
        create: function (options) {
            var Lexer = this;
            return new Lexer(options);
        }
    },

    constructor: function (options) {
        this.graph = new Graph();

        this.configure(options);
    },

    setJson: function (file) {
        var json = JSON.parse(fs.readFileSync(file));
        this.setGrammar(json);
    },

    setGrammar: function (grammar) {
        var me = this,
            graph = me.graph;

        if (grammar) {
            graph.loadGrammar(grammar);
        }
    },

    setHelpers: function (helpers) {
        this.graph.loadHelpers(helpers);
    },

    getRuleAt: function(idx) {
        var rules = this.graph.getRules();
        return rules[idx];
    },

    /**
     *
     */
    initializer: function () {
        var me = this;

        return function(option) {
            var regex, name;

            if (option && option.source) {
                // regex definition
                regex = option;
                return function(action) {
                    me.graph.addRule(regex, action);
                };
            } else {
                name = option;
                return function(value) {
                    if (typeof value === 'function'){
                        me.graph.addAuxiliarAction(name, value);
                    } else {
                        me.graph.addExpression(name, value);
                    }
                };
            }
        };
    },

    /**
     * @method setSource
     * set the given source in the graph process
     * @param source {String}
     */
    setSource: function (source) {
        this.graph.setSource(source);
    },

    /**
     * @method lex
     * runs the graph against the source and executes all actions associated to the matching rules
     * @param source {String} the source to be analyzed. Optional
     */
    lex: function (source) {
        var me = this,
            graph = me.graph,
            next;

        if (source) {
            me.setSource(source);
        }

        next = graph.run();

        while (typeof next === 'function') {
            next = next.apply(graph);
        }
    },

    /**
     * @method next
     * runs the graph for the next matching rule and executes its associated action.
     */
    next: function () {
        this.graph.run();
    }

});
