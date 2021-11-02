
const vscode = require('vscode');
const rs = require('text-readability');

function activate(context) {

	const scoreDocumentCommandId = 'complexity-test.scoreDocument';
	context.subscriptions.push(vscode.commands.registerCommand(scoreDocumentCommandId, function () {

		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
            const documentText = document.getText();
			const score = rs.fleschKincaidGrade(documentText);
			vscode.window.showInformationMessage(`Flesch-Kincaid Readability Score: ${score}`);
        }
		else {
			vscode.window.showErrorMessage(`You must have an open editor with text to analyze to run this command`);
		}
	
	}));

	const scoreSelectionCommandId = 'complexity-test.scoreSelection';
	context.subscriptions.push(vscode.commands.registerCommand(scoreSelectionCommandId, () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const document = editor.document;
            const text = document.getText(selection);
			const score = rs.fleschKincaidGrade(text);
			vscode.window.showInformationMessage(`Flesch-Kincaid Readability Score for Selected Text: ${score}`);
        }
		else {
			vscode.window.showErrorMessage(`You must have text selected to use this command`);
		}
	}));

}


// this method is called when the extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
