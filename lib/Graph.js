'use strict';

var cocktail = require('cocktail'),
    Rule     = require('./Rule');

cocktail.mix({
    '@exports': module,
    '@as'     : 'class',

    rules: null,
    remaining : null,
    lastReturned: null,

    constructor: function () {
        this.rules = [];
    },

    addRule: function (regex, action) {
        action = action || this.noOp;
        this.rules.push(new Rule({regex: regex, action: action}));
    },

    setSource: function (source) {
        this.remaining = source;
    },

    run: function (source) {
        var me = this,
            rules = me.rules,
            l = rules.length,
            i = l - 1,
            longest = -1,
            input, rule, matched, match;

        input = source || me.remaining;

        for (; i >= 0; --i) {
            match = rules[i].matches(input);  

            if(match && match[0].length > longest){
                rule = rules[i];
                matched = match;
                longest = match[0].length;
            }
        }

        if (!rule) {
            throw new Error('No rule matching');
        }

        me.remaining = input.substring(longest);

        return rule.action.apply(me, [matched]);
        

    },

    next: function () {
        var me = this;
        return function () {
            return me.run();
        };
    },

    noOp: function (/*match*/) {
        var me = this;
        return me.run() ;        
    }
});