Vous allez recevoir du texte sur `process.stdin`.  Bufferisez le texte
et inversez son contenu complet, grâce au module `concat-stream`, avant
d’envoyer le résultat final sur la sortie standard.

`concat-stream` est un flux en écriture auquel vous passez une fonction de
rappel qui sera invoquée avec un unique `Buffer` une fois l’intégralité du
contenu lue.  Voici un exemple qui s’en sert pour bufferiser le contenu POST
d’une requête HTTP afin de pouvoir faire un `JSON.parse()` sur les données
transmises :

    var concat = require('concat-stream');
    var http = require('http');

    var server = http.createServer(function (req, res) {
        if (req.method === 'POST') {
            req.pipe(concat(function (body) {
                var obj = JSON.parse(body);
                res.end(Object.keys(obj).join('\n'));
            }));
        }
        else res.end();
    });
    server.listen(5000);

Pour votre aventure, vous aurez seulement besoin de bufferiser l’entrée
à l’aide de `concat()` à partir de `process.stdin`.

Assurez-vous d’avoir installé le module dans le répertoire de votre programme,
par exemple comme ceci :

    npm install split concat-stream
