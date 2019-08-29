#!/usr/bin/env node
const mdlinks = require('./md-links');
const process = require('process');
const fetch = require('fetch');
const fetchUrl = fetch.fetchUrl;
const pathNode = require('path');
const FileHound = require('filehound');
const commander = require('commander');
const program = new commander.Command();
const fs = require('fs');


// leer línea de comando que ingresa usuario en la terminal.
// const userPath = [];
// for (i = 1; i < process.argv.length; i++){
//   userPath.push(process.argv[i]);
//   console.log("Absolute Path:", userPath);
//   };

// Obtener status de un link por medio de fetch.
// fetchUrl("https://www.google.com", function(error, meta, body){
//   console.log("HTTP Status:" , meta.status);
//   console.log("Final Url:", meta.finalUrl);
// });



  let userPath = process.argv[2];
  // path.resolve para convertir en absoluta  
  userPath = pathNode.resolve(userPath);
  // path.normalize para normalizar el path en caso se que hayan errores de semántica
  userPath = pathNode.normalize(userPath);
  let fileName = '';

//readFile lee el archivo md encontrado
const readFile = (fileName, type) => {
  return new Promise((resolve, reject) => {
      fs.readFile(fileName, type, (error, content) => {
          if(error) {
              reject(error)
          } else {
              resolve(content)
          }
      })
  })
};

//FILEHOUND para encontrar archivos MD dentro un directorio
const findMdFiles = (userPath) => {
  const files = FileHound.create()
  .paths(userPath)
  .ext('md')
  .find()
  .then(files => {
    console.log('Archivos MD encontrados: ', files);
    files.forEach(function(file){
      readFile(file, 'utf-8')
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(error)
      })    
      })
    })
  };

//reviso si el userPath es archivo o directorio
const checkMdFiles = () => {
  let conditionFile = fs.statSync(userPath);
  //condición si es archivo
  if (conditionFile.isFile() === true){
    console.log("es un archivo");
    fileName = userPath;
    readFile(fileName, 'utf-8')
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(error)
    })    
  }
   //condición si es directorio
  if (conditionFile.isFile() === false){
    console.log("es un directorio");
    findMdFiles(userPath);
  }
}
checkMdFiles();





 //comandos (COMMANDER)----------------------------------------------
program
  .option('-v, --validate', 'ruta del archivo, link, texto, y validacion de link')
  .option('-s, --stats', 'contador de links, contador de link unicos')
 
program.parse(process.argv);

if (!program.validate && !program.stats) console.log(`Path: ${fileName}`);
if (program.validate !== undefined) console.log(`Path: ${fileName}, Link: ${fileName}, Texto: ${fileName}, Link Status: ${fileName}, HTTP Status: ${fileName}`);
if (program.stats !== undefined) console.log(`Total: ${totalLinks}, Unique: ${totalLinks}`);
if (program.validate !== undefined && program.stats !== undefined) console.log(`Total: ${totalLinks}, Unique: ${totalLinks}, Broken: ${brokenLinks}`);


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



