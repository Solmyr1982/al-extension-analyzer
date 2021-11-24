// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { fchown, fchownSync, fstat } from 'fs';
import * as vscode from 'vscode';
import { posix, resolve } from 'path';
import { table } from 'console';
import { TextDecoder } from 'util';
import WorkspaceInfo from "./WorkspaceInfo";
import { ALObject, IDRange, ALObjectHealth, LicenseObject, ALObjectType, ALFieldHealth, ALField, PermissionReport } from './datatypes';

import { Resolver } from 'dns';
import internal from 'stream';
//import { runAsyncFunctions } from './test';




let workspaceInfo = new WorkspaceInfo();

let aLObjects: ALObject[] = [];
let permissionReports: PermissionReport[] = [];
let iDRanges: IDRange[] = [];


async function parseprojectFiles(nextUri: vscode.Uri, project: string) {
	if (project !== '') {
		for (const [name, type] of await vscode.workspace.fs.readDirectory(nextUri)) {
			if (type === vscode.FileType.File) {
				if ((name.indexOf('.al') !== -1) || (name === 'app.json') || (name.indexOf('Permission Report Detailed') !== -1)) {
					const currFileUri = nextUri.with({ path: posix.join(nextUri.path, name) });
					const fileBinaryData = await vscode.workspace.fs.readFile(currFileUri);
					const fileTextData = new TextDecoder("utf-8").decode(fileBinaryData);

					if (name.indexOf('Permission Report Detailed') === 0) { parsePermissionReport(project, fileTextData); }
					if (name.indexOf('.al') !== -1) { parseALFile(project, name, fileTextData); }
					if (name === 'app.json') { parseAppFile(project, fileTextData); }
				}
			}
			if (type === vscode.FileType.Directory) {
				let path = nextUri.fsPath;
				let uri = vscode.Uri.file(path + '/' + name);
				await parseprojectFiles(uri, project);
			}
		}
	}
	else
		if (vscode.workspace.workspaceFolders) {
			vscode.workspace.workspaceFolders.forEach(async (e) => {
				for (const [name, type] of await vscode.workspace.fs.readDirectory(e.uri)) {
					if (type === vscode.FileType.File) {
						if ((name.indexOf('.al') !== -1) || (name === 'app.json') || (name.indexOf('Permission Report Detailed') !== -1)) {
							const currFileUri = e.uri.with({ path: posix.join(e.uri.path, name) });
							const fileBinaryData = await vscode.workspace.fs.readFile(currFileUri);
							const fileTextData = new TextDecoder("utf-8").decode(fileBinaryData);

							if (name.indexOf('Permission Report Detailed') === 0) { parsePermissionReport(e.uri.path, fileTextData); console.log(e.uri.path); }
							if (name.indexOf('.al') !== -1) { parseALFile(e.uri.path, name, fileTextData); console.log(e.uri.path); }
							if (name === 'app.json') { parseAppFile(e.uri.path, fileTextData); console.log(e.uri.path); }
						}
					}
					if (type === vscode.FileType.Directory) {
						let path = e.uri.fsPath;
						let uri = vscode.Uri.file(path + '/' + name);
						await parseprojectFiles(uri, e.uri.path);
					}
				}
			});
		}
	return true;
}

function parsePermissionReport(project: string, fileTextData: string) {
	//this.permissionReporFound = true;
	var lines = fileTextData.split('\r\n');
	var inObjects = false;
	lines.forEach(line => {
		if (line === 'Object Assignment') {
			inObjects = true;
		}
		if (inObjects && line === 'Module Objects and Permissions') {
			return;
		}

		if (inObjects) {
			let alObjectType = ALObjectType.unknown;

			if (line.indexOf('TableData') === 0) {
				alObjectType = ALObjectType.table;
			}
			if (line.indexOf('Report') === 0) {
				alObjectType = ALObjectType.report;
			}
			if (line.indexOf('Codeunit') === 0) {
				alObjectType = ALObjectType.codeunit;
			}
			if (line.indexOf('Page') === 0) {
				alObjectType = ALObjectType.page;
			}
			if (line.indexOf('Query') === 0) {
				alObjectType = ALObjectType.xmlport;
			}

			if (alObjectType !== ALObjectType.unknown) {
				line = line.replace(/[^\d\s]+/gi, "");
				var lineParameters = line.split(" ");
				var qty = 0;
				var fromValue = 0;
				var toValue = 0;
				var counter = 0;
				for (var i = 0; i < lineParameters.length; i++) {
					if (lineParameters[i] !== '') {
						if (counter === 2) {
							toValue = parseInt(lineParameters[i]);
							counter++;
						}
						if (counter === 1) {
							fromValue = parseInt(lineParameters[i]);
							counter++;
						}
						if (counter === 0) {
							qty = parseInt(lineParameters[i]);
							counter++;
						}
					}
				}

				let permissionReport = {} as PermissionReport;
				permissionReport.licenseObjects = [];
				for (var i = fromValue; i <= toValue; i++) {
					let licenseObject = {} as LicenseObject;
					licenseObject.id = i;
					licenseObject.type = alObjectType;
					// this.addLicenseObject(licenseObject);


					permissionReport.project = project;
					permissionReport.licenseObjects.push(licenseObject);

					permissionReports.push(permissionReport);
				}
			}
		}
	});
}


