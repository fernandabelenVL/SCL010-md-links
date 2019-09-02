#!/usr/bin/env node
'use strict'; 
const process = require('process');
const fetch = require('fetch');
const pathNode = require('path');
const FileHound = require('filehound');
const commander = require('commander');
const fs = require('fs');
const marked = require('marked');



// leer línea de comando que ingresa usuario en la terminal.
// const userPath = [];
// for (i = 1; i < process.argv.length; i++){
//   userPath.push(process.argv[i]);
//   console.log("Absolute Path:", userPath);
//   };

// Obtener status de un link por medio de fetch.
// const fetchUrl = fetch.fetchUrl;
// fetchUrl("https://www.google.com", function(error, meta, body){
//   console.log("HTTP Status:" , meta.status);
//   console.log("Final Url:", meta.finalUrl);
// });



  let userPath = process.argv[2];
  // path.resolve para convertir en absoluta  
  userPath = pathNode.resolve(userPath);
  // path.normalize para normalizar el path en caso se que hayan errores de semántica
  userPath = pathNode.normalize(userPath);
  

// Lee los archivos y extrae links con info: link, texto 
const searchLinks = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      }
      let links = [];
      const renderer = new marked.Renderer();
      renderer.link = function (href, title, text) {
        links.push({
          // Url encontrada.
          href: href,
          // Texto que aparece acompañando al link.
          text: text,
          // Ruta del archivo donde se encontró el link.
          file: path
        })
      }
      marked(data, {
        renderer: renderer
      })
      console.log(links);
      resolve(links)
    });
  })
};


//FILEHOUND para encontrar archivos MD dentro un directorio
const findMdFiles = (path => {
  return new Promise((resolve,reject) => {
    FileHound.create()
    .paths(path)
    .ext('md')
    .find()
    .then(files => {
      //console.log("Archivos MD encontrados: ", files);
      if(files.length != 0){
      resolve(files)}
      else {(console.log("No se encontraron archivos .md dentro de " + path))}
    })
    .catch(err => {
    reject(new Error("Ruta no es válida"))
    })
  })
})


//comprobar si userPath es archivo o directorio
const checkMdFiles = (path) => {
  let conditionFile = fs.statSync(path)
  //PONER EL ERROR CUANDO LA RUTA NO EXISTE LA RUTA
  //si es archivo
  if (conditionFile.isFile() === true){
    searchLinks(userPath);
  }
   //si es directorio
  if (conditionFile.isFile() === false){
    console.log("es un directorio");
    findMdFiles(userPath);
  }
}
checkMdFiles(userPath);



//  //comandos (COMMANDER)----------------------------------------------
//  const program = new commander.Command();
//  program
//   .option('-v, --validate', 'ruta del archivo, link, texto, y validacion de link')
//   .option('-s, --stats', 'contador de links, contador de link unicos')
 
// program.parse(process.argv);

// if (!program.validate && !program.stats) console.log(`Path: ${filePath}`);
// if (program.validate !== undefined) console.log(`Path: ${fileName}, Link: ${fileName}, Texto: ${fileName}, Link Status: ${fileName}, HTTP Status: ${fileName}`);
// if (program.stats !== undefined) console.log(`Total: ${totalLinks}, Unique: ${totalLinks}`);
// if (program.validate !== undefined && program.stats !== undefined) console.log(`Total: ${totalLinks}, Unique: ${totalLinks}, Broken: ${brokenLinks}`);


// let options = {
//      stats: false,
//      validate: false
// } 

// let firstOption = process.argv[3];
// let secondOption = process.argv[4];

// if(firstOption ==="--validate" && secondOption === "--stats"||firstOption==="--stats" && secondOption === "--validate"||firstOption ==="--v" && secondOption === "--s"||firstOption==="--s" && secondOption === "--v"){
//      options.validate = true;
//      options.stats = true;
// }else if(firstOption==="--stats"|| firstOption === "--s"){
//      options.stats = true;
//      options.validate = false;
// }else if(firstOption==="--validate"|| firstOption === "--v"){
//      options.validate = true;
//      options.stats = false;
// };


module.exports = {
  checkMdFiles,
  findMdFiles,
  searchLinks,
}