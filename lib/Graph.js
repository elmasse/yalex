'use strict';

var cocktail = require('cocktail'),
    Rule     = require('./Rule');

cocktail.mix({
    '@exports': module,
    '@as'     : 'class',

    '@properties': {
        /**
         * {Array}
         */
        rules: null
    },

    /**
     * @private {String}
     */
    remaining : null,

    /**
     * @private {Object}
     */
    auxActions: null,

    /**
     * @private {Object}
     */
    expressions: null,

    actionReturns:{
        NO_OP : 'NO_OP',
        END   : false
    },

    constructor: function () {
        this.rules = [];
        this.auxActions = {END: false};
        this.expressions = {};
    },

    loadGrammar: function (grammar) {
        if (grammar) {
            this._parseExpressions(grammar.expressions);
            this._parseRules(grammar.rules);
        }
    },

    _parseExpressions: function (expressions) {
        var k, v;
        for (k in expressions) {
            v = expressions[k];
            this.addExpression(k, v);
        }
    },

    _parseRules: function (rules) {
        var k, v, action;

        for (k in rules) {
            v = rules[k];
            action = this._parseAction(v);
            this.addRule(k, action);
        }
    },

    _parseAction: function (actionStr) {
        var stmt = [].concat(actionStr.split('|')),
            l = stmt.length,
            actionScope = this.auxActions,
            actionFn, i;

        actionFn = l && function() {
            var ret, args, action, what, next, j, scope;
            for (i = 0; i < l; i++) {
                scope = actionScope;
                args = (ret !== undefined) ? [ret] : arguments;
                what = stmt[i];
                if (what.indexOf('.') !== -1){
                    next = what.split('.');
                    for (j in next) {
                        scope = action || actionScope;
                        action = (action) ? action[next[j]] : actionScope[next[j]];
                    }
                }else {
                    action = actionScope[what];
                }

                ret = (typeof action === 'function' ) ? action.apply(scope, args) : action;
            }

            return ret;
        };

        return actionFn;
    },

    loadHelpers: function (helpers) {
        cocktail.mix(this.auxActions, helpers);
    },

    addExpression: function (name, value) {
        this.expressions[name] = this.resolveExpressions(value);
    },

    resolveExpressions: function(reg) {
        var me = this,
            source = reg.source || reg,
            replaced = source,
            regex, exp, i, l, key, value;

        exp = source.match(/\{(.*?)\}/g);

        if (exp) {
            for ( i = 0, l = exp.length; i < l; i++ ) {
                key = exp[i];
                value = me.expressions[key];
                if (value && value.source){
                    replaced = replaced.replace(new RegExp(exp[i], 'g'), value.source);
                }
            }
        }

        regex = new RegExp(replaced);

        return regex;
    },

    addRule: function (regex, action) {
        var me = this;
        action = action || this.noOp();
        this.rules.push(new Rule({regex: me.resolveExpressions(regex), action: action}));
    },

    addAuxiliarAction: function(name, action) {
        if (!this.auxActions[name]) {
            this.auxActions[name] = action;
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
            longest = -1,
            i = l,
            input, rule, matched, match, action;

        input = source || me.remaining;

        while (i--) {
            match = rules[i].matches(input);

            if (match && match[0].length >= longest) {
                rule = rules[i];
                matched = match[0];
                longest = matched.length;
            }
        }

        if (!rule) {
            throw new Error('No rule matching');
        }

        me.remaining = input.substring(longest);

        action = rule.action.apply(me.auxActions, [matched]);

        switch (action) {
            case me.actionReturns.END:
                return action;
            case me.actionReturns.NO_OP:
                return me.run();
            default:
                return me.next();
        }
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
        return function(){
            return me.actionReturns.NO_OP;
        };
    }
});
