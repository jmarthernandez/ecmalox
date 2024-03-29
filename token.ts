export enum TokenType {
  // Single-character tokens.
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  COMMA,
  DOT,
  MINUS,
  PLUS,
  SEMICOLON,
  SLASH,
  STAR,

  // One or two character tokens.
  BANG,
  BANG_EQUAL,
  EQUAL,
  EQUAL_EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,

  // Literals.
  IDENTIFIER,
  STRING,
  NUMBER,

  // Keywords.
  AND,
  CLASS,
  ELSE,
  FALSE,
  FUN,
  FOR,
  IF,
  NIL,
  OR,
  PRINT,
  RETURN,
  SUPER,
  THIS,
  TRUE,
  VAR,
  WHILE,

  EOF
}
export const keywords = new Map<string, TokenType>();

keywords.set("and", TokenType.AND);
keywords.set("class", TokenType.CLASS);
keywords.set("else", TokenType.ELSE);
keywords.set("false", TokenType.FALSE);
keywords.set("for", TokenType.FOR);
keywords.set("fun", TokenType.FUN);
keywords.set("if", TokenType.IF);
keywords.set("nil", TokenType.NIL);
keywords.set("or", TokenType.OR);
keywords.set("print", TokenType.PRINT);
keywords.set("return", TokenType.RETURN);
keywords.set("super", TokenType.SUPER);
keywords.set("this", TokenType.THIS);
keywords.set("true", TokenType.TRUE);
keywords.set("var", TokenType.VAR);
keywords.set("while", TokenType.WHILE);

export class Token {
  type: TokenType;
  lexeme: string;
  literal: Object;
  line: number;

  constructor(type: TokenType, lexeme: string, literal: any, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  public toString(): string {
    return `TOKEN: ${TokenType[this.type]} ${this.lexeme} ${this.literal}`;
  }
}
