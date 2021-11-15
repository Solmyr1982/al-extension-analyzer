// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { fstat } from 'fs';
import * as vscode from 'vscode';
import { posix } from 'path';
import { table } from 'console';
import { TextDecoder } from 'util';
import WorkspaceInfo from "./WorkspaceInfo";





let workspaceInfo = new WorkspaceInfo();








export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "al-extension-analyzer" is now active!');
	let command = vscode.commands.registerCommand('al-extension-analyzer.helloCat', () => {
		vscode.window.showInformationMessage('Hello Cat from AL Extension Analyzer!');
	});
	context.subscriptions.push(command);

	command = vscode.commands.registerCommand('al-extension-analyzer.helloDog', () => {
		vscode.window.showInformationMessage('Hello Dog from AL Extension Analyzer!');
	});
	context.subscriptions.push(command);

	command = vscode.commands.registerCommand('al-extension-analyzer.openStatistics', async () => {
		if (!vscode.workspace.workspaceFolders) {
			return vscode.window.showInformationMessage('No folder or project opened');
		}
		const folderUri = vscode.workspace.workspaceFolders[0].uri;

		//let workspaceInfo = new WorkspaceInfo(vscode.workspace.workspaceFolders);



		var writeStr = '';

		vscode.workspace.workspaceFolders.forEach((e) => {
			workspaceInfo.addWorkspaceFolderURI(e.uri);
		});
		workspaceInfo.parseProjects();




	});
	context.subscriptions.push(command);


}

// this method is called when your extension is deactivated
export function deactivate() { }

