export type ALObjectHealth = {
	type: ALObjectType;
	percentUsedExtension: number;
	percentUsedLicense: number;
	quantityUsed: number;
};

export type ALFieldHealth = {
	percentUsed: number;
	quantityUsed: number;
};

export enum ALObjectType {
	unknown,
	table,
	tableextension,
	page,
	pageextension,
	report,
	reportextension,
	codeunit,
	query,
	xmlport
};

export type LicenseObject = {
	type: ALObjectType;
	id: number;
};

export type PermissionReport = {
	project: string;
	licenseObjects: LicenseObject[];
};

export type ALObject = {
	project: string;
	id: number;
	name: string;
	extends: string;
	type: ALObjectType;
	fileName: string;
	alFields: ALField[];
	fieldHealth: ALFieldHealth;
	withinLicense: boolean;
};

export type IDRange = {
	project: string;
	fromID: number;
	toID: number;
	totalQty: number;
	missingLicenseObject: LicenseObject[];
};

export type ALField = {
	id: number;
	name: string;
};
