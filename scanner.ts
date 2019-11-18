import { Token, TokenType, keywords } from "./token";
import { Lox } from "./index";

export class Scanner {
  readonly source: string;
  tokens: Token[];
  start: number;
  current: number;
  line: number;

  constructor(source: string) {
    this.source = source;
    this.tokens = [] as Token[];
    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  private isAtEnd() {
    return this.current >= this.source.length;
  }

  private isDigit(c: string) {
    return c >= "0" && c <= "9";
  }

  private isAlpha(c: string) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
  }

  private isAlphaNumberic(c: string) {
    return this.isDigit(c) || this.isAlpha(c);
  }

  private advance() {
    this.current++;
    return this.source[this.current - 1];
  }

  private addToken(type: TokenType, literal?: any) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }

  private match(expected: string) {
    if (this.isAtEnd()) {
      return false;
    }
    if (this.source[this.current] != expected) {
      return false;
    }

    this.current++;
    return true;
  }

  private peek() {
    if (this.isAtEnd()) {
      return "\0";
    }
    return this.source[this.current];
  }

  private peekNext() {
    if (this.current + 1 > this.source.length) {
      return "\0";
    }
    return this.source[this.current + 1];
  }

  private string() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == "\n") {
        this.line++;
      }
      this.advance();
    }

    // Unterminated string.
    if (this.isAtEnd()) {
      Lox.error(this.line, "Unterminated string.");
      return;
    }

    // The closing ".
    this.advance();

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  private number() {
    // keep gobbling numbers until we hit something else
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    // we hit a nondigit!  If it's a decimal we will check the next next char
    // to see if it is a digit.
    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      this.advance();
      // We keep gobbling the digits after the decimal
      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    this.addToken(
      TokenType.NUMBER,
      parseFloat(this.source.substring(this.start, this.current))
    );
  }

  private identifier() {
    while (this.isAlphaNumberic(this.peek())) {
      this.advance();
    }
    const text = this.source.substring(this.start, this.current);
    let type = keywords.get(text);

    this.addToken(type || TokenType.IDENTIFIER, text);
  }

  private scanToken() {
    const c = this.advance();
    switch (c) {
      // SINGLE CHAR LEXEMES
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ",":
        this.addToken(TokenType.COMMA);
        break;
      case ".":
        this.addToken(TokenType.DOT);
        break;
      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON);
        break;
      case "*":
        this.addToken(TokenType.STAR);
        break;
      // DOULBE CHAR LEXEMES
      case "!":
        // if the next token is an equal we are != otherwise we are ! and
        // the next character is a separate lexeme
        this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case "=":
        this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
        );
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );
        break;
      // STRINGS
      case '"':
        this.string();
        break;
      // COMMENTS
      case "/":
        if (this.match("/")) {
          // A comment goes until the end of the line.
          while (this.peek() != "\n" && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      // WHITESPACE - Ignored
      case " ":
        break;
      case "\r":
        break;
      case "\t":
        break;
      // Newline is whitespace but we want to increment line so that errors are accurate
      case "\n":
        this.line++;
        break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          Lox.error(this.line, `Unexpected character ${c}`);
        }
        break;
    }
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      // We are at the beginning of the next lexeme.
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    return this.tokens;
  }
}
