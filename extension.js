
const vscode = require('vscode');
const rs = require('text-readability');

// this method is called when the extension is activated
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "complexity-test" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('complexity-test.documentReadingScore', function () {

		const editor = vscode.window.activeTextEditor;
		if (editor) {
            // Get the document text
			let document = editor.document;
            const documentText = document.getText();
			const score = rs.fleschKincaidGrade(documentText)
			vscode.window.showInformationMessage(`Readability Score: ${score}`);
        }
		else {
			vscode.window.showErrorMessage(`You must have an open editor with text to analyze to run this command`);
		}
	
	});

	context.subscriptions.push(disposable);
}

// this method is called when the extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
