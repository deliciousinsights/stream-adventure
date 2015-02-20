Pour ce défi, écrivez un serveur HTTP qui utilise un flux `through()`
afin de renvoyer le flux entrant de données converti en majuscules
pour les requêtes POST.

Les flux ne sont pas juste des fichiers ou les entrée/sortie standards.
Saviez-vous que c’est aussi le cas des objets requête et réponse dans les
gestionnaires passés à l’API noyau `http.createServer()` de Node.js ?

Par exemple, nous pouvons streamer un fichier vers la réponse HTTP :

    var http = require('http');
    var fs = require('fs');
    var server = http.createServer(function (req, res) {
        fs.createReadStream('file.txt').pipe(res);
    });
    server.listen(process.argv[2]);

C’est génial, parce que notre serveur peut répondre immédiatement, sans
avoir à tout stocker en mémoire d’abord.

À l’inverse, nous pouvons streamer une requête pour remplir un fichier
avec ses données :

    var http = require('http');
    var fs = require('fs');
    var server = http.createServer(function (req, res) {
        if (req.method === 'POST') {
            req.pipe(fs.createWriteStream('post.txt'));
        }
        res.end('beep boop\n');
    });
    server.listen(process.argv[2]);

Vous pouvez tester ce petit programme avec curl :

    $ node server.js 8000 &
    $ echo hack la planète | curl -d@- http://localhost:8000
    beep boop
    $ cat post.txt
    hacke la planète

Votre serveur HTTP doit écouter sur un numéro de port fourni par
`process.argv[2]`, et convertir les contenus de requêtes POST en majuscules,
en utilisant une approche similaire à celle de l’exercice TRANSFORM.

Pour rappel, voici un exemple qui redéfinit explicitement les fonctions de
rappel par défaut pour `through()` :

    var through = require('through')
    process.stdin.pipe(through(write, end)).pipe(process.stdout);

    function write (buf) { this.queue(buf) }
    function end () { this.queue(null) }

Faites ce genre de choses, mais émettez des contenus en majuscules dans
votre serveur HTTP, en réponse aux requêtes POST.

Assurez-vous d’avoir installé le module `through` dans le répertoire
de votre programme, par exemple comme ceci :

    npm install through
