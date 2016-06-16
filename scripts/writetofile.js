////////////////////////////////////////////////////
/**
 * writeTextFile write data to file on hard drive
 * @param  string  filepath   Path to file on hard drive
 * @param  sring   output     Data to be written
 */
function WriteToFile(namefile, data){ 

	namefile = namefile.replace(/^\s+|\s+$/g,"");
	namefile = namefile.substr(0,namefile.indexOf(' '));
	data = JSON.parse(data);
	var arrayData = [];

	if(data.entry != null){
		var entry = "kegg_entry("+namefile+"):-write(\'" + data.entry.replace(/^\s+|\s+$/g,"") +"\').";
		arrayData.push(entry);
	}

	if(data.name != null){
		var name = "kegg_name("+namefile+"):-write(\'" + data.name.replace(/^\s+|\s+$/g,"") +"\').";
		arrayData.push(name);
	}
	
	if(data.definition != null){
		var definition = "kegg_definition("+namefile+"):-write(\'" + data.definition.replace(/^\s+|\s+$/g,"") +"\').";
		arrayData.push(definition);
	}
	
	if(data.organism != null){
		var organism = "kegg_organism("+namefile+"):-write(\'" + data.organism.replace(/^\s+|\s+$/g,"") +"\').";
		arrayData.push(organism);
	}
	
	if(data.position != null) {
		var position = "kegg_position("+namefile+"):-write(\'" + data.position.replace(/^\s+|\s+$/g,"") +"\').";
		arrayData.push(position);
	}
	
	if(data.motif != null){
		var motif = "kegg_motif("+namefile+"):-write(\'" + data.motif.replace(/^\s+|\s+$/g,"") +"\').";	
		arrayData.push(motif);
	}
	
	if(data.dblinks != null) {
		var dblinks = "kegg_dblinks("+namefile+"):-write(\'" + data.dblinks.replace(/^\s+|\s+$/g,"") +"\').";
		arrayData.push(dblinks);
	}
	
	if(data.aaseq != null) {
		var aaseqAux = data.aaseq.replace(/\s+/g, '');
		var aaseq = "kegg_aaseq("+namefile+"):-write(\'" + aaseqAux.replace(/[0-9]/g, '') +"\').";
		arrayData.push(aaseq);
	}
	
	if(data.ntseq != null) {
		var ntseqAux = data.ntseq.replace(/\s+/g, '');
		var ntseq = "kegg_ntseq("+namefile+"):-write(\'" + ntseqAux.replace(/[0-9]/g, '') +"\').";
		arrayData.push(ntseq);
	}
	
  	var blob = new Blob([arrayData.join('\r\n')], {type: "text/plain;charset=utf-8"});
 	 saveAs(blob, "gene_"+namefile+".pl");

}
