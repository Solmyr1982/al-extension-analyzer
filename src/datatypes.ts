type ALObjectHealth = {
	type: ALObjectType;
	percentUsedExtension: number;
	percentUsedLicense: number;
	quantityUsed: number;
};

type ALFieldHealth = {
	percentUsed: number;
	quantityUsed: number;
};

enum ALObjectType {
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

type LicenseObject = {
	type: ALObjectType;
	id: number;
};

type ALObject = {
	id: number;
	name: string;
	extends: string;
	type: ALObjectType;
	fileName: string;
	alFields: ALField[];
	fieldHealth: ALFieldHealth;
	withinLicense: boolean;
};

type IDRange = {
	fromID: number;
	toID: number;
	totalQty: number;
	missingLicenseObject: LicenseObject[];
};

type ALField = {
	id: number;
	name: string;
};
