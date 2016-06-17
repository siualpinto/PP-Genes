////////////////////////////////////////////////////
/**
 * writeTextFile write data to file on hard drive
 * @param  string  filepath   Path to file on hard drive
 * @param  sring   output     Data to be written
 */
function WriteToFile(ids, content){ 
	
	ids = JSON.parse(ids);
	content = JSON.parse(content);
	
	var namefile = content[0];
	namefile = namefile.replace(/^\s+|\s+$/g,"");
	namefile = namefile.substr(0,namefile.indexOf(' '));
	
	var arrayData = [];

	for(var i =0; i< ids.length-2 ; i++) {
		//console.log("1 : " + ids[i] + "  2:  " + content[i]);
		var entry = "kegg_"+ids[i].trim()+"("+namefile+"):-write(\'" + content[i].replace(/^\s+|\s+$/g,"") +"\').";
		arrayData.push(entry);
	}

  	var blob = new Blob([arrayData.join('\r\n')], {type: "text/plain;charset=utf-8"});
 	saveAs(blob, "gene_"+namefile+".pl");

}
