module.exports = function(app, passport,http) {

    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/login', function(req, res) {

        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

     app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
     }));

    app.get('/signup', function(req, res) {

        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    //route da listagem geral do website com todos os 4000 e tal dados contendo especie, tipologia etc etc

    app.get('/general', function(req, res) {

        var options = {
              host: 'rest.kegg.jp',
              path: '/list/organism',
              headers: {
                    'Content-Type': 'application/json'
                }
            };

            var request = http.get(options, function (response) {

                var data = '';

                response.setEncoding('utf8');

                response.on('data', function (chunk) {
                    data += chunk;
                }); 

                response.on("end", function (err) {

                    if(err || data == null || data == ''){
                        res.render('index.ejs');
                        return;
                    }


                    //console.log(data);          

                    var result = data.split("\n");
                    var one = JSON.parse(JSON.stringify(result[0].split("\t")));
    
                    console.log('one'+ one[3].split(";")[0]);

                     res.render('general.ejs', {
                        data : result
                });

            }); 


        }); 
    });

    //route da listagem geral do website com todas as doenças (1500 e tal)

    app.get('/diseases', function(req, res) {

        var options = {
              host: 'rest.kegg.jp',
              path: '/list/disease',
              headers: {
                    'Content-Type': 'application/json'
                }
            };

            var request = http.get(options, function (response) {

                var data = '';

                response.setEncoding('utf8');

                response.on('data', function (chunk) {
                    data += chunk;
                }); 

                response.on("end", function (err) {

                    if(err || data == null || data == ''){
                        res.render('index.ejs');
                        return;
                    }         

                    var result = data.split("\n");
    
                     res.render('diseases.ejs', {
                        data : result
                });

            }); 


        }); 
    });

    //route da página individual de uma doença (recebe o identificador)

    app.get('/disease/:iddisease', function(req, res) {

         var iddisease = req.params.iddisease;
         var trya = iddisease.split(":");

            var options = {
              host: 'rest.kegg.jp',
              path: '/get/' + trya[1] +":"+trya[2],
              headers: {
                    'Content-Type': 'application/json'
                }
            };

            var request = http.get(options, function (response) {

                var data = '';

                response.setEncoding('utf8');

                response.on('data', function (chunk) {
                    data += chunk;
                }); 

                response.on("end", function (err) {

                    if(err || data == null || data == ''){
                        res.render('index.ejs');
                        return;
                    }
                    data = data.replace(/(\r\n|\n|\r)/gm,"");
                    var one = data.match("ENTRY(.*)NAME");
                    var two = data.match("NAME(.*)DESCRIPTION");
                    var three = data.match("DESCRIPTION(.*)CATEGORY");
                    var four = data.match("CATEGORY(.*)BRITE");
                    var five = data.match("BRITE(.*)PATHWAY");
                    var six = data.match("PATHWAY(.*)GENE");
                    var seven = data.match("GENE(.*)MARKER");
                    var eight = data.match("MARKER(.*)DRUG");
                    var nine = data.match("DRUG(.*)DBLINKS");

                    var output = {}; 
                    if(one != null){
                    output.entry = one[1];
                    }
                    if(two != null){
                    output.name=two[1];
                    }
                    if(three != null){
                    output.description=three[1];
                    }
                    if(four != null){
                    output.category=four[1];
                    }
                    if(five != null){
                    output.brite=five[1];
                    }
                    if(six != null){
                    output.pathway=six[1];
                    }
                    if(seven != null){
                    output.gene=seven[1];
                    } 
                    if(eight != null){
                    output.marker=eight[1];
                    } 
                    if(nine != null){
                    output.drug=nine[1];
                    }

                    res.render('disease.ejs', {
                        disease : output
                     });
                });

            });  
    });

    //route para a lista dos genes de uma especie (ex:hsa) vinda da lista geral

    app.get('/specific/:tipology', function(req, res) {

         var tipology = req.params.tipology;
         var trya = tipology.split(":");
         console.log(trya[1]);

            var options = {
              host: 'rest.kegg.jp',
              path: '/list/' + trya[1],
              headers: {
                    'Content-Type': 'application/json'
                }
            };

            var request = http.get(options, function (response) {

                var data = '';

                response.setEncoding('utf8');

                response.on('data', function (chunk) {
                    data += chunk;
                }); 

                response.on("end", function (err) {

                    if(err || data == null || data == ''){
                        res.render('index.ejs');
                        return;
                    }

                    //console.log(data);          

                    var result = data.split("\n");
                    //console.log(json);
                     res.render('individual.ejs', {
                        data : result
                });

            }); 


            }); 
    });

    //route do pathway de uma especie - pathway dos homo sapiens (hsa) por exemplo

    app.get('/pathway/:tipology', function(req, res) {

         var tipology = req.params.tipology;
         var trya = tipology.split(":");
         console.log(trya[1]);

            var options = {
              host: 'rest.kegg.jp',
              path: '/list/pathway/' + trya[1],
              headers: {
                    'Content-Type': 'application/json'
                }
            };

            var request = http.get(options, function (response) {

                var data = '';

                response.setEncoding('utf8');

                response.on('data', function (chunk) {
                    data += chunk;
                }); 

                response.on("end", function (err) {

                    if(err || data == null || data == ''){
                        res.render('index.ejs');
                        return;
                    }

                    //console.log(data);          

                    var result = data.split("\n");
                    //console.log(json);
                     res.render('pathway.ejs', {
                        data : result
                });

            }); 


            }); 
    });

    //route da lista de genes de um pathway

    app.get('/pathway/genes/:path', function(req, res){

        var xyz = req.params.path.split(':')[1];

        var options = {
          host: 'rest.kegg.jp',
          path: '/link/genes/'+xyz,
          headers: {
                'Content-Type': 'application/json'
            }
        };

         var request = http.get(options, function (response) {

            var data = '';

            response.on('data', function (chunk) {
                data += chunk;
            }); 

            response.on("end", function (err) {

                console.log('DATA: ' + data);

                if(err || data == null || data == ''){
                    res.render('index.ejs');
                    return;
                }


                //console.log(data);          

                var result = data.split("\n");

                 res.render('geneslist.ejs', {
                    data : result,
                    type : "pathway"
            });

        }); 


        }); 

    });

    //route da página individual de um gene (recebe a especie e o id do gene - hsa:1)

    app.get('/search/:params/:params2', function(req, res) {
            

        var params = req.params.params;
        var params2 = req.params.params2;

        if (params == null || params2 == null){
            res.render('index.ejs');
            return;
        }


         var first = params.split(":");
         var second = params2.split(":");


        var options = {
              host: 'rest.kegg.jp',
              path: '/get/' + first[1] + ":" + second[1],
              headers: {
                    'Content-Type': 'application/json'
                }
            };

            var request = http.get(options, function (response) {

                var data = '';

                response.setEncoding('utf8');

                response.on('data', function (chunk) {
                    data += chunk;
                }); 

                response.on("end", function (err) {

                    if(err || data == null || data == ''){
                        res.render('index.ejs');
                        return;
                    }
           
                    data = data.replace(/(\r\n|\n|\r)/gm,"");

                    var one = data.match("ENTRY(.*)NAME");
                    var two = data.match("NAME(.*)DEFINITION");
                    var three = data.match("DEFINITION(.*)ORGANISM");
                    var four = data.match("ORGANISM(.*)POSITION");
                    var five = data.match("POSITION(.*)MOTIF");
                    var six = data.match("MOTIF(.*)DBLINKS");
                    var seven = data.match("DBLINKS(.*)AASEQ");
                    var eight = data.match("AASEQ(.*)NTSEQ");
                    var nine = data.match("NTSEQ(.*)///");

                    var output = {}; 
                    if(one != null){
                    output.entry = one[1];
                    }
                    if(two != null){
                    output.name=two[1];
                    }
                    if(three != null){
                    output.definition=three[1];
                    }
                    if(four != null){
                    output.organism=four[1];
                    }
                    if(five != null){
                    output.position=five[1];
                    }
                    if(six != null){
                    output.motif=six[1];
                    }
                    if(seven != null){
                    output.dblinks=seven[1];
                    } 
                    if(eight != null){
                    output.aaseq=eight[1];
                    } 
                    if(nine != null){
                    output.ntseq=nine[1];
                    }

                  var options2 = {
                      host: 'rest.kegg.jp',
                      path: '/conv/ncbi-geneid/' + first[1] + ":" + second[1],
                      headers: {
                            'Content-Type': 'application/json'
                        }
                    };

                    var request2 = http.get(options2, function (response2) {

                        var data2 = "";

                        response2.setEncoding('utf8');

                        response2.on('data', function (chunk) {
                            data2 += chunk;
                        }); 

                        response2.on("end", function (err) {

                            data2 = data2.replace(/(\r\n|\n|\r)/gm,"");

                            if(err || !data2 || 0 === data2.length || data2 == ''){
                                res.render('search.ejs', {
                                    gene : output // get the user out of session and pass to template
                                });
                                return;
                            }
                             var id = data2.match("ncbi-geneid(.*)");

                             var options3 = {
                              host:'www.ncbi.nlm.nih.gov',
                              path: '/entrez/eutils/esummary.fcgi?db=gene&id='+id[1].split(":")[1]
                            };

                        var request3 = http.get(options3, function (response3) {

                            var data = '';

                            response3.setEncoding('utf8');

                            response3.on('data', function (chunk) {
                                data += chunk;
                            }); 

                            response3.on("end", function (err) {

                                if(err || data == null || data == ''){
                                    res.render('search.ejs', {
                                    gene : output // get the user out of session and pass to template
                                    });
                                    return;
                                }

                                 
                                 data = data.replace(/(\r\n|\n|\r)/gm,"");             

                                 var outputNCBI = {
                                    };

                                var one = data.match("<DbBuild>(.*)</DbBuild>");
                                if(one != null){
                                    outputNCBI.DbBuild=one[1];
                                }
                                else{
                                    outputNCBI.DbBuild='Information N/a';
                                }
                                var two = data.match("<Name>(.*)</Name>");
                                if(two != null){
                                    outputNCBI.Name=two[1];
                                }
                                else{
                                    outputNCBI.Name='Information N/a';
                                }
                                var three = data.match("<Description>(.*)</Description>");
                                if(three != null){
                                    outputNCBI.Description=three[1];
                                }
                                else{
                                    outputNCBI.Description='Information N/a';
                                }
                                var four = data.match("<Status>(.*)</Status>");
                                if(four != null){
                                    outputNCBI.Status=four[1];
                                }
                                else{
                                    outputNCBI.Status='Information N/a';
                                }
                                var five = data.match("<CurrentID>(.*)</CurrentID>");
                                if(five != null){
                                    outputNCBI.CurrentID=five[1];
                                }
                                else{
                                    outputNCBI.CurrentID='Information N/a';
                                }
                                var six = data.match("<Chromosome>(.*)</Chromosome>");
                                if(six != null){
                                    outputNCBI.Chromosome=six[1];
                                }
                                else{
                                    outputNCBI.Chromosome='Information N/a'
                                }
                                var seven = data.match("<GeneticSource>(.*)</GeneticSource>");
                                if(seven != null){
                                    outputNCBI.GeneticSource=seven[1];
                                }
                                else{
                                    outputNCBI.GeneticSource='Information N/a';
                                }
                                var eight = data.match("<MapLocation>(.*)</MapLocation>");
                                if(eight != null){
                                    outputNCBI.MapLocation=eight[1];
                                }
                                else{
                                    outputNCBI.MapLocation='Information N/a';
                                }
                                var nine = data.match("<OtherAliases>(.*)</OtherAliases>");
                                if(nine != null){
                                    outputNCBI.OtherAliases=nine[1];
                                }
                                else{
                                    outputNCBI.OtherAliases='Information N/a';
                                }
                                var ten = data.match("<OtherDesignations>(.*)</OtherDesignations>");
                                if(ten != null){
                                    outputNCBI.OtherDesignations=ten[1];
                                }
                                else{
                                    outputNCBI.OtherDesignations='Information N/a';
                                }
                                var eleven = data.match("<NomenclatureSymbol>(.*)</NomenclatureSymbol>");
                                if(eleven != null){
                                    outputNCBI.NomenclatureSymbol=eleven[1];
                                }
                                else{
                                    outputNCBI.NomenclatureSymbol='Information N/a';
                                }
                                var twelve = data.match("<NomenclatureName>(.*)</NomenclatureName>");
                                if(twelve != null){
                                    outputNCBI.NomenclatureName=twelve[1];
                                }
                                else{
                                    outputNCBI.NomenclatureName='Information N/a';
                                }
                                var thirteen = data.match("<NomenclatureStatus>(.*)</NomenclatureStatus>");
                                if(thirteen != null){
                                    outputNCBI.NomenclatureStatus=thirteen[1];
                                }
                                else{
                                    outputNCBI.NomenclatureStatus='Information N/a';
                                }
                                var fourteen = data.match("<int>(.*)</int>");
                                if(fourteen != null){
                                    outputNCBI.int=fourteen[1];
                                }
                                else{
                                    outputNCBI.int='Information N/a';
                                }
                                var fifteen = data.match("<ChrLoc>(.*)</ChrLoc>");
                                if(fifteen != null){
                                    outputNCBI.ChrLoc=fifteen[1];
                                }
                                else{
                                    outputNCBI.ChrLoc='Information N/a';
                                }
                                var nineteen = data.match("<ExonCount>(.*)</ExonCount>");
                                if(nineteen != null){
                                    outputNCBI.ExonCount=nineteen[1];
                                }
                                else{
                                    outputNCBI.ExonCount='Information N/a';
                                }
                                var twenty = data.match("<GeneWeight>(.*)</GeneWeight>");
                                if(twenty != null){
                                    outputNCBI.GeneWeight=twenty[1];
                                }
                                else{
                                    outputNCBI.GeneWeight='Information N/a';
                                }
                                var twentyone = data.match("<Summary>(.*)</Summary>");
                                if(twentyone != null){
                                    outputNCBI.Summary=twentyone[1];
                                }
                                else{
                                    outputNCBI.Summary='Information N/a';
                                }
                                var twentytwo = data.match("<ChrSort>(.*)</ChrSort>");
                                if(twentytwo != null){
                                    outputNCBI.ChrSort=twentytwo[1];
                                }
                                else{
                                    outputNCBI.ChrSort='Information N/a';
                                }
                                var twentythree = data.match("<ScientificName>(.*)</ScientificName>");
                                if(twentythree != null){
                                    outputNCBI.ScientificName=twentythree[1];
                                }
                                else{
                                    outputNCBI.ScientificName='Information N/a';
                                }
                                var twentyfour = data.match("<CommonName>(.*)</CommonName>");
                                if(twentyfour != null){
                                    outputNCBI.CommonName=twentyfour[1];
                                }
                                else{
                                    outputNCBI.CommonName='Information N/a';
                                }
                                var twentyfive = data.match("<TaxID>(.*)</TaxID>");
                                if(twentyfive != null){
                                    outputNCBI.TaxID=twentyfive[1];
                                }
                                else{
                                    outputNCBI.TaxID='Information N/a';
                                }

                                 res.render('search.ejs', {

                                    gene : output,
                                    geneNCBI: outputNCBI // get the user out of session and pass to template
                             });

                                 

                            });

                        });
                             

                        });

                    }); 
                });
                         
            }); 

     });

    //route para procurar informação de um gene por keyword (header)

    app.post('/search', function(req, res) {

        console.log(JSON.stringify(req.body.keyword));
        var xyz = req.body.keyword.replace(/ /g,"%20");
        var options = {
          host: 'rest.kegg.jp',
          path: '/find/genes/'+JSON.stringify(xyz),
          headers: {
                'Content-Type': 'application/json'
            }
        };

         var request = http.get(options, function (response) {

            var data = '';

            response.setEncoding('utf8');

            response.on('data', function (chunk) {
                data += chunk;
            }); 

            response.on("end", function (err) {

                if(err || data == null || data == ''){
                    res.render('index.ejs');
                    return;
                }


                //console.log(data);          

                var result = data.split("\n");
                var one = JSON.parse(JSON.stringify(result[0].split("\t")));

                 res.render('geneslist.ejs', {
                    data : result
            });

        }); 


        }); 
    });

    //route para ir buscar as especies do advanced search - dropdown

    app.get('/asearch', function(req, res) {

        var Specie = require('../app/models/species');

        Specie.find(function(err, species) {
          if (err){ 
            console.error(err);
            res.render('index.ejs');
            return;
        }
          else{
            var species = JSON.parse(JSON.stringify(species));
            res.render('asearch.ejs', {
                data : species
            });
            return; 
        }

        });
    });

    //route do form da avanced search

    app.post('/asearch', function(req, res) {

            var id = req.body.genes; 
            var specie = req.body.species;

            if(id == null || specie == null){
                res.render('asearch.ejs');
                return;
            }

            var request = '';

            for(var i = 0; i < id.length;i++){

                if(i != id.length-1)
                    request += specie[i]+":"+id[i]+"+";
                else
                    request += specie[i]+":"+id[i];
            }

            var options = {
              host: 'rest.kegg.jp',
              path: '/get/' + request,
              headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            var request = http.get(options, function (response) {

                var data = '';

                response.setEncoding('utf8');

                response.on('data', function (chunk) {
                    data += chunk;
                }); 

                response.on("end", function (err) {

                    if(err || data == null || data == ''){
                        res.render('index.ejs');
                        return;
                    }

                    var regex = /ENTRY/gi, result, Entryindices = [];
                    while ( (result = regex.exec(data)) ) {
                        Entryindices.push(result.index);
                    }

                    var regex = /NAME/gi, result, Nameindices = [];
                    while ( (result = regex.exec(data)) ) {
                        Nameindices.push(result.index);
                    }

                    var IndicesAll = [];

                    for(var k=0; k<Entryindices.length;k++){

                        indice = data.substring(Entryindices[k]+5,Nameindices[k]-1).replace(/^\s+|\s+$/g,"");
                        indice = indice.substr(0,indice.indexOf(' '));

                        IndicesAll.push(indice);
                    }

                    var diff = (id).diff(IndicesAll);
                    var gene ='';
                    for(var j=0; j<diff.length;j++){

                        gene += specie[diff[j]]+":"+id[diff[j]]+";";
                        
                    }
                    console.log(gene.split(";").length-1);
                    console.log(gene);
                     console.log(gene.split(";")[0]);
                     res.render('geneslist.ejs', {
                        gene : gene,
                        type : 'asearch'
                    });
            }); 


            });
        });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
Array.prototype.diff = function(arr2) {
    var ret = [];
    for(var i in this) {   
        if(arr2.indexOf( this[i] ) > -1){
            ret.push( this.indexOf( this[i] ) );
        }
    }
    return ret;
};