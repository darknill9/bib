const axios = require('axios');
const cheerio = require('cheerio');

const parsePageBib = data => {
  const $ = cheerio.load(data);
  const links = [];
  
  const site = $('a.link').each((i, element) => {
    const link = $(element).attr('href');

    links.push("https://guide.michelin.com" + link);

  });

  return links;

  /*
  for (let i = 1; i < 40; i++) {
    url_restaurant.push("https://guide.michelin.com" + $('body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation > div:nth-child('+i+') > div > a').attr('href'));
  }
	url_restaurant.splice(8,1);
  return url_restaurant;*/
};





module.exports.scrapeNbBibRestaurant = async url => {
  urls_resto = [];
  var ok = true;
  i=1;
  while(ok) {
    const response = await axios(url+i);
    const {data, status} = response;


    if (status >= 200 && status < 300) {
        

      if(parsePageBib(data).length == 0){
        ok = false;
      }
      
      else{
        urls_resto.push(parsePageBib(data));
      };

    }
    i++;
  }

  return urls_resto;
};



/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parseRestaurantBib = data => {
  const $ = cheerio.load(data);
  //const name = $('.restaurant-details__heading--title').text();
  const name = $('.link').attr('data-restaurant-name');

  const url = $('.link-item > a').attr('href');
  //const experience = $('#experience-section > ul > li:nth-child(2)').text();
  
  const adresse = $(".d-lg-none > ul > li:nth-child(1)").text();

  //const telephone = $('body > main > div.restaurant-details > div.container > div > div.col-xl-8.col-lg-7 > section:nth-child(4) > div.row > div:nth-child(1) > div > div:nth-child(1) > div > div > span.flex-fill').text();
  //const other = $('body > main > div.restaurant-details > div.container > div > div.col-xl-8.col-lg-7 > section:nth-child(3) > div.row > div:nth-child(1) > div > div:nth-child(1) > div > div > a').attr('href');

  //const telephone = $('.link').attr('href').substr(4);
  const telephone = $('.link').attr('href').replace(/\s/g,'').replace("tel:+33", "0");

  return {name, adresse, telephone, url};
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
module.exports.scrapeRestaurant = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parseRestaurantBib(data);
  }

  console.error(status);

  return null;
};





/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
module.exports.get = () => {
  return [];
};
