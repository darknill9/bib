/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin');
const restaurateur = require('./restaurateur');
const fs = require('fs');

async function sandbox_page_bib(searchLink = 'https://guide.michelin.com/fr/fr/centre-val-de-loire/veuves/restaurant/l-auberge-de-la-croix-blanche') {
  try {
    //https://guide.michelin.com/fr/fr/restaurants/bib-gourmand
    //https://guide.michelin.com/fr/fr/centre-val-de-loire/veuves/restaurant/l-auberge-de-la-croix-blanche
    //https://guide.michelin.com/fr/fr/auvergne-rhone-alpes/grenoble/restaurant/le-rousseau

    //https://guide.michelin.com/fr/fr/auvergne-rhone-alpes/malataverne/restaurant/le-bistrot-270

    console.log(`🕵️‍♀️  browsing ${searchLink} source`);
    const restaurant = await michelin.scrapeRestaurant(searchLink);

    console.log(restaurant);

    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, searchLink] = process.argv;


async function sandbox(searchLink = 'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/') {
  try {
    
    console.log(`🕵️‍♀️  browsing ${searchLink} source`);

    const list_urls_restaurant = await michelin.scrapeNbBibRestaurant(searchLink);

    list_bib_resto = [];

    //console.log(list_urls_restaurant);
        /*
    console.log(list_urls_restaurant.length);

    let total_urls_resto = 0;

    for(let i = 0; i < list_urls_restaurant.length; i++){
      console.log(list_urls_restaurant[i].length);
      total_urls_resto += list_urls_restaurant[i].length;
    }

    console.log(total_urls_resto);
    */
    //console.log(list_urls_restaurant[0]);
    
    //list_urls_restaurant.length;



    for(let i = 0; i < 1; i++) {
      switch(i){
        case 0:
          console.log("1%");
          break;
        case Math.trunc(list_urls_restaurant.length/4):
          console.log("25%");
          break;
        case Math.trunc(list_urls_restaurant.length/2):
          console.log("50%");
          break;
        case Math.trunc(3*list_urls_restaurant.length/4):
          console.log("75%");
          break;
        case Math.trunc(list_urls_restaurant.length):
          console.log("100%");
          break;
      };

      for(let j = 0; j < list_urls_restaurant[i].length; j++){
        const bib = await michelin.scrapeRestaurant(list_urls_restaurant[i][j]);
        //console.log(bib);
        list_bib_resto.push(bib);
      }

    }
    
    console.log("longueur list bib : " + list_bib_resto.length);

    console.log(list_bib_resto);

    /*
    for(let i = 0; i < list_bib_resto.length; i++){
      console.log(list_bib_resto[i].name);
    }

    */



    //let list_bib_JSON = JSON.stringify(list_bib_resto, null, 4);


    fs.writeFile('list-bib-1.json', JSON.stringify(list_bib_resto), (err) => {
      if (err) throw err;
      console.log('Data written to file');
    });
    

    //fs.writeFileSync('list-bib-1.json', list_bib_JSON);

    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

/*
async function sandbox_maitre_restaurateur(searchLink = 'https://www.maitresrestaurateurs.fr/module/annuaire/ajax/load-maps-data') {
  try {
    console.log(`🕵️‍♀️  browsing ${searchLink} source`);
    
    let restaurant = [];
    let nbPage;

    nbPage = await restaurateur.scrapeNbPageMaitreRestaurateur(1);
    console.log("nombre total de pages du site à scraper : " + nbPage);

    // for(let i = 1; i <= nbPage; i++){
    //   console.log("page" + i);
    //   restaurant.push(await restaurateur.scrapePageMaitreRestaurateur(i));
    // }



    for(let i = 1; i <= 5; i++){
      console.log("page" + i);
      restaurant.push(await restaurateur.scrapePageMaitreRestaurateur(i));
    }

    //console.log(restaurant);

    console.log("nombre de page scrapées : " + restaurant.length);
    
    console.log(restaurant[0][0].names[1]);

    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
*/


async function sandbox_maitre_restaurateur() {
  try {
    console.log(`🕵️‍♀️  browsing \"https://www.maitresrestaurateurs.fr\" source`);
    
    let list_maitre_restaurant = [];
    let nbPage;

    nbPage = await restaurateur.scrapeNbPageMaitreRestaurateur(1);
    console.log("nombre total de pages du site à scraper : " + nbPage);

    
    for(let i = 1; i <= nbPage; i++){
      list_maitre_restaurant.push(await restaurateur.scrapePageMaitreRestaurateur(i));
      console.log("page " + i + " scrapée");
    }

    // console.log(list_maitre_restaurant[0]);
    // console.log(list_maitre_restaurant[1]);
    console.log("nombre de pages scrapées : " + list_maitre_restaurant.length);


    
    console.log("nombre de restaurant par page : " + list_maitre_restaurant[0][0].telephones.length);
    // console.log(list_maitre_restaurant[0][0].names[1]);
    // console.log(list_maitre_restaurant[0][0].adresses[1]);
    // console.log(list_maitre_restaurant[0][0].urls[1]);
    // console.log(list_maitre_restaurant[0][0].telephones[1]);

    const list_maitre_finale = [];

    for(let i = 0; i < list_maitre_restaurant.length; i++){
      console.log("page " + (i+1) + "/" + list_maitre_restaurant.length);
      for(let j = 0; j < list_maitre_restaurant[i][0].telephones.length; j++){

        list_maitre_finale.push(await restaurateur.scrapePageRestaurantMaitreRestaurateur(list_maitre_restaurant[i][0].urls[j]));
        list_maitre_finale[10*i + j].telephone_bis = list_maitre_restaurant[i][0].telephones[j];
        list_maitre_finale[10*i + j].adresse = list_maitre_restaurant[i][0].adresses[j];
      }
      
    }

    //console.log(list_maitre_finale[5]);

    //let list_maitre_JSON = JSON.stringify(list_maitre_finale, null, 5);
    //fs.writeFileSync('./files/list-maitre.json', list_maitre_JSON);

    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}



sandbox(searchLink)
//sandbox_page_bib(searchLink)
//sandbox_maitre_restaurateur()




function resto_bib_maitre(list_bib_JSON, list_maitre_JSON) {
  

  
  let rawdata_bib = fs.readFileSync(list_bib_JSON);
  let list_bib = JSON.parse(rawdata_bib);
  //console.log(list_bib);
  console.log("nombre de restaurant bib gourmand : " + list_bib.length);


  let rawdata_maitre = fs.readFileSync(list_maitre_JSON);
  let list_maitre = JSON.parse(rawdata_maitre);
  //console.log(list_maitre);
  //console.log(list_maitre[0][0]);
  console.log("nombre de restaurant maitre restaurateur : " + list_maitre.length);




  let list_resto_bib_maitre = [];
  let nb_match_tel = 0;
  let nb_match_url = 0;
  let nb_match_tel_bis = 0;

  for(let i = 0; i < list_maitre.length; i++){
    //console.log("resto maitre numero : " + (10*i + j) + " en train d'etre testé ...");
    for(let k = 0; k < list_bib.length; k++){
      //console.log("bib resto : " + list_bib[k].telephone);
      //console.log("maitre resto : " + list_maitre[i][0].telephones[j]);

      //console.log();
      

      // if(list_bib[k].telephone === list_maitre[i].telephone_bis || list_bib[k].telephone === list_maitre[i].telephone){
      //   list_resto_bib_maitre.push(list_bib[k]);
      //   console.log("bib resto : " + list_bib[k].telephone);
      //   console.log("maitre resto : " + list_maitre[i].telephone_bis);
      //   console.log("maitre resto : " + list_maitre[i].telephone);
      // }



      if((list_bib[k].url == list_maitre[i].url && list_bib[k].url != undefined) || (list_bib[k].telephone === list_maitre[i].telephone) || (list_bib[k].telephone === list_maitre[i].telephone_bis)){
        
        if((list_bib[k].url == list_maitre[i].url && list_bib[k].url != undefined)){
          nb_match_url++;
        }

        if(list_bib[k].telephone === list_maitre[i].telephone){
          nb_match_tel++;
        }

        if(list_bib[k].telephone === list_maitre[i].telephone_bis){
          nb_match_tel_bis++;
        }

        if(list_maitre[i].telephone_bis != list_bib[k].telephone){
          console.log("bib : " + list_bib[k].name + ", " + list_bib[k].adresse + ", " + list_bib[k].telephone + ", " + list_bib[k].url);
          console.log("maitre : " + list_maitre[i].name + ", " + list_maitre[i].adresse + ", " + list_maitre[i].telephone + ", " + list_maitre[i].telephone_bis + ", " + list_maitre[i].url);
        }
        /*
        if(list_bib[i].telephone != list_maitre[i].telephone){
          console.log("bib : " + list_bib[k].name + ", " + list_bib[k].adresse + ", " + list_bib[k].telephone + ", " + list_bib[k].url);
          console.log("maitre : " + list_maitre[i].name + ", " + list_maitre[i].adresse + ", " + list_maitre[i].telephone + ", " + list_maitre[i].telephone_bis + ", " + list_maitre[i].url);
        }

        if(list_bib[i].url != list_maitre[i].url){
          console.log("bib : " + list_bib[k].name + ", " + list_bib[k].adresse + ", " + list_bib[k].telephone + ", " + list_bib[k].url);
          console.log("maitre : " + list_maitre[i].name + ", " + list_maitre[i].adresse + ", " + list_maitre[i].telephone + ", " + list_maitre[i].telephone_bis + ", " + list_maitre[i].url);
        }
        */


        list_resto_bib_maitre.push(list_bib[k]);
        
        //console.log("bib : " + list_bib[k].name + ", " + list_bib[k].adresse + ", " + list_bib[k].telephone + ", " + list_bib[k].url);
        //console.log("maitre : " + list_maitre[i].name + ", " + list_maitre[i].adresse + ", " + list_maitre[i].telephone + ", " + list_maitre[i].telephone_bis + ", " + list_maitre[i].url);  
        
        //console.log("bib : " + list_bib[k].url);
        //console.log("maitre : " + list_maitre[i].url);
      }

      
      // if(list_bib[k].telephone === list_maitre[i].telephone){
      //   //console.log("reussi !!!! ")
      //   console.log("bib resto : " + list_bib[k].telephone);
      //   console.log("maitre resto : " + list_maitre[i].telephone);

      //   //console.log("bib resto : " + list_bib[k].name + ", " + list_bib[k].adresse + ", " + list_bib[k].telephone);
      //   //console.log("maitre resto : " + list_maitre[i].name + ", " + list_maitre[i].adresse + ", " + list_maitre[i].telephone + ", " + list_maitre[i].telephone_bis);
        
      //   list_resto_bib_maitre.push(list_bib[k]);
      // }

      // if(list_bib[k].telephone === list_maitre[i].telephone_bis){
      //   list_resto_bib_maitre.push(list_bib[k]);
      //   console.log("bib resto : " + list_bib[k].telephone);
      //   console.log("maitre resto : " + list_maitre[i].telephone_bis);
      // }


    
      

      // if(list_bib[k].url === list_maitre[i].url && list_bib[k].url != undefined){
      //   list_resto_bib_maitre.push(list_bib[k]);
      // }
      
    }
  }
    
  //console.log(list_resto_bib_maitre);

  console.log("nombre de resto bib et maitre en meme temps : " + list_resto_bib_maitre.length);
  console.log("nombre de match url : ", nb_match_url);
  console.log("nombre de match tel : ", nb_match_tel);
  console.log("nombre de match tel_bis : ", nb_match_tel_bis);
}



//resto_bib_maitre('list-bib.json', 'list-maitre.json');