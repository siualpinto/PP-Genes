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

    app.get('/addFavorites/:id/:specie', isLoggedIn, function(req, res) {

        var User            = require('../app/models/user');

        var email = req.user.local.email;
        var favoritesnew = req.user.local.favorites;
        var specie = req.params.specie.split(":");
        var id = req.params.id.split(":");

        var newfavorite = specie[1] + ":" + id[1];

        if(isInArray(newfavorite, favoritesnew)){
            res.redirect('/search/:' + specie[1] + "/:" + id[1]);
            return;
        }

        favoritesnew.push(newfavorite);

        var query = {'local.email':email};

        User.findOne(query, function (err, user) {
            user.local.email = req.user.local.email;
            user.local.name = req.user.local.name;
            user.local.institution = req.user.local.institution;
            user.local.password = req.user.local.password;
            user.local.favorites = favoritesnew;

            user.save(function (err) {
                if(err) {
                    res.render('index.ejs');
                    return;
                }
                else{
                    res.redirect('/search/:' + specie[1] + "/:" + id[1]);
                    return;
                }
            });
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


            var lines = data.split("\n");
            var entries = [];
            var content = [];

            for(var i = 0;i < lines.length;i++){
                if(lines[i].substring(0,1) != ' ')
                    entries.push(lines[i].substring(0,12));
            }


            var copy2 = data.replace(/(\r\n|\n|\r)/gm,"");
                    //console.log(copy);
                    for(var j = 0;j < entries.length-2;j++){
                        var one = copy2.match(entries[j].trim()+"(.*?)"+entries[j+1].trim());
                        content.push(one[1]);
                        //console.log(one);
                    }

                    res.render('disease.ejs', {
                        ids     : entries,
                        disease : content
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

    app.get('/search/:params/:params2',function(req, res) {

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

            var lines = data.split("\n");
            var entries = [];
            var content = [];

            for(var i = 0;i < lines.length;i++){
                if(lines[i].substring(0,1) != ' ')
                    entries.push(lines[i].substring(0,12));
            }


            var copy2 = data.replace(/(\r\n|\n|\r)/gm,"");
                    //console.log(copy);
                    for(var j = 0;j < entries.length-2;j++){
                        var one = copy2.match(entries[j].trim()+"(.*?)"+entries[j+1].trim());
                        content.push(one[1]);
                        //console.log(one);
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
                               gene : entries,
                               gene2 : content,
                               user : req.user,
                               specie: first[1],
                               id: second[1]
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
                                    gene : entries,
                                    gene2 : content,                                   
                                    user : req.user,
                                    specie: first[1],
                                    id: second[1]

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

                                            gene : entries,
                                            gene2 : content,
                                            geneNCBI: outputNCBI, // get the user out of session and pass to template
                                            user : req.user,
                                           specie: first[1],
                                           id: second[1]
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

            var result = data.split("\n");

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

            var lines = data.split("\n");
            var entries = [];
            var content = [];

            for(var i = 0;i < lines.length;i++){
                if(lines[i].substring(0,1) != ' ')
                    entries.push(lines[i].substring(0,12));
            }

            copy2 = data.split("///");

            for(var k = 0;k < copy2.length-1;k++){
                for(var j = 0;j < entries.length-1;j++){
                    if(entries[j].trim() === 'ENTRY'){
                        var one = copy2[k].replace(/(\r\n|\n|\r)/gm,"").match(entries[j].trim()+"(.*)"+entries[j+1].trim());
                        if(!isInArray(one[1], content))
                            content.push(one[1]);
                    }
                }
            }

            var gene="";

            for(var l = 0; l < content.length;l++){

                for(var m = 0; m < id.length;m++){

                    var pat = "\\b("+id[m]+")\\b";
                    var regex = new RegExp(pat, "g");
                    var str = content[l].toString().slice(7);

                    if(str.match(regex)){
                        gene += specie[m]+":"+id[m]+";";
                    }

                }

            }

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

function isLoggedInBoolean(req) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return true;
    return false;
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function matchExact(r, str) {
 var match = str.match(r);
 return match != null && str == match[0];
}