function parseALFile(project: string, fileName: string, fileTextData: string) {
	var lines = fileTextData.split('\r\n');
	var inObject = false;
	var inFields = false;
	var currLevel = 0;
	var alObject: ALObject;

	lines.forEach(line => {
		if ((line.length) && isLetter(line.charAt(0))) {
			alObject = {} as ALObject;
			alObject.project = project;
			alObject.alFields = [];
			inObject = true;
			var objectParameters = line.split(" ");
			alObject.type = convertTxtToEnum(objectParameters[0]);
			objectParameters.shift();
			alObject.id = parseInt(objectParameters[0]);
			objectParameters.shift();
			if (alObject.type === ALObjectType.pageextension || alObject.type === ALObjectType.tableextension || alObject.type === ALObjectType.reportextension) {
				objectParameters = objectParameters.join(" ").split("extends");
				alObject.name = objectParameters[0].replace(/"/g, "");
				alObject.extends = objectParameters[1].replace(/"/g, "");
			}
			else {
				alObject.name = objectParameters.join(" ").replace(/"/g, "");
				alObject.fileName = fileName;
			}
			if (alObject.name) { alObject.name = alObject.name.trim(); }
			if (alObject.extends) { alObject.extends = alObject.extends.trim(); }
		}

		if (inObject && alObject.type === ALObjectType.tableextension) {
			var refinedLine = line.trim();
			if (refinedLine === 'fields') {
				inFields = true;
			}

			if (inFields && refinedLine === '{') {
				currLevel += 1;
			}

			if (inFields && refinedLine === '}') {
				currLevel -= 1;
				if (currLevel === 0) {
					inFields = false;
					alObject.fieldHealth = {} as ALFieldHealth;
					alObject.fieldHealth.percentUsed = 0;
					alObject.fieldHealth.quantityUsed = alObject.alFields.length;
					//$$$alObject.fieldHealth.percentUsed = alObject.fieldHealth.quantityUsed * 100 / this.totalQuantityOfObjects;
					//$$$alObject.fieldHealth.percentUsed = Math.round((alObject.fieldHealth.percentUsed + Number.EPSILON) * 100) / 100;
				}
			}

			if (inFields && currLevel > 0 && refinedLine.indexOf('field') === 0) {
				var fieldParameters = refinedLine.split(";");
				let alField = {} as ALField;
				alField.id = parseInt(fieldParameters[0].replace(/[^0-9]/g, ''));
				alField.name = fieldParameters[1].replace(/"/g, "").trim();
				alObject.alFields.push(alField);
			}
		}

		if ((line.length) && (line.charAt(0) === '}')) {
			inObject = false;
			//this.addALObject(alObject);
			aLObjects.push(alObject);
		}
	});

}

function parseAppFile(project: string, fileTextData: string) {
	const appData = JSON.parse(fileTextData);
	for (var i = 0; i < appData.idRanges.length; i++) {
		let idRange = {} as IDRange;
		idRange.project = project;
		idRange.fromID = appData.idRanges[i].from;
		idRange.toID = appData.idRanges[i].to;
		idRange.totalQty = idRange.toID - idRange.fromID + 1;
		//this.addIDRange(idRange);
		iDRanges.push(idRange);
	}
	//$$this.calcTotalQuantity();
}

function convertTxtToEnum(txtType: string) {
	switch (txtType) {
		case 'table':
			return ALObjectType.table;
		case 'tableextension':
			return ALObjectType.tableextension;
		case 'page':
			return ALObjectType.page;
		case 'pageextension':
			return ALObjectType.pageextension;
		case 'report':
			return ALObjectType.report;
		case 'reportextension':
			return ALObjectType.reportextension;
		case 'codeunit':
			return ALObjectType.codeunit;
		case 'query':
			return ALObjectType.query;
		case 'xmlport':
			return ALObjectType.xmlport;
		default:
			return ALObjectType.unknown;
	}
}


function isLetter(str: string) {
	return str.match(/[a-z]/i);
}

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
		//workspaceInfo = new WorkspaceInfo();

		/*vscode.workspace.workspaceFolders.forEach((e) => {
			workspaceInfo.addWorkspaceFolderURI(e.uri);
			console.log('adding folder ' + e.uri.path);
		});
		await workspaceInfo.parseProjects();*/


		//workspaceInfo.calcAllProjectsValues();

		//console.log(workspaceInfo.workspaceProjectsInfo);




		//vscode.workspace.workspaceFolders.forEach(async (e) => {
		//workspaceInfo.addWorkspaceFolderURI(e.uri);

		let u = {} as vscode.Uri;
		//parseprojectFiles(u, '');
		//runAsyncFunctions();

		//saveMyClass(u,'').then(() => console.log("Task Complete!"));
		//parseprojectFiles(u, '').then(() => console.log("Task Complete!"));

		//parseprojectFiles(u, '').then(_ => doNextStep());
		//console.log('fin');

		//doAsyncStuff().then(_ => doNextStep());





		//console.log('fin');

		//doAsyncStuff();
		//console.log('fin');

		//});

		//mainFnc();

		//console.log(aLObjects.length);

		//console.log(permissionReports.length);



		//test1();


		await Promise.all(vscode.workspace.workspaceFolders.map(async x => {


			//for (const [name, type] of await vscode.workspace.fs.readDirectory(x.uri)) {
			//console.log(name);
			//}
			await readFolders(x.uri,x.uri.path);



		}));



		console.log('########################### FIN ########################### ');
		console.log(aLObjects);
		console.log(permissionReports);
		console.log(iDRanges);


	});



	context.subscriptions.push(command);


}

async function readFolders(vscodeUri: vscode.Uri, project: string) {
	for (const [name, type] of await vscode.workspace.fs.readDirectory(vscodeUri)) {
		if (type === vscode.FileType.File) {
			if ((name.indexOf('.al') !== -1) || (name === 'app.json') || (name.indexOf('Permission Report Detailed') !== -1)) {
				const currFileUri = vscodeUri.with({ path: posix.join(vscodeUri.path, name) });
				const fileBinaryData = await vscode.workspace.fs.readFile(currFileUri);
				const fileTextData = new TextDecoder("utf-8").decode(fileBinaryData);

				console.log(project + ' : ' + name);
				if (name.indexOf('Permission Report Detailed') === 0) { parsePermissionReport(project, fileTextData); }
				if (name.indexOf('.al') !== -1) { parseALFile(project, name, fileTextData); }
				if (name === 'app.json') { parseAppFile(project, fileTextData); }
			}
		}
		if (type === vscode.FileType.Directory) {
			let path = vscodeUri.fsPath;
			let uri = vscode.Uri.file(path + '/' + name);
			await readFolders(uri, project);
		}
	}
}

function doSomethingAsync(value: number) {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log("Resolving " + value);
			resolve(value);
		}, Math.floor(Math.random() * 1000));
	});
}

