const axios = require('axios');
const cheerio = require('cheerio');
const querystring = require('querystring');


module.exports.scrapePageMaitreRestaurateurAncienneMethode = async url => {
  urls_resto = [];
  
  const response = await axios(url);
  const {data, status} = response;

  restaurants = data.split("\n");
  console.log(restaurants[0]);
  console.log(restaurants[1]);
  console.log(restaurants.length);

  if (status >= 200 && status < 300) {


  }

  urls_resto.push(data);


  //console.log(urls_resto);

  return null;
};

module.exports.scrapeNbPageMaitreRestaurateur = async page => {
  let nbPage;
  const payload = {
    'page' : page,
    'request_id' : '2fa78222d006341657946ae2360c8352'
  };
  
  const options = {
    'url' : 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult',
    'method' : 'POST',
    'headers': {'content-type': 'application/x-www-form-urlencoded'},
    'data': querystring.stringify(payload) 
  };
  
  const response = await axios(options);
  const {data, status} = response;
  
  

  if (status >= 200 && status < 300) {
    nbPage = parseNbPage(data);
  }

  return nbPage;
};

const parseNbPage = data => {
  const $ = cheerio.load(data);

  const nbPage = $('.end').attr("data-page");

  return nbPage;
};

module.exports.scrapePageMaitreRestaurateur = async page => {
  const namelist = [];
  const payload = {
    'page' : page,
    'request_id' : '2fa78222d006341657946ae2360c8352'
  };
  
  const options = {
    'url' : 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult',
    'method' : 'POST',
    'headers': {'content-type': 'application/x-www-form-urlencoded'},
    'data': querystring.stringify(payload) 
  };
  
  const response = await axios(options);
  const {data, status} = response;
  
  //console.log(data);
  

  if (status >= 200 && status < 300) {
    namelist.push(parse(data));
  }

  return namelist;
};


/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data);

  // const names = [];
  const urls = [];
  const adresses = [];
  const telephones = [];

  /*
  $('.single_libel').each((i, element) => {
    name3 = $(element).text();
    //console.log(name3);
    //console.log(name3.trim());
    //name3 = name3.replace("\n          \n            ","");
    //name3 = name3.replace("\n          \n      ", "");
    names.push(name3.trim());
  });*/

  $('.single_details > div > div:nth-child(2) > div').each((i, element) => {
    adresse_bis = $(element).text();
    // adresse_bis = adresse_bis.replace("\n              ","");
    // adresse_bis = adresse_bis.replace("\n              \n              \n             ","");
    // adresse_bis = adresse_bis.replace("\n              ","");
    //adresses.push(adresse_bis.replace(/(\r\n|\n|\r)/gm, ""));
    adresses.push((adresse_bis.replace(/[\n\r]/g, "")).trim());

    //adresses.push(((adresse_bis.replace(/[\n\r]/g, "")).trim()).replace(/\s/g,''));

  });

  $('.single_details > div > div:nth-child(3) > div').each((i, element) => {
    telephone_bis = $(element).text();
    //telephone_bis = telephone_bis.replace("\n              ","");
    //telephone_bis = telephone_bis.replace("\n              \n              \n             ","");
    //telephone_bis = telephone_bis.replace("\n              ","");
    //console.log(telephone_bis.trim());
    telephones.push(telephone_bis.trim().replace(/\s/g,''));
  });


  $('.single_libel > a').each((i, element) => {
    url = $(element).attr('href');
  
    urls.push("https://www.maitresrestaurateurs.fr" + url);
  }); 



  /*
  const other = [];

  $('.single_desc').each((i, element) => {
    const link = $(element).text().trim();
  
    other.push(link);
  }); */



  // console.log(name);
  // console.log(adresses);
  // console.log(telephones);
  // console.log(urls);
 
  //return other;

  return {urls, telephones, adresses};
};



module.exports.scrapePageRestaurantMaitreRestaurateur = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parsePageMaitre(data);
  }

  console.error(status);

  return null;
};

const parsePageMaitre = (data) => {
  const $ = cheerio.load(data);

  const name_temp = $('.section-item-right > span').text().trim().split('\n');
  const name = name_temp[0];

  const url = $('.section-item-right > a').attr('href');
  
  const adresse = "";

  //const telephone = $('.section-item-right').text().trim().match(/\d+/g);
  const telephone_temp = $('.section-item-right').text().trim().match(/(((\d{2})(\s)){4}(\d){2})|(\d{10})/g);
  //const telephone = $('.fa-mobile').siblings();

  let telephone;
  if(telephone_temp != null){
    telephone= telephone_temp[0].replace(/\s/g,'');
  }

  else{
    telephone = "";
  }


  const telephone_bis = "";

  return {name, adresse, telephone, telephone_bis, url};
};
