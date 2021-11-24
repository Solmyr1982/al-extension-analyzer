import { fstat } from 'fs';
import * as vscode from 'vscode';
import { posix, resolve } from 'path';
import { table } from 'console';
import { TextDecoder } from 'util';
import ProjectInfo from "./projectinfo";

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

    calcAllProjectsValues() {
        this.workspaceProjectsInfo.forEach((projectsInfo) => {
            projectsInfo.calcprojectValues();
        });
    }

    async parseProjects() {

        /*
                this.workspaceFoldersURI.forEach((uri) => {
                    new Promise<ProjectInfo>((resolve) => {
                        let currProjectInfo = new ProjectInfo(uri);
                        resolve(currProjectInfo);
                    }).then(async (result) => {
                        await result.parseprojectFiles(uri);
                        return new Promise<ProjectInfo>((resolve) => resolve(result));
                    }).then((result) => {
                        result.calcprojectValues();
                        return new Promise<ProjectInfo>((resolve) => resolve(result));
                    }).then((bcd) => this.workspaceProjectsInfo.push(bcd))
                        .catch(a => console.log(a));
                });
        */




        this.workspaceFoldersURI.forEach((uri) => {
            console.log('1 creating new ProjectInfo for uri ' + uri.path);
            new Promise<ProjectInfo>((resolve) => {
                let currProjectInfo = new ProjectInfo(uri);
                resolve(currProjectInfo);
            }).then(async (result) => {
                console.log('2 starting to parse project ' + result.projectFolder);
                await result.parseprojectFiles(uri);
                return new Promise<ProjectInfo>((resolve) => resolve(result));
            }).then((bcd) => {
                console.log('3 pushing project ' + bcd.projectFolder);
                this.workspaceProjectsInfo.push(bcd);
            }
            )
                .catch(a => console.log(a));
        });

        console.log('4 finished parsing uri\'s');




    }



}


export = WorkspaceInfo;

