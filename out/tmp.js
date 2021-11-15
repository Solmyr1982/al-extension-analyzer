"use strict";
// e.uri
//let currprojectInfo = new ProjectInfo(e.uri);			
//await currprojectInfo.parseprojectFiles(e.uri);
//currprojectInfo.parseprojectFiles(e.uri);
//currprojectInfo.calcprojectValues();
//workspaceInfo.addProjectToCurrentWorkspace(currprojectInfo);
//await parseprojectFiles(e.uri); 
//parseprojectFiles(folderUri);
/*
            var eol = '\r\n';
            

            writeStr += vscode.workspace.name + eol;
            if (currprojectInfo.permissionReporFound) {
                writeStr += 'License permission information available' + eol;
            }
            else {
                writeStr += 'License permission information not available' + eol;
            }
            writeStr += eol;
            if (currprojectInfo.permissionReporFound) {
                writeStr += '-=Range vs License information=-' + eol;
            }
            else {
                writeStr += '-=Range information=-' + eol;
            }
            for (var i = 0; i < currprojectInfo.idRanges.length; i++) {
                writeStr += 'ID Range: ' + currprojectInfo.idRanges[i].fromID + '..' + currprojectInfo.idRanges[i].toID + '; Total: ' + currprojectInfo.idRanges[i].totalQty + eol;
                if (currprojectInfo.permissionReporFound && currprojectInfo.idRanges[i].missingLicenseObject.length !== 0) {
                    let currALObjectType = {} as ALObjectType;
                    currALObjectType = currprojectInfo.idRanges[i].missingLicenseObject[0].type;
                    let missingObjects = '';
                    currprojectInfo.idRanges[i].missingLicenseObject.forEach((e) => {
                        if (currALObjectType !== e.type) {
                            missingObjects = missingObjects.slice(0, -2);
                            writeStr += 'Missing license ' + ALObjectType[currALObjectType] + '(s): ' + missingObjects + eol;
                            missingObjects = '';
                            currALObjectType = e.type;
                        }
                        missingObjects += e.id + ', ';
                    });
                    if (missingObjects !== '') {
                        missingObjects = missingObjects.slice(0, -2);
                        writeStr += 'Missing license ' + ALObjectType[currALObjectType] + '(s): ' + missingObjects + eol;
                    }
                }
            }
            writeStr += eol;

            if (currprojectInfo.permissionReporFound) {
                writeStr += '-=Total objects created vs Range/License limitations=-' + eol;
            }
            else {
                writeStr += '-=Total objects created vs Range limitations=-' + eol;
            }
            for (var type in ALObjectType) {
                if (parseInt(type) > 0) {
                    let currTypeHealth: ALObjectHealth[] = [];
                    currTypeHealth = currprojectInfo.alObjectsHealth.filter(function (el) {
                        return el.type === parseInt(type);
                    });

                    if (!currprojectInfo.permissionReporFound || parseInt(type) === ALObjectType.pageextension || parseInt(type) === ALObjectType.tableextension || parseInt(type) === ALObjectType.reportextension) {
                        writeStr += ALObjectType[currTypeHealth[0].type] + '(s) : created: ' + currTypeHealth[0].quantityUsed + '; ' + currTypeHealth[0].percentUsedExtension + '% of the extension range.' + eol;
                    }
                    else {
                        writeStr += ALObjectType[currTypeHealth[0].type] + '(s) : total created: ' + currTypeHealth[0].quantityUsed + '; ' + currTypeHealth[0].percentUsedExtension + '% of the the extension range; ' + currTypeHealth[0].percentUsedLicense + '% of the license range.' + eol;
                    }
                }
            }
            writeStr += eol;

            if (currprojectInfo.permissionReporFound) {
                writeStr += '-=Objects and field extensions; [+]/[-] => in/out the license=-' + eol;
            }
            else {
                writeStr += '-=Objects and field extensions=-' + eol;
            }
            for (var type in ALObjectType) {
                if (parseInt(type) > 0) {
                    let currALObjects: ALObject[] = [];
                    currALObjects = currprojectInfo.allALObjects.filter(function (el) {
                        return el.type === parseInt(type);
                    });

                    currALObjects.sort((a, b) => {
                        return a.id - b.id;
                    });

                    currALObjects.forEach((e) => {
                        if (e.type === ALObjectType.tableextension) {
                            writeStr += ALObjectType[e.type] + ' ' + e.id + ' ' + e.name + '; extends: ' + e.extends + eol;
                            // writeStr += '\t[Total: ' + e.fieldHealth.quantityUsed + '; ' + e.fieldHealth.percentUsed + '% used]' + eol;
                            if (e.alFields.length > 0) {
                                writeStr += '     [Total: ' + e.fieldHealth.quantityUsed + '; ' + e.fieldHealth.percentUsed + '% used]' + eol;
                                e.alFields.sort((a, b) => {
                                    return a.id - b.id;
                                });
                                e.alFields.forEach((e) => {
                                    // writeStr += '\t' + e.id + ' ' + e.name + eol;
                                    writeStr += '     ' + e.id + ' ' + e.name + eol;
                                });
                            }
                        }
                        else {
                            if (e.type === ALObjectType.pageextension || e.type === ALObjectType.reportextension) {
                                writeStr += ALObjectType[e.type] + ' ' + e.id + ' ' + e.name + '; extends: ' + e.extends + eol;
                            }
                            else {
                                if (currprojectInfo.permissionReporFound) {
                                    let licenseNote = '';
                                    if (e.withinLicense) {
                                        licenseNote = '[+]';
                                    }
                                    else {
                                        licenseNote = '[-]';
                                    }
                                    writeStr += licenseNote + ' ' + ALObjectType[e.type] + ' ' + e.id + ' ' + e.name + eol;
                                }
                                else {
                                    writeStr += ALObjectType[e.type] + ' ' + e.id + ' ' + e.name + eol;
                                }
                            }
                        }
                    });
                    if (currALObjects.length > 0) {
                        writeStr += eol;
                    }
                }
            }*/
/*
const writeData = Buffer.from(writeStr, 'utf8');
const fileUri = folderUri.with({ path: posix.join(folderUri.path, 'statistics.txt') });
await vscode.workspace.fs.writeFile(fileUri, writeData);


vscode.workspace.openTextDocument(fileUri).then(doc => {
vscode.window.showTextDocument(doc);
});*/ 
//# sourceMappingURL=tmp.js.map