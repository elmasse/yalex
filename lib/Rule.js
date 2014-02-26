'use strict';

var cocktail = require('cocktail'),
    Configurable = require('cocktail-trait-configurable');

cocktail.mix({
    '@exports' : module,
    '@as'      : 'class',

    '@traits'  : [Configurable],

    '@properties' : {
        regex  : null,
        action : null
    },

    constructor: function(options) {
        this.configure(options);
    },

    setRegex: function(regex){
        this.regex = new RegExp('^('+regex.source+')');
        this.regex.compile(this.regex);
    },

    matches: function(input){
        var me = this,
            ret = input.match(me.regex);

        if(ret){
          ret.shift();  
        } 

        return ret;
    }

});