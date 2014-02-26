'use strict';

var cocktail = require('cocktail'),
    Graph    = require('./Graph');

cocktail.mix({
    '@exports': module,
    '@as'     : 'class',

    /**
     * @private {Graph}
     */
    graph: null,


    constructor: function() {
        this.graph = new Graph();
    },

    /**
     *
     */
    initializer: function(){
        var me = this;

        return function(option) {
            var regex, name;

            if(typeof option === "object") { 
                // regex definition
                regex = option;
                return function(action) {
                    me.graph.addRule(regex, action);
                };
            }else {
                // auxiliar methods defintions
                name = option;
                return function(action) {
                    // me.graph[name] = action;
                    me.graph.addAuxiliarAction(name, action);
                };
            }
        };  
    },

    /**
     * @method setSource
     * set the given source in the graph process
     * @param source {String}
     */
    setSource: function(source) {
        this.graph.setSource(source);
    },

    /**
     * @method lex
     * runs the graph against the source and executes all actions associated to the matching rules
     * @param source {String} the source to be analyzed. Optional
     */
    lex: function(source){
        var me = this,
            graph = me.graph,
            next;

        if (source) {
            graph.setSource(source);
        }

        next = graph.run();

        while(typeof next === 'function'){
            next = next.apply(graph);
        }        
    },

    /**
     * @method next
     * runs the graph for the next matching rule and executes its associated action.
     */
    next: function(){
        this.graph.run();
    }    

});
