const fetch = require('fetch');
const fetchUrl = fetch.fetchUrl;
const fs = require('fs');

// //otra forma de resolver promesas
// let myFirstPromise = Promise.resolve('hola mundo');

// myFirstPromise.then(response => {
//     console.log(response)
// });

// let mySecondPromise = new Promise((resolve, reject) => {
//     setTimeout(() => resolve(5), 2000);
// })

// mySecondPromise.then(res => {
//     res += 5;
//     console.log(res);
// })

const getData = (url) => {
    return new Promise((resolve, reject) => {
        fetchUrl(url, (error, meta, body) => {
            if (meta){
                if (meta.status === 200){
                    resolve(meta.status.toString());
                } else {
                    reject (error);
                }
            }
        })
    })
}; 

let url = 'http://google.cl';
getData(url)
.then(res => {
    console.log('El estado de ', url, 'es ', res)
})
.catch(error => {
    console.log(error);
})

// const readFile = (fileName, type) => {
//     return new Promise((resolve, reject) => {
//         fs.readFile(fileName, type, (error, content) => {
//             if(error) {
//                 reject(error)
//             } else {
//                 resolve(content)
//             }
//         })
//     })
// }

// readFile('./src/prueba.md', 'utf-8')
// .then(res => {
//     console.log(res);
// })
// .catch(err => {
//     console.log(error)
// })