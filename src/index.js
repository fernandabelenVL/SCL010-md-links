#!/usr/bin/env node
const mdLinks = require('./md-links.js');
const chalk = require('chalk');


let path = process.argv[2]

let options = {
  stats: false,
  validate: false,
}

process.argv.forEach(element =>{
 if( element == "--stats"){
   options.stats = true
 }
if(element == "--validate"){
  options.validate = true
}
})

mdLinks.mdLinks(path,options).then(res=>{
  if(options.validate && options.stats){
    return console.log(chalk.magenta("Total Links: "+ res.total)+"\n"+chalk.green("Ok Links: "+res.ok)+"\n"+chalk.red("Broken Links: "+res.broken))
  }
  if(options.validate){
    if(res.length === 0){
      return console.log(chalk.red("No se encontraron links"))
    }
    let validateLinks = res.map(x=>x.file+"  "+chalk.blue(x.href)+"  "+chalk.cyan(x.text.substr(0,40))+"  "+x.status)
    return console.log(validateLinks.join("\n "))
  }
  if(options.stats){
    return console.log(chalk.magenta("Total Links: "+ res.total)+"\n"+chalk.yellow("Unique Links: "+res.unique))
  }else{
    if(res.length === 0){
      return console.log(chalk.red("No se encontraron links"))
    } 
    const resLinks = res.map(x=>x.file+"  "+chalk.blue(x.href)+"  "+chalk.cyan(x.text.substr(0,40)))
    return console.log(resLinks.join("\n "))
  }
}).catch(err=>{
  console.log(chalk.red(err.message))
});