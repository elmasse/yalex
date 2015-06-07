module.exports = {
    expressions: {
        '{eof}'            : '$',
        '{delim}'          : '[ \\s\\n\\t]',
        '{keyword}'        : 'break|class|case|catch|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|function|if|import|in(?:stanceof)?|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with|yield',
        '{digit}'          : '[0-9]',
        '{alpha}'          : '[a-zA-Z]',
        '{null}'           : 'null',
        '{boolean}'        : 'true|false',
        '{punctuator}'     : '\\.|\\(|\\)|\\{|\\}|\\[|\\]|\\:|\\;|\\,|\\!(?:={1,2})?|\\?|\\~|&{1,2}|\\|{1,2}|\\+\\+|\\-\\-|\\=\\=\\=|(?:(\\+|\\-|\\^|\\=|\\*|\\+|\\%|\\>{1,3}|<{1,2}|\\/)=?)',
        '{string}'         : '(["\'])(?:\\\\.|(?!\\1).)*\\1',
        '{decimal}'        : '({digit}*\\.?{digit}+)(E[+-]?{digit}+)?',
        '{octal}'          : '(0([0-7])+)',
        '{hexa}'           : '0[xX][0-9a-fA-F]+',
        '{number}'         : '{octal}|{hexa}|{decimal}',
        '{identifier}'     : '({alpha}|_|\\$)({alpha}|{digit}|_|\\$)*',
        '{regex}'          : '(\\/)(?:\\\\.|(?!\\1).)*\\1(?:[igmy]+)*',
        '{inline-comment}' : '\\/\\/(?:.*)',
        '{block-comment}'  : '(?:\\/\\*(?:[\\s\\S]*?)\\*\\/)|(?:([\\s;])+\\/\\/(?:.*)$)'
    },
    rules: {
        '{keyword}'        : 'Token.KEYWORD|add',
        '{null}'           : 'Token.NULL|add',
        '{boolean}'        : 'Token.BOOLEAN|add',
        '{inline-comment}' : '',
        '{block-comment}'  : '',
        '{identifier}'     : 'Token.IDENTIFIER|add|skipRegexRule',
        '{regex}'          : 'Token.REGEX|add',
        '{punctuator}'     : 'Token.PUNCTUATOR|add|shouldSkipNextRegex',
        '{string}'         : 'Token.STRING|add',
        '{number}'         : 'Token.NUMBER|add|skipRegexRule',
        '{delim}+'         : '',
        '{eof}'            : 'Token.EOF|add|END'
    }
};
