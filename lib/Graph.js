'use strict';

var cocktail = require('cocktail'),
    Rule     = require('./Rule');

cocktail.mix({
    '@exports': module,
    '@as'     : 'class',

    /**
     * @private {Array}
     */
    rules: null,
    /**
     * @private {String}
     */
    remaining : null,

    constructor: function () {
        this.rules = [];
    },

    addRule: function (regex, action) {
        action = action || this.noOp;
        this.rules.push(new Rule({regex: regex, action: action}));
    },

    addAuxiliarAction: function(name, action) {
        if(!this[name]){
            this[name] = action;
        }
    },

    setSource: function (source) {
        this.remaining = source;
    },

    /**
     * @method run
     * runs the rules against the given source or remaining property if no source is provided.
     * The longest matching rule action is executed at the end or an Error is thrown if no matching rule is found.
     * @param source {String} the source. Optional.
     */
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
                matched = match[0];
                longest = matched.length;
            }
        }

        if (!rule) {
            throw new Error('No rule matching');
        }

        me.remaining = input.substring(longest);

        return rule.action.apply(me, [matched]);
    },

    /**
     * @method next
     * next method is returned from a rule action and it is called by the Lexer to pick up the next lexeme.
     */
    next: function () {
        var me = this;
        return function () {
            return me.run();
        };
    },

    /**
     * @method noOp
     * convenient method added when rule has no action to be performed.
     */
    noOp: function (/*match*/) {
        var me = this;
        return me.run();
    }
});
