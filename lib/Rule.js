'use strict';

var cocktail = require('cocktail'),
    Configurable = require('cocktail-trait-configurable');

cocktail.mix({
    '@exports' : module,
    '@as'      : 'class',

    '@traits'  : [Configurable],

    '@properties' : {
        regex  : null,
        action : null,
        runnable : true
    },

    constructor: function(options) {
        this.configure(options);
    },

    setRegex: function(regex){
        this.regex = new RegExp('^(?:'+regex.source+')');
        this.regex.compile(this.regex);
    },


    skip: function() {
        this.setRunnable(false);
    },

    matches: function(input){
        var me = this;

        if(!me.isRunnable()) {
            me.setRunnable(true);
            return null;
        }

        return input.match(me.regex);
    }

});
