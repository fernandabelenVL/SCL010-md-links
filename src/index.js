#!/usr/bin/env node
const mdLinks = require('./md-links.js');
const process = require('process');
const pathNode = require('path');
const chalk = require('chalk');


let path = process.argv[2]
 // path.resolve para convertir en absoluta  
path = pathNode.resolve(path);
 // path.normalize para normalizar el path en caso se que hayan errores de semántica
path = pathNode.normalize(path);

let options = {
  stats: false,
  validate: false,
}

process.argv.forEach(element =>{
 if( element == "--stats" || element == "-s" ){
   options.stats = true
 }
if(element == "--validate" || element == "-v"){
  options.validate = true
}
})

mdLinks.mdLinks(path,options).then(res => {
  if(options.validate && options.stats){
    return console.log(chalk.bgBlue("Total Links: " + res.total) + "\n" + chalk.bgGreen("Ok Links: " + res.ok) + "\n" + chalk.bgRed("Broken Links: " + res.broken))
  }
  if(options.validate){
    if(res.length === 0){
      return console.log(chalk.red("No se encontraron links"))
    }
    let validateLinks = res.map(element => chalk.bgBlack(element.file) +"  " + chalk.yellowBright(element.href) + "  " + chalk.cyanBright(element.text.substr(0,50)) + "  " + chalk.bgMagenta(element.status) + " " + chalk.bgGreen(element.statusCode))
    return console.log(validateLinks.join("\n "))
  }
  if(options.stats){
    return console.log(chalk.bgBlue("Total Links: "+ res.total) + "\n" + chalk.bgMagenta("Unique Links: "+res.unique))
  }else{
    if(res.length === 0){
      return console.log(chalk.red("No se encontraron links"))
    } 
    const resLinks = res.map(element => element.file + "  " + chalk.yellowBright(element.href) + "  " + chalk.cyanBright(element.text.substr(0,50)))
    return console.log(resLinks.join("\n "))
  }
}).catch(err => {
  console.log(chalk.red(err.message))
});