import { fstat } from 'fs';
import * as vscode from 'vscode';
import { posix, resolve } from 'path';
import { table } from 'console';
import { TextDecoder } from 'util';
import ProjectInfo from "./ProjectInfo";

class WorkspaceInfo {

    workspaceProjectsInfo: ProjectInfo[] = [];

    workspaceFoldersURI: vscode.Uri[] = [];
    /*workspaceFolder: vscode.Uri;

    constructor(folder: vscode.Uri) {
        this.workspaceFolder = folder;
    }*/

    addWorkspaceFolderURI(workspaceFolderURI: vscode.Uri) {
        this.workspaceFoldersURI.push(workspaceFolderURI);
    }

    addProjectToCurrentWorkspace(projectInfo: ProjectInfo) {
        this.workspaceProjectsInfo.push(projectInfo);
    }

    parseProjects() {
        
        
        // does not work
        this.workspaceFoldersURI.forEach((uri) => {
            // let currProjectInfo = new ProjectInfo(uri);
            // await currProjectInfo.parseprojectFiles(uri);
            // this.workspaceProjectsInfo.push(currProjectInfo);

            const createCurrProjectInfo = new Promise<ProjectInfo>((resolve) => {
                let currProjectInfo = new ProjectInfo(uri);
                resolve(currProjectInfo);
            }).then((abc) => (abc.parseprojectFiles(uri)))



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


export = WorkspaceInfo;

