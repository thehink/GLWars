en.network = {};

en.stringToBuffer = function(buffer, start, string){
	for (var i = 0; i < string.length ; i++) {
	  buffer[start+i] = string.charCodeAt(i);
	}
};

en.bufferToString = function(buffer, start, length){
	var string = "";
	for (var i = 0; i < length ; i++) {
		if(buffer[start + i] == 0x0)
			break;
	  string += String.fromCharCode(buffer[start + i]);
	}
	return string;
};

en.arrayToString = function(array){
	var string = "";
	for (var i = 0, l = array.length; i < l; i++) {
		if(array[i] == 0x0)
			break;
	  string += String.fromCharCode(array[i]);
	}
	return string;
};

en.metas = {
	authentication: 0,
	message: 1,
	gameState: 2,
	commandState: 3,
};

en.calcBufferLength = function(struct, data){
	var length = 0;
	
	for(var i = 0; i < struct.length; ++i){
		var str = struct[i],
			struct_type = str[1],
			struct_name = str[0],
			struct_data = str[2],
			itemdata = data[struct_name];

		switch(struct_type){
			case 'String':
				length += itemdata.length+1;
			break;
			case 'Uint8':
				length += struct_data;
			break;
			case 'Int32':
				length += struct_data*4;
			break;
			case 'Float32':
				length += struct_data*4;
			break;
			case 'Bool':
				length += 1;
			break;
			case 'Struct':
				length += en.calcBufferLength(struct_data, itemdata);
			break;
			case 'Array':
				var array_length = itemdata.length;
				length += array_length;
				
				for(var j = 0; j < itemdata.length; ++j){
					length += en.calcBufferLength(struct_data, itemdata[j]);
				}
			break;
		}
	}
	return length;
}

en.writeBufferData = function(view, struct, data, pointer){
	var pointer = pointer || 0;
	
	for(var i = 0; i < struct.length; ++i){
		var str = struct[i],
			struct_type = str[1],
			struct_name = str[0],
			struct_data = str[2],
			itemdata = data[struct_name];
			
		switch(struct_type){
			case 'String':				
				view.setUint8(pointer++, itemdata.length);
				
				for(var j = 0; j < itemdata.length; j++){
					view.setUint8(pointer + j, itemdata.charCodeAt(j));
				}
				
				pointer += itemdata.length;
			break;
			case 'Uint8':
				if(itemdata instanceof Array)
					for(var j = 0; j < struct_data; ++j){
						view.setUint8(pointer + j, itemdata[j]);
					}
				else
					view.setUint8(pointer, itemdata);
				
				pointer += struct_data;
			break;
			case 'Float32':
				if(itemdata instanceof Array)
					for(var j = 0; j < struct_data; ++j){
						view.setFloat32(pointer + j *4, itemdata[j]);
					}
				else
					view.setFloat32(pointer, itemdata);
					
				pointer += struct_data*4;
			break;
			case 'Int32':
				if(itemdata instanceof Array)
					for(var j = 0; j < struct_data; ++j){
						view.setInt32(pointer + j *4, itemdata[j]);
					}
				else
					view.setInt32(pointer, itemdata);
					
				pointer += struct_data*4;
			break;
			case 'Bool':
				view.setUint8(pointer, (itemdata ? 1 : 0));
				pointer += 1;
			break;
			case 'Struct':
				pointer = en.writeBufferData(view, struct_data, itemdata, pointer);
			break;
			case 'Array':
				var array_length = itemdata.length;
				
				view.setUint8(pointer, array_length);
				pointer += 1;
				
				for(var j = 0; j < itemdata.length; ++j){
					pointer = en.writeBufferData(view, struct_data, itemdata[j], pointer);
				}
			break;
		}
		
	}
	return pointer;
};


en.readDataView = function(struct, view, pointer){
	var data = {},
		pointer = pointer || 0;
	
	for(var i = 0; i < struct.length; ++i){
		var str = struct[i],
			struct_type = str[1],
			struct_name = str[0],
			struct_data = str[2];
			
		switch(struct_type){
			case 'String':				
				var str_length = view.getUint8(pointer++),
					string = "";
				
				for(var j = 0; j < str_length; j++){
					var charCode = view.getUint8(pointer+j);
					if(charCode == 0x0)
						break;
					string += String.fromCharCode(charCode);
				}
				
				data[struct_name] = string;
				
				pointer += str_length;
			break;
			case 'Uint8':
				if(struct_data > 1){
					data[struct_name] = new Array(struct_data);
					for(var j = 0; j < struct_data; ++j){
						data[struct_name][j] = view.getUint8(pointer + j);
					}
				}else{
					data[struct_name] = view.getUint8(pointer);
				}

				pointer += struct_data;
			break;
			case 'Int32':
				if(struct_data > 1){
					data[struct_name] = new Array(struct_data);
					for(var j = 0; j < struct_data; ++j){
						data[struct_name][j] = view.getInt32(pointer + j*4);
					}
				}else{
					data[struct_name] = view.getInt32(pointer);
				}
					
				pointer += struct_data*4;
			break;
			case 'Float32':
				if(struct_data > 1){
					data[struct_name] = new Array(struct_data);
					for(var j = 0; j < struct_data; ++j){
						data[struct_name][j] = view.getFloat32(pointer + j*4);
					}
				}else{
					data[struct_name] = view.getFloat32(pointer);
				}
					
				pointer += struct_data*4;
			break;
			case 'Bool':
				data[struct_name] = view.getUint8(pointer) == 1 ? true : false;
				pointer += 1;
			break;
			case 'Struct':
				var read = en.readDataView(struct_data, view, pointer);
				
				data[struct_name] = read[0];
				pointer = read[1];
			break;
			case 'Array':
				var array_length = view.getUint8(pointer);
				data[struct_name] = new Array(array_length);
				
				pointer += 1;
				
				for(var j = 0; j < array_length; ++j){
					var read = en.readDataView(struct_data, view, pointer);
					data[struct_name][j] = read[0];
					pointer = read[1];
				}
			break;
		}
	}
	
	return [data, pointer];
};

en.buildBuffer = function(StructID, data){
		var struct = en.struct.get(StructID);
		var bufferLength = en.calcBufferLength(struct, data);
		var buffer = new ArrayBuffer(bufferLength+1);
		
		var dataView = new DataView(buffer);
		dataView.setUint8(0, StructID);
		en.writeBufferData(dataView, struct, data, 1);
	
		return buffer;
};


en.readBufferToData = function(buffer){
	var dataView = new DataView(buffer);
	var structID = dataView.getUint8(0);
	var struct = en.struct.get(structID);
	
	var data = en.readDataView(struct, dataView, 1)[0];
	data._sid = structID;
	
	return data;
};


var structTest = [
	["id", "Uint8", 1],
	["name", "String"],
	["floatTest", "Float32", 1],
	["intTest", "Int32", 1],
	["players", "Array", [
		["id", "Uint8", 1],
		["username", "String"],
		["position", "Float32", 2],
	]],
	["player", "Struct", [
		["id", "Uint8", 1],
		["username", "String"]
	]]
];

en.test = function(){
	var data = {
		username: "Hello",
		password: "Shitfuck"
	}
	
	var timeNow = Date.now();
	var times = 100000;
	
	var buffer = en.buildBuffer(en.structID.authentication, data);
	
	for(var i = 0; i < times; ++i){
		en.readBufferToData(en.buildBuffer(en.structID.authentication, data));
	}
		
	var timeDiff = Date.now() - timeNow;
	
	var opsSecond = times/(timeDiff/1000) >> 0;
	
	var dataRead = en.readBufferToData(buffer);
	
	console.log(opsSecond + " ops per second");
	
	console.log(dataRead);
	
};