const fs = require("fs");

function defineAst(baseName: string, types: string[]) {
  const writeStream = fs.createWriteStream("expr.ts");
  writeStream.write("import { Token } from './token'\n\n");

  writeStream.write(`export abstract class ${baseName} {\n`);
  writeStream.write(`  abstract accept<R>(visitor: Visitor<R>): R;\n`);
  writeStream.write("}\n\n");

  defineVisitor(writeStream, baseName, types);

  for (let t of types) {
    const className = t.split(" : ")[0].trim();
    const fields = t.split(" : ")[1].trim();
    defineType(writeStream, baseName, className, fields);
  }

  writeStream.close();
}

function defineType(
  writer: any,
  baseName: string,
  className: string,
  fieldList: string
) {
  writer.write(`export class ${className} extends ${baseName} {\n`);

  const fields = fieldList.split(", ");
  // Fields.
  for (let field of fields) {
    writer.write(`  readonly ${field};\n`);
  }

  // Constructor.
  writer.write(`\n  constructor(${fieldList}) {\n`);
  writer.write("    super();\n");

  // Store parameters in fields.
  for (let field of fields) {
    const name = field.split(": ")[0];
    writer.write("    this." + name + " = " + name + ";\n");
  }

  writer.write("  }\n\n");

  writer.write("  public accept<R>(visitor: Visitor<R>): R {\n");
  writer.write(`    return visitor.visit${className}Expr(this);\n`);
  writer.write("  }\n");
  writer.write("}\n\n");
}

function defineVisitor(writer: any, baseName: string, types: string[]) {
  writer.write("export interface Visitor<R> {\n");

  for (let t of types) {
    const typeName = t.split(":")[0].trim();
    writer.write(
      `  visit${typeName}${baseName}(${baseName.toLowerCase()}: ${typeName}): R;\n`
    );
  }

  writer.write("}\n\n");
}

defineAst("Expr", [
  "Binary   : left: Expr, operator: Token, right: Expr",
  "Grouping : expression: Expr",
  "Literal  : value: any",
  "Unary    : operator: Token, right: Expr"
]);
