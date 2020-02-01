'use strict';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
      'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];


const mots = ['crayon', 'papier', 'ciseaux', 'pierres', 'bateau', 'vache', 'poulet', 'voile', 'stylo', 'piano', 'guitare', 'table', 'chaise', 'siege', 'lampe', 'pied', 'bras', 'main'];
let mot = mots[getRandomInt(mots.length-1)]

console.log("mot choisi", mot);

let result = []
let nb = 10;

for (let i = 0; i < mot.length; i++) {
  result.push('_');
}

const port = 3001

const express = require('express');
const cors = require('cors');
const open = require('open');

const app = express();

app.use(cors())

app.use(express.static('src/site-web'));

app.get('/pendu/init', function (req, res) {
  result = [];
  nb = 10;
  for (let i = 0; i < mot.length; i++) {
    result.push('_');
  }
  res.send('ready!')
})

app.get('/pendu/:letter', function (req, res) {
  const letter = req.params.letter;
  let status = 'en jeu'
  console.log("request letter ", letter)
  if (nb > 0) {
    if (alphabet.indexOf(letter) == -1){ // -1  si non trouvé sinon un numéro
      res.status(400).json({
        code: 'malformed',
        message: 'La lettre n\'est pas dans l\'alphabet',
      })
     
      return;
    }
    let found = false;
    for (let i = 0; i < mot.length; i++) {
      if (mot[i] === letter) {
        found = true;
        result[i] = letter;
      }
    }
    if (!found) {
      nb--;
    }
  }
  let i;
  for (i = 0; i < mot.length; i++) {
    if (result[i] === '_') {
      status = nb === 0 ? 'perdu' : 'en jeu';
      break;
    }
  }
  if (i === mot.length) {
    status = 'gagné'
  }
  res.json({
    letter, result, status, nb
  })
})

app.listen(port)
console.log('Hello je suis le serveur qui écoute sur le port', port);

open('http://localhost:' + port);