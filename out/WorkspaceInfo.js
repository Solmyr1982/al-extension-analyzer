"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ProjectInfo_1 = __importDefault(require("./ProjectInfo"));
class WorkspaceInfo {
    constructor() {
        this.workspaceProjectsInfo = [];
        this.workspaceFoldersURI = [];
    }
    /*workspaceFolder: vscode.Uri;

    constructor(folder: vscode.Uri) {
        this.workspaceFolder = folder;
    }*/
    addWorkspaceFolderURI(workspaceFolderURI) {
        this.workspaceFoldersURI.push(workspaceFolderURI);
    }
    addProjectToCurrentWorkspace(projectInfo) {
        this.workspaceProjectsInfo.push(projectInfo);
    }
    parseProjects() {
        // does not work
        this.workspaceFoldersURI.forEach((uri) => {
            // let currProjectInfo = new ProjectInfo(uri);
            // await currProjectInfo.parseprojectFiles(uri);
            // this.workspaceProjectsInfo.push(currProjectInfo);
            const createCurrProjectInfo = new Promise((resolve) => {
                let currProjectInfo = new ProjectInfo_1.default(uri);
                resolve(currProjectInfo);
            }).then((abc) => (abc.parseprojectFiles(uri)));
        });
        // does not work at all
        /*
        this.workspaceFoldersURI.forEach(async (uri) => {
            let currProjectInfo = new ProjectInfo(uri);

            const createcurrProjectInfo = new Promise<void>((resolve) => {
                currProjectInfo = new ProjectInfo(uri);
                resolve();
            });

            const pareProject = new Promise<void>((resolve) => {
                //let testSubClass = new TestSubClass();
                currProjectInfo.parseprojectFiles(uri);
                resolve();
            });

            const addCurrProjectToWorkspace = new Promise<void>((resolve) => {
                //let testSubClass = new TestSubClass();
                //testSubClass.doSubJob();
                this.workspaceProjectsInfo.push(currProjectInfo);
                resolve();
            });

            createcurrProjectInfo.then(() => pareProject.then(() => addCurrProjectToWorkspace));
            
        });*/
    }
}
module.exports = WorkspaceInfo;
//# sourceMappingURL=WorkspaceInfo.js.map