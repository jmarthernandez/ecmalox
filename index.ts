import rlSync from "readline-sync";
import { Scanner } from "./scanner";

export class Lox {
  static hadError: boolean = false;

  main(args: string[]) {
    args = args.slice(2);
    if (args.length > 1) {
      console.log("Usage: jlox [script]");
      return;
    } else if (args.length == 1) {
      this.runFile(args[0]);
    } else {
      this.runPrompt();
    }
  }

  static error(line: number, message: string) {
    this.report(line, "", message);
  }

  private static report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error ${where}: ${message}`);
    Lox.hadError = true;
  }

  private runPrompt() {
    console.log("Welcome to ECMALox");
    while (true) {
      const input = rlSync.question("ECMALox> ");
      this.run(input);
      Lox.hadError = false;
    }
  }

  private runFile(path: string) {
    console.log(path);
    if (Lox.hadError) {
      process.exit(65);
    }
  }

  run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    // For now, just print the tokens.
    for (const token of tokens) {
      console.log(token.toString());
    }
  }
}

const lox = new Lox();
// lox.main(["{}"]);

const script = `
class Bacon {
  eat() {
    print "Crunch crunch crunch!";
  }
}

Bacon().eat(); // Prints "Crunch crunch crunch!".
`;
lox.run(script);
