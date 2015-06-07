'use strict';

var cocktail = require('cocktail'),
    Configurable = require('cocktail-trait-configurable');

cocktail.mix({
    '@exports': module,
    '@as'     : 'class',

    '@traits' : [Configurable],

    '@static' : {
        TYPE  : {
            EOF        : 'EOF',
            KEYWORD    : 'KEYWORD',
            IDENTIFIER : 'IDENTIFIER',
            PUNCTUATOR : 'PUNCTUATOR',
            NUMBER     : 'NUMBER',
            STRING     : 'STRING',
            NULL       : 'NULL',
            BOOLEAN    : 'BOOLEAN',
            REGEX      : 'REGEX',
            COMMENT    : 'COMMENT'
        },

        _AS_TYPE: function (type, value, info) {
            var Token = this;

            return new Token({
                type  : type,
                value : value
            });
        },

        KEYWORD: function (value, info) {
            return this._AS_TYPE(this.TYPE.KEYWORD, value, info);
        },

        IDENTIFIER: function (value, info) {
            return this._AS_TYPE(this.TYPE.IDENTIFIER, value, info);
        },

        PUNCTUATOR: function (value, info) {
            return this._AS_TYPE(this.TYPE.PUNCTUATOR, value, info);
        },

        NUMBER: function (value, info) {
            return this._AS_TYPE(this.TYPE.NUMBER, value, info);
        },

        STRING: function (value, info) {
            return this._AS_TYPE(this.TYPE.STRING, value, info);
        },

        BOOLEAN: function (value, info) {
            return this._AS_TYPE(this.TYPE.BOOLEAN, value, info);
        },

        NULL: function (value, info) {
            return this._AS_TYPE(this.TYPE.NULL, value, info);
        },

        REGEX: function(value, info) {
            return this._AS_TYPE(this.TYPE.REGEX, value, info);
        },

        COMMENT: function(value, info) {
            return this._AS_TYPE(this.TYPE.COMMENT, value, info);
        },

        EOF: function (value, info) {
            return this._AS_TYPE(this.TYPE.EOF, 'eof', value, info);
        }
    },

    '@properties': {
        type  : null,
        value : null,
        line  : null,
        col   : null
    },

    constructor: function (options) {
        this.configure(options);
    },

    is: function(type) {
        return this.type === type;
    }
});