function test() {
	const promises = [];

	for (let i = 0; i < 5; ++i) {
		promises.push(doSomethingAsync(i));
	}

	Promise.all(promises)
		.then((results) => {
			console.log("All done", results);
		})
		.catch((e) => {
			// Handle errors here
		});
}

function doSomethingAsync1(value: vscode.WorkspaceFolder) {
	return new Promise((resolve) => {
		let a = vscode.workspace.fs.readDirectory(value.uri);

		setTimeout(() => {
			console.log("Resolving " + a + value.uri.path);
			resolve(value);
		}, Math.floor(Math.random() * 1000));
	});
}

function test1() {
	const promises = [];
	promises.push('zero');

	//for (let i = 0; i < 5; ++i) {
	//promises.push(doSomethingAsync1(i));
	//}
	vscode.workspace.workspaceFolders?.map(x => {

		promises.push(doSomethingAsync1(x));
	});





	Promise.all(promises)
		.then((results) => {
			console.log("All done", results);
		})
		.catch((e) => {
			// Handle errors here
		});
}




async function doAsyncStuff() {
	if (vscode.workspace.workspaceFolders) {
		vscode.workspace.workspaceFolders.forEach(async (e) => {
			for (const [name, type] of await vscode.workspace.fs.readDirectory(e.uri)) {
				console.log(name);
			}
		});

	}
	console.log('and of doAsyncStuff');
	return true;
}

function doNextStep() {
	console.log('next step');
}




/*
function saveMyClass(u: vscode.Uri, project: string) {
	return new Promise<void>((resolve, reject) => {
		//saving MyClass using http service
		//return the saved MyClass or error
		//let u = {} as vscode.Uri;
		var savedPackage: Promise<void> = parseprojectFiles(u, '');


		setTimeout(() => {
			resolve(savedPackage);
		}, 1500);
	});
}
*/

const baseApi = 'https://reqres.in/api/users?page=1';




//let data: any;
const fetchAllEmployees = async (url: string): Promise<number> => {
	const response = await getURL(url);
	const data = response;
	// await delay(5000);
	await delay2();
	//let u = {} as vscode.Uri;
	//await parseprojectFiles(u, '');

	return data;
};

const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));


const delay2 = () => new Promise(res => { let u = {} as vscode.Uri; parseprojectFiles(u, ''); });

async function getURL(params: string) {
	let size = 100;
	return size;
}

const generateEmail = (name: string): string => {
	return `${name.split(' ').join('.')}@company.com`;
};

const runAsyncFunctions = async () => {
	try {
		const employees = await fetchAllEmployees(baseApi);
		Promise.all(
			parseSize(employees)

		);
	} catch (error) {
		;
		console.log(error);
	}
};

function parseSize(params: number) {
	const emails = generateEmail(params.toString());
	console.log('size of the respons');
	return 'size of the respons: ' + params.toString();
}


//let testStr: string;



// this method is called when your extension is deactivated
export function deactivate() { }



