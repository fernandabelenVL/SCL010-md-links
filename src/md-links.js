#!/usr/bin/env node
'use strict'; 
const process = require('process');
const fetch = require('node-fetch');
const fetchUrl = fetch.fetchUrl;
const pathNode = require('path');
const FileHound = require('filehound');
const commander = require('commander');
const fs = require('fs');
const marked = require('marked');


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
      resolve(links)
      validateLinks(links);
      //console.log(statsLinks(links));
    });
  })
};

const validateLinks = (links) => {
  return new Promise((resolve, reject) => {
     
    let fetchLinks = links.map(element => {  
      
      return fetch(element.href).then(res =>{
          element.statusCode = res.status;
          element.status = res.statusText;
        }).catch((err)=>{
          element.status = err.code
        }) 
    })
    
    Promise.all(fetchLinks).then(res => {
      resolve(links)
      console.log(links);
    })
  })
}

//stats de cada link 
const statsLinks = (links, path) => {
  let href = links.map(element => element.href);
  const uniqueLinks = new Set(href);
  return {
    path: userPath,
    total: links.length,
    unique: uniqueLinks.size
  }
}

//FILEHOUND para encontrar archivos MD dentro un directorio
const findMdFiles = (path => {
  return new Promise((resolve,reject) => {
    FileHound.create()
    .paths(path)
    .ext('md')
    .find()
    .then(files => {
      if(files.length != 0){
      resolve(files)
      // findInDirectory(files);
      }
      else {(console.log("No se encontraron archivos .md dentro de " + path))}
    })
    .catch(err => {
    reject(new Error("Ruta no es válida"))
    })
  })
})

// genera arreglo con informacion de los links dentro del directorio
const findInDirectory = (files) =>{
  return new Promise((resolve, reject)=>{
    let count = 0;
    let allLinks = []
    files.forEach(element => {
      searchLinks(element).then(singleLink => {
        count++
        allLinks = allLinks.concat(singleLink)
        if(count == files.length){
          resolve(allLinks)
        }
      }).catch(err => {
          reject(err)
        })
    })
  })
}

//comprobar si userPath es archivo o directorio
const fileOrDirectory = (path) => {
  let conditionFile = fs.statSync(path)
  //PONER EL ERROR CUANDO LA RUTA NO EXISTE LA RUTA
  //si es archivo
  if (conditionFile.isFile() === true){
    searchLinks(path);
  }
   //si es directorio
  // if (conditionFile.isFile() === false){
  else{
      return new Promise((resolve, reject) => { 
        findMdFiles(path)
        .then(files => {
          findInDirectory(files)
          .then(links => {
            resolve(links)
            //console.log(links);
          })
        }).catch(err =>{
          reject(new Error(err.message))
        })
      })
    }
  }
// }
fileOrDirectory(userPath);



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
  fileOrDirectory,
  findMdFiles,
  searchLinks,
  findInDirectory
}