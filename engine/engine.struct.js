en.struct = {
	structs: [],
};

en.structID = {};


en.struct.add = function(name, struct){
	en.structID[name] = en.struct.structs.push(struct)-1;
	return en.structID[name];
};

en.struct.extend = function(name, name2, struct){
	en.struct.add(name+name2, struct);
	if(en.struct.structs[en.structID[name]])
		en.struct.structs[en.structID[name]].push([name2, "Array", struct]);
};

en.struct.get = function(structID){
	if(typeof structID == "number")
		return en.struct.structs[structID];
	else if(typeof structID == "string")
		return en.struct.structs[en.structID[structID]];
};



/**********************************************************
		STRUCTS ->>
*/

en.struct.add("stageFullState", [
		["name", "String"],
		["time", "Int32", 1],
		["reset", "Bool"],
		["remove", "Array", [
			["id", "Uint8", 1],
			["method", "Uint8", 1],
		]],
]);

en.struct.add("stageState", [
	["time", "Int32", 1],
	["remove", "Array", [
			["id", "Int32", 1],
			["method", "Uint8", 1],
		]],
]);

en.struct.add("ping", [
	["time", "Int32", 1],
]);

en.struct.add("recPing", [
	["time", "Int32", 1],
]);

en.struct.add("message", [
	["type", "Uint8", 1],
	["title", "String"],
	["message", "String"]
]);

en.struct.add("authentication", [
	["username", "String",],
	["password", "String",]
]);

en.struct.add("clientData", [
	["firing", "Bool"],
	["boosting", "Bool"],
	["thrusting", "Uint8", 1],
	["turning_right", "Bool"],
	["turning_left", "Bool"],
	["weapon", "Uint8", 1]
]);

en.struct.add("clientCMD", [
	["command", "Uint8", 1],    //deploy, logout, etc...
]);

en.struct.add("serverCMD", [
	["command", "Uint8", 1],    //deploy, logout, etc...
]);

en.struct.add("deployPlayer", [
	["color", "Int32", 1],
	["hull", "Uint8", 1],
	["weapons", "Array", [
		["weaponID", "Uint8", 1] 
	]],
]);

en.struct.add("serverDeployPlayer", [
	["id", "Uint8", 1],
]);

en.struct.add("body", [
	["position", "Float32", 2],
	["velocity", "Float32", 2],
	["rotation", "Float32", 1],
]);

en.struct.add("fullPlayer", [
	["id", "Uint8", 1],
	["username", "String"],
	["kills", "Uint", 1],
	["deaths", "Uint", 1],
	["level", "Uint", 1],
	["spaceship", "Struct", en.struct.get("clientSpaceship")],
]);

en.struct.add("playerState", [
	["id", "Uint8", 1],
	["health", "Int32", 1],
	["shields", "Int32", 1],
	["weapon", "Uint8", 1],
	["clientData", "Struct", en.struct.get("clientData")],
	["body", "Struct", en.struct.get("body")],
]);

