"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const WorkspaceInfo_1 = __importDefault(require("./WorkspaceInfo"));
let workspaceInfo = new WorkspaceInfo_1.default();
function activate(context) {
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
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map