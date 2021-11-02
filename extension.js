const vscode = require("vscode");
const rs = require("text-readability");

let statusBarItem;

function activate(context) {
  const scoreDocumentCommandId = "complexity-test.scoreDocument";
  context.subscriptions.push(
    vscode.commands.registerCommand(scoreDocumentCommandId, function () {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const score = getDocumentScore();
        vscode.window.showInformationMessage(
          `Flesch-Kincaid Readability Score: ${score}`
        );
      } else {
        vscode.window.showErrorMessage(
          `You must have an open editor with text to analyze to run this command`
        );
      }
    })
  );

  const scoreSelectionCommandId = "complexity-test.scoreSelection";
  context.subscriptions.push(
    vscode.commands.registerCommand(scoreSelectionCommandId, () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selection = editor.selection;
        const document = editor.document;
        const text = document.getText(selection);
        const score = getSelectionScore();
        vscode.window.showInformationMessage(
          `Flesch-Kincaid Readability Score for Selected Text: ${score}`
        );
      } else {
        vscode.window.showErrorMessage(
          `You must have text selected to use this command`
        );
      }
    })
  );

  const scoreDetailsCommandId = "complexity-test.showScoreDetails";
  context.subscriptions.push(
    vscode.commands.registerCommand(scoreDetailsCommandId, () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const text = document.getText();

        vscode.window.showInformationMessage(
          `Readability: ${rs.textStandard(text)}
				Syllable Count: ${rs.syllableCount(text, (lang = "en-US"))}
				Lexicon Count: ${rs.lexiconCount(text, (removePunctuation = true))}
				Sentence Count: ${rs.sentenceCount(text)}
				Flesch-Kincaid Grade Level: ${rs.fleschKincaidGrade(text)}`,
          { modal: true, detail: "document score" }
        );
      }
    })
  );

  // create a new status bar item that we can now manage
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.command = scoreDetailsCommandId;
  context.subscriptions.push(statusBarItem);

  // register some listener that make sure the status bar
  // item always up-to-date
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem)
  );
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem)
  );

  // update status bar item once at start
  updateStatusBarItem();
}

function getSelectionScore() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const selection = editor.selection;
    const document = editor.document;
    const text = document.getText(selection);
    return rs.fleschKincaidGrade(text);
  }
}

function getDocumentScore() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const documentText = document.getText();
    return rs.fleschKincaidGrade(documentText);
  }
}

function updateStatusBarItem() {
  const documentScore = getDocumentScore();
  const numLinesSelected = getNumberOfSelectedLines();

  if (documentScore && numLinesSelected > 0) {
    const selectionScore = getSelectionScore();
    statusBarItem.text = `$(book) Readability: ${selectionScore} (doc: ${documentScore})`;
    statusBarItem.show();
  } else if (documentScore) {
    statusBarItem.text = `$(book) Readability: ${documentScore}`;
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
}

function getNumberOfSelectedLines() {
  let lines = 0;
  if (vscode.window.activeTextEditor) {
    lines = vscode.window.activeTextEditor.selections.reduce(
      (prev, curr) => prev + (curr.end.line - curr.start.line),
      0
    );
  }
  return lines;
}

// this method is called when the extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
