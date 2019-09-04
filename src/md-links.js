const fs = require('fs');
const marked = require('marked');
const FileHound = require('filehound');
const fetch = require('node-fetch');


//FILEHOUND para encontrar archivos MD dentro un directorio
const findMdFiles = (path =>{
  return new Promise((resolve,reject) => {
    FileHound.create()
    .paths(path)
    .ext('md')
    .find()
    .then(files => {
      if(files.length != 0){
      resolve(files)}
      reject(new Error("No se encontraron archivos .md dentro de " + path))
    })
    .catch(err => {
      reject(new Error("Ruta no es válida"))
    })
  })
})


//leer archivo.md
const readMd = (path => {
  return new Promise((resolve,reject)=>{
    fs.readFile( path,'utf8', (err, data) => {
      if (err){
        reject(new Error("No se encontro el archivo " + path))
      }
      resolve(data)
    })
  })
})

//obtener links de un archivo .md
const searchLinks = (path => {
  return new Promise((resolve, reject) => {
    readMd(path).then(res => {
      let links = [];
      const renderer = new marked.Renderer();
      renderer.link = function(href,title,text){

        if(!href.startsWith("mailto:")){
          links.push({
            // Url encontrada.
            href:href,
            // Texto que aparece acompañando al link.
            text:text,
            // Ruta del archivo donde se encontró el link.
            file:path})
        }
      } 
        marked(res,{renderer:renderer}); 
        resolve(links)
    })
    .catch(err => {
      reject(err)
      })
  })
})

// genera arreglo con informacion de los links dentro del directorio
const findInDirectory = (files) =>{
  return new Promise((resolve, reject)=>{
    let count = 0;
    let allLinks = []
    files.forEach(element => {
      searchLinks(element).then(singleLink =>{
        count++
        allLinks = allLinks.concat(singleLink)
        if(count == files.length){
          resolve(allLinks)
        }
      }).catch(err=>{
          reject(err)
        })
    })
  })
}

// true si el archivo es .md --> necesario comprobar
const isMd = (path =>{
  if(path.slice(-3)== ".md"){
    return true;
  }
  return false;
})

//comprobar si path es archivo o directorio
const fileOrDirectory = (path) => {
   //checkea si es archivo MD
  if(isMd(path)){
    return searchLinks(path)
  }
   //si es directorio
  else {
      return new Promise((resolve, reject) => { 
        findMdFiles(path)
        .then(files => {
          findInDirectory(files)
          .then(links => {
            resolve(links)
          })
        }).catch(err =>{
          reject(new Error(err.message))
        })
      })
    }
  }
  
  //[option --validate --stats]
const statsAndValidateLinks = (path) =>{
  return new Promise((resolve,reject)=>{
    validateLinks(path).then(links=>{
      const statusLinks = links.map(element => element.status)
      let okLinks = statusLinks.toString().match(/200/g)
      const totalLinks = links.length
      let brokenLinks = 0

      if(okLinks != null){
        okLinks = okLinks.length
      }else{
        okLinks =  0
      }
      
      brokenLinks = totalLinks - okLinks
      resolve({
        total: totalLinks,
        ok: okLinks,
        broken: brokenLinks
      })
    }).catch(err=>{
      reject(err)
    })
  })
}
// [option --validate]
const validateLinks = (path) => {
  return new Promise((resolve, reject) => {
    fileOrDirectory(path)
    .then(links => { 
      let fetchLinks = links.map(element => {  
        return fetch(element.href).then(res => {
          element.statusCode = res.status;
          element.status = res.statusText;
        })
        .catch((err) => {
          element.status = err.code
        }) 
    })
      Promise.all(fetchLinks).then(res => {
          resolve(links)
      })
    })
    .catch(err=>{
      reject(err)
    })
  })
}
// [option --stats]
const statsLinks = (path) =>{
return new Promise((resolve, reject) => { 
  fileOrDirectory(path)
  .then(links =>{
    const uniqueLinks = new Set(links.map(element => element.href))
    resolve({total:links.length,
      unique : uniqueLinks.size})
    })
  .catch(err=>{
    reject(err)
  })
  })
}
//
const mdLinks = (path, options) =>{
  if(!path || !options){
    return new Promise((resolve,reject)=>{
      reject(new Error ("Faltan argumentos"))
    })
  }
  if(options.validate && options.stats){
    return statsAndValidateLinks(path)
  }  
  if(options.validate){
    return validateLinks(path)
  }
  if(options.stats){
    return statsLinks(path)
  }
  else{
    return fileOrDirectory(path)}
  }

module.exports = {
  mdLinks 
}