/*
 * Function to get read json from file.
 * @param[IN] filePath has valid path to a json file.
 */
function GetJson(filePath)
{
	//console.log('Creating JSON for '+filePath);
	var fs = require('fs'); 		
	//console.log('fs: '+ fs);
	fs.readFile(filePath, 'utf8', OnDataRead);	 
};

/*
 * Callback function that gets data of the file after ReadFile.
 * @param[IN] err object if error occures.
 * @param[IN] data object having data read from file.
 */
function OnDataRead(err, data)
{
	if (err) {
		return console.log('err:'+err);
	} else {
		//console.log('date:'+data);
		var json = JSON.parse(data);
		TransformJSONToCSV(json, OnTransform);
	}	
}

/*
 * Function to Transform json object to CSV.
 * @param[IN] jsonArray json array object that should be converted into CSV.
 * @param[IN] OnTransform callback function that will be called after the Transformation
 * is completed.
 */
function TransformJSONToCSV(jsonArray, OnTransform)
{
	var sets = require('simplesets');
	var array = typeof jsonArray != 'object' ? JSON.parse(jsonArray) : jsonArray;
	var str = '';
	var keys = [];	
	for (var i = 0; i < array.length; i++) {
		keys = keys.concat(Object.keys(array[i]));
	}
	
	var header = new sets.Set(keys);	
	keys = header.array();
	// Append headers(keys).
	str += keys + '\r\n';
	for (var i = 0; i < array.length; i++) {
		var line = '';
		for (var j = 0; j < keys.length; ++j) {
			if (line != '') line += ',';
			var val = array[i][keys[j]];
			if (typeof val == 'undefined' || val == '') { 
				val = 'N/A';
			} else if(typeof val == 'object') {
				val = JSON.stringify(array[i][keys[j]]);
			}
			if(typeof val == 'string'){
				val = val.replace(new RegExp('"','g'), '""');
				val = '"' + val + '"';
			}
			line += val;
		}
		str += line + '\r\n';
	}

	OnTransform(str);
};

/*
 * Callback function called after Transformation to CSV with CSV data as parameter.
 * @param[IN] csv csv representation of the JSON.
 */
function OnTransform(csv)
{
	console.log(csv);
}

/*
 * Main function where execution starts.
 */
function main()
{
	var jsonFilePath = process.argv[2];
	if(jsonFilePath == '' || typeof jsonFilePath == 'undefined') 
		return console.error('Please give valid json file path as argument');
	GetJson(jsonFilePath);
};


main();
