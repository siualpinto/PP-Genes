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
		var entry = "kegg_"+ids[i].trim().toLowerCase()+"("+namefile+", '"+content[i].replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
	}

  	var blob = new Blob([arrayData.join('\r\n')], {type: "text/plain;charset=utf-8"});
 	saveAs(blob, "gene_"+namefile+".pl");

}


function WriteToFileNCBI(name, content){ 
	
	name = JSON.parse(name);
	geneNCBI = JSON.parse(content);
	
	
	var namefile = content[0];
	namefile = namefile.replace(/^\s+|\s+$/g,"");
	namefile = namefile.substr(0,namefile.indexOf(' '));
	
	var arrayData = [];

	var entry = "ncbi_ole"+"("+name+", '"+geneNCBI.Name.replace(/^\s+|\s+$/g,"")+"').";
	arrayData.push(entry);

	if (geneNCBI.DbBuild != null) { 
        var entry = "ncbi_dbbuild"+"("+name+", '"+geneNCBI.DbBuild.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    } 
    if (geneNCBI.Name != null) { 
        var entry = "ncbi_name"+"("+name+", '"+geneNCBI.Name.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    } 
    if (geneNCBI.Description != null) { 
        var entry = "ncbi_description"+"("+name+", '"+geneNCBI.Description.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    } 
    if (geneNCBI.Status != null) { 
        var entry = "ncbi_status"+"("+name+", '"+geneNCBI.Status.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    } 
    if (geneNCBI.CurrentID != null) { 
        var entry = "ncbi_currentid"+"("+name+", '"+geneNCBI.CurrentID.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    } 
    if (geneNCBI.Chromosome != null) { 
        var entry = "ncbi_chromosome"+"("+name+", '"+geneNCBI.Chromosome.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
    if (geneNCBI.GeneticSource != null) { 
        var entry = "ncbi_geneticsource"+"("+name+", '"+geneNCBI.GeneticSource.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
    if (geneNCBI.MapLocation != null) { 
        var entry = "ncbi_maplocation"+"("+name+", '"+geneNCBI.MapLocation.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
    if (geneNCBI.OtherAliases != null) { 
        var entry = "ncbi_otheraliases"+"("+name+", '"+geneNCBI.OtherAliases.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
    if (geneNCBI.OtherDesignations != null) { 
        var entry = "ncbi_otherdesignations"+"("+name+", '"+geneNCBI.OtherDesignations.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
    if (geneNCBI.NomenclatureSymbol != null) { 
        var entry = "ncbi_nomenclaturesymbol"+"("+name+", '"+geneNCBI.NomenclatureSymbol.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
    if (geneNCBI.NomenclatureName != null) { 
        var entry = "ncbi_nomenclaturename"+"("+name+", '"+geneNCBI.NomenclatureName.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
    if (geneNCBI.NomenclatureStatus != null) { 
        var entry = "ncbi_nomenclaturestatus"+"("+name+", '"+geneNCBI.NomenclatureStatus.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
    if (geneNCBI.int != null) { 
        var entry = "ncbi_int"+"("+name+", '"+geneNCBI.int.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
    if (geneNCBI.ChrLoc != null) { 
        var entry = "ncbi_chrloc"+"("+name+", '"+geneNCBI.ChrLoc.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
     if (geneNCBI.ExonCount != null) { 
        var entry = "ncbi_exoncount"+"("+name+", '"+geneNCBI.ExonCount.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
     if (geneNCBI.GeneWeight != null) { 
        var entry = "ncbi_geneweight"+"("+name+", '"+geneNCBI.GeneWeight.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
     if (geneNCBI.Summary != null) { 
        var entry = "ncbi_summary"+"("+name+", '"+geneNCBI.Summary.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
    if (geneNCBI.ChrSort != null) { 
        var entry = "ncbi_chrsort"+"("+name+", '"+geneNCBI.ChrSort.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
    if (geneNCBI.ScientificName != null) { 
        var entry = "ncbi_scientificname"+"("+name+", '"+geneNCBI.ScientificName.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
    if (geneNCBI.CommonName != null) { 
        var entry = "ncbi_commonname"+"("+name+", '"+geneNCBI.CommonName.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }
     if (geneNCBI.TaxID != null) { 
        var entry = "ncbi_taxid"+"("+name+", '"+geneNCBI.TaxID.replace(/^\s+|\s+$/g,"")+"').";
		arrayData.push(entry);
    }	

  	var blob = new Blob([arrayData.join('\r\n')], {type: "text/plain;charset=utf-8"});
 	saveAs(blob, "gene_"+name+".pl");
	
}

function WriteDisease(content, ids) {

	var disease = JSON.parse(content);
	ids = JSON.parse(ids);
	
	var namefile = disease[0];
	namefile = namefile.replace(/^\s+|\s+$/g,"");
	namefile = namefile.substr(0,namefile.indexOf(' '));
	console.log("nam " + namefile);
	var arrayData = [];

	for(var i =0; i< disease.length-2 ; i++) {
		var entry = "disease_"+ids[i].trim().toLowerCase()+"("+namefile+", '"+disease[i].replace(/'/g, "\\'")+"').";

		arrayData.push(entry);
	}

    var blob = new Blob([arrayData.join('\r\n')], {type: "text/plain;charset=utf-8"});
 	saveAs(blob, "disease_"+namefile+".pl");

}

function WritePathway(content, namefile) {
	
	var namefileSplit = namefile.split(":");
	var namePath = namefileSplit[1];
	var namePathWay = namePath.split(",");
	var namepathway = namePathWay[0].substr(0,namePathWay[0].length-1);
	
	//console.log("asafa  " + namepathway + "  --  " + JSON.parse(JSON.stringify(content[i].split("\t")))[1];

	var arrayData = [];
	
	for(var i=0; i < content.length-1; i++) { 
		var entry = "pathway_"+i+"("+namepathway+", '"+ "nhe" +"').";

		arrayData.push(entry);
		
	}
	

  	var blob = new Blob([arrayData.join('\r\n')], {type: "text/plain;charset=utf-8"});
 	saveAs(blob, "pathway_"+namepathway+".pl");

} 