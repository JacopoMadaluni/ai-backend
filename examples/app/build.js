const ts = require("typescript");
const fs = require("fs");

function parseTypeToJson(node) {
	if (ts.isTypeLiteralNode(node) || ts.isInterfaceDeclaration(node)) {
		const result = {};
		(node.members || []).forEach((member) => {
			if (ts.isPropertySignature(member) && member.name && member.type) {
				const propertyName = member.name.getText();
				result[propertyName] = parseTypeToJson(member.type);
			}
		});
		return result;
	} else if (ts.isArrayTypeNode(node)) {
		return [parseTypeToJson(node.elementType)];
	} else if (ts.isLiteralTypeNode(node)) {
		if (ts.isStringLiteral(node.literal)) {
			return node.literal.text; // Use .text instead of .getText() to remove quotes
		}
		return node.literal.getText();
	} else if (ts.isToken(node)) {
		switch (node.kind) {
			case ts.SyntaxKind.StringKeyword:
				return "string";
			case ts.SyntaxKind.NumberKeyword:
				return "number";
			case ts.SyntaxKind.BooleanKeyword:
				return "boolean";
			default:
				return "unknown";
		}
	} else if (ts.isTypeReferenceNode(node)) {
		return node.typeName.getText();
	} else if (ts.isUnionTypeNode(node)) {
		return node.types.map((t) => parseTypeToJson(t));
	}
	return "unknown";
}

function processFile(filePath) {
	const fileContent = fs.readFileSync(filePath, "utf-8");
	const sourceFile = ts.createSourceFile(
		filePath,
		fileContent,
		ts.ScriptTarget.Latest,
		true
	);

	const result = {};

	ts.forEachChild(sourceFile, (node) => {
		if (ts.isTypeAliasDeclaration(node) && node.name && node.type) {
			const typeName = node.name.getText();
			result[typeName] = parseTypeToJson(node.type);
		} else if (ts.isInterfaceDeclaration(node) && node.name) {
			const interfaceName = node.name.getText();
			result[interfaceName] = parseTypeToJson(node);
		} else if (ts.isEnumDeclaration(node) && node.name) {
			const enumName = node.name.getText();
			const enumMembers = {};
			node.members.forEach((member) => {
				if (member.name) {
					const memberName = member.name.getText();
					const initializer = member.initializer
						? member.initializer.getText()
						: memberName;
					enumMembers[memberName] = initializer;
				}
			});
			result[enumName] = enumMembers;
		}
	});

	const outputPath = filePath.replace(".ts", ".json");
	fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
	console.log(`Parsed types written to ${outputPath}`);
}

const filePath = "./src/@types.ts";
processFile(filePath);

const filePath2 = "./src/@types.mid.ts";
processFile(filePath2);

const filePath3 = "./src/@types.wth.ts";
processFile(filePath3);
