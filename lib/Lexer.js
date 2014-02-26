'use strict';

var cocktail = require('cocktail'),
    Graph    = require('./Graph');

cocktail.mix({
    '@exports': module,
    '@as'     : 'class',

    /**
     * @private
     */
    graph: null,

    /**
     *
     */
    initializer: function(){
        var me = this;

        me.graph = new Graph();

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
                    me.graph[name] = action;
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
        var graph = this.graph;

        if(graph){
            graph.setSource(source);
        }
    },

    /**
     * @method lex
     * runs the graph against the source and executes all actions associated to the matching rules
     * @param source {String} the source to be analyzed. Optional
     */
    lex: function(source){
        var me = this,
            graph = me.graph,
            ret;

        ret = source ? graph.run(source) : graph.next();

        while(typeof ret === 'function'){
            ret = ret.apply(me.graph);
        }

        return ret;
    },

    /**
     * @method next
     * runs the graph for the next matching rule and executes its associated action.
     */
    next: function(){
        var me = this,
            graph = me.graph;

        return graph.run();
    }    

});
