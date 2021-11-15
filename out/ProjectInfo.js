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
const vscode = __importStar(require("vscode"));
const path_1 = require("path");
const util_1 = require("util");
class ProjectInfo {
    constructor(folder) {
        this.allALObjects = [];
        this.idRanges = [];
        this.alObjectsHealth = [];
        this.licenseObjects = [];
        this.totalQuantityOfObjects = 0;
        this.permissionReporFound = false;
        this.projectFolder = folder;
    }
    addALObject(alObject) {
        this.allALObjects.push(alObject);
    }
    addLicenseObject(licenseObject) {
        this.licenseObjects.push(licenseObject);
    }
    addIDRange(idRange) {
        this.idRanges.push(idRange);
    }
    getprojectFolder() {
        return "Current folder: " + this.projectFolder;
    }
    calcTotalQuantity() {
        for (var i = 0; i < this.idRanges.length; i++) {
            this.totalQuantityOfObjects += this.idRanges[i].totalQty;
        }
    }
    calcprojectValues() {
        this.collectMissingLicenseObjects();
        this.calcOverallHealth();
    }
    calcOverallHealth() {
        for (var type in ALObjectType) {
            let alObjectHealth = {};
            alObjectHealth.type = parseInt(type);
            alObjectHealth.quantityUsed = this.allALObjects.filter(function (el) {
                return el.type === alObjectHealth.type;
            }).length;
            alObjectHealth.percentUsedExtension = 0;
            if (this.totalQuantityOfObjects > 0 && alObjectHealth.quantityUsed > 0) {
                alObjectHealth.percentUsedExtension = alObjectHealth.quantityUsed * 100 / this.totalQuantityOfObjects;
                alObjectHealth.percentUsedExtension = Math.round((alObjectHealth.percentUsedExtension + Number.EPSILON) * 100) / 100;
            }
            ;
            alObjectHealth.percentUsedLicense = 0;
            var missingLisenceQty = 0;
            if (this.permissionReporFound) {
                for (var i = 0; i < this.idRanges.length; i++) {
                    var currMissingLicenseObject = this.idRanges[i].missingLicenseObject.filter(function (el) {
                        return el.type === parseInt(type);
                    });
                    missingLisenceQty = currMissingLicenseObject.length;
                }
                if (this.totalQuantityOfObjects > 0 && alObjectHealth.quantityUsed > 0 && missingLisenceQty !== 0) {
                    alObjectHealth.percentUsedLicense = alObjectHealth.quantityUsed * 100 / (this.totalQuantityOfObjects - missingLisenceQty);
                    /*
                    if ((this.totalQuantityOfObjects - missingLisenceQty) !== 0) {
                        alObjectHealth.percentUsedLicense = alObjectHealth.quantityUsed * 100 / (this.totalQuantityOfObjects - missingLisenceQty);
                    } else {
                        alObjectHealth.percentUsedLicense = alObjectHealth.quantityUsed * 100 / (0.1);
                    }*/
                    alObjectHealth.percentUsedLicense = Math.round((alObjectHealth.percentUsedLicense + Number.EPSILON) * 100) / 100;
                }
            }
            this.alObjectsHealth.push(alObjectHealth);
        }
    }
    collectMissingLicenseObjects() {
        if (!this.permissionReporFound) {
            return;
        }
        for (var i = 0; i < this.idRanges.length; i++) {
            this.idRanges[i].missingLicenseObject = [];
            for (var type in ALObjectType) {
                if (parseInt(type) === ALObjectType.table || parseInt(type) === ALObjectType.page || parseInt(type) === ALObjectType.report ||
                    parseInt(type) === ALObjectType.codeunit || parseInt(type) === ALObjectType.query || parseInt(type) === ALObjectType.xmlport) {
                    for (var j = this.idRanges[i].fromID; j <= this.idRanges[i].toID; j++) {
                        if (!this.licenseObjects.find(e => e.id === j && e.type === parseInt(type))) {
                            let licenseObject = {};
                            licenseObject.id = j;
                            licenseObject.type = parseInt(type);
                            this.idRanges[i].missingLicenseObject.push(licenseObject);
                        }
                    }
                }
            }
        }
        this.allALObjects.forEach((alObject) => {
            if (this.licenseObjects.filter(function (licenseObject) {
                return licenseObject.type === alObject.type && licenseObject.id === alObject.id;
            }).length > 0) {
                alObject.withinLicense = true;
            }
        });
    }
    async parseprojectFiles(folder) {
        for (const [name, type] of await vscode.workspace.fs.readDirectory(folder)) {
            if (type === vscode.FileType.File) {
                if ((name.indexOf('.al') !== -1) || (name === 'app.json') || (name.indexOf('Permission Report Detailed') !== -1)) {
                    const currFileUri = folder.with({ path: path_1.posix.join(folder.path, name) });
                    const fileBinaryData = await vscode.workspace.fs.readFile(currFileUri);
                    const fileTextData = new util_1.TextDecoder("utf-8").decode(fileBinaryData);
                    if (name.indexOf('Permission Report Detailed') === 0) {
                        this.parsePermissionReport(fileTextData);
                    }
                    if (name.indexOf('.al') !== -1) {
                        this.parseALFile(name, fileTextData);
                    }
                    if (name === 'app.json') {
                        this.parseAppFile(fileTextData);
                    }
                }
            }
            if (type === vscode.FileType.Directory) {
                let path = folder.fsPath;
                let uri = vscode.Uri.file(path + '/' + name);
                await this.parseprojectFiles(uri);
            }
        }
        //this.parseprojectFiles(folder);
        //this.calcprojectValues();
        //workspaceInfo.addProjectToCurrentWorkspace(this);
    }
    parsePermissionReport(fileTextData) {
        this.permissionReporFound = true;
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
                let alObjectType = {};
                alObjectType = ALObjectType.unknown;
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
                    for (var i = fromValue; i <= toValue; i++) {
                        let licenseObject = {};
                        licenseObject.id = i;
                        licenseObject.type = alObjectType;
                        this.addLicenseObject(licenseObject);
                    }
                }
            }
        });
    }
    parseALFile(fileName, fileTextData) {
        var lines = fileTextData.split('\r\n');
        var inObject = false;
        var inFields = false;
        var currLevel = 0;
        var alObject;
        lines.forEach(line => {
            if ((line.length) && this.isLetter(line.charAt(0))) {
                alObject = {};
                alObject.alFields = [];
                inObject = true;
                var objectParameters = line.split(" ");
                alObject.type = this.convertTxtToEnum(objectParameters[0]);
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
                if (alObject.name) {
                    alObject.name = alObject.name.trim();
                }
                if (alObject.extends) {
                    alObject.extends = alObject.extends.trim();
                }
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
                        alObject.fieldHealth = {};
                        alObject.fieldHealth.percentUsed = 0;
                        alObject.fieldHealth.quantityUsed = alObject.alFields.length;
                        alObject.fieldHealth.percentUsed = alObject.fieldHealth.quantityUsed * 100 / this.totalQuantityOfObjects;
                        alObject.fieldHealth.percentUsed = Math.round((alObject.fieldHealth.percentUsed + Number.EPSILON) * 100) / 100;
                    }
                }
                if (inFields && currLevel > 0 && refinedLine.indexOf('field') === 0) {
                    var fieldParameters = refinedLine.split(";");
                    let alField = {};
                    alField.id = parseInt(fieldParameters[0].replace(/[^0-9]/g, ''));
                    alField.name = fieldParameters[1].replace(/"/g, "").trim();
                    alObject.alFields.push(alField);
                }
            }
            if ((line.length) && (line.charAt(0) === '}')) {
                inObject = false;
                this.addALObject(alObject);
            }
        });
    }
    convertTxtToEnum(txtType) {
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
    isLetter(str) {
        return str.match(/[a-z]/i);
    }
    parseAppFile(fileTextData) {
        const appData = JSON.parse(fileTextData);
        for (var i = 0; i < appData.idRanges.length; i++) {
            let idRange = {};
            idRange.fromID = appData.idRanges[i].from;
            idRange.toID = appData.idRanges[i].to;
            idRange.totalQty = idRange.toID - idRange.fromID + 1;
            this.addIDRange(idRange);
        }
        this.calcTotalQuantity();
    }
}
;
module.exports = ProjectInfo;
//# sourceMappingURL=ProjectInfo.js.map