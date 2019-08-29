#!/usr/bin/env node
'use strict'; 
const mdlinks = require('./index.js');
module.exports = (mdlinks) => {
  checkMdFiles(),
  readFile()
}