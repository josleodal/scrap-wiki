const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');
const app = express();

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap';
const links = [];
const raperos = []; 

app.get('/', async (req, res) => {
 
      const response = await axios.get(url);
  
      if (response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html);
        const tituloPrincipal = $('title').text();
  
        $('#mw-pages a').each((index, element) => {
          const link = $(element).attr('href');
          links.push(link);
        });
  
        for (const value of links) {
          const raperoResponse = await axios.get(`https://es.wikipedia.org${value}`);
          const raperoPagina = cheerio.load(raperoResponse.data);
  
          const rapero = {
            titulo: raperoPagina('h1').text(),
            imagen: raperoPagina('.imagen img').attr('src'),
            parafos: raperoPagina('#mw-content-text').find('p').text()
          };
  
          raperos.push(rapero);
  
          //console.log(rapero);
        }
  
        res.send(`
          <h1>${tituloPrincipal}</h1>
          <ul>
            ${raperos.map(element => `
              <li>
                <p>${element.titulo}</p>
                <p><img src="${element.imagen}"/></p>
                <p>${element.parafos}</p>
              </li>
            `).join('')}
          </ul>
        `);
      } 
  });
  
  app.listen(3000, () => {
    console.log(`http://localhost:3000`);
  });
  