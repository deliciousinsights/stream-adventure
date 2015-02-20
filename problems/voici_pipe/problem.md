Votre programme va recevoir un chemin de fichier comme premier argument
de la ligne de commande (`process.argv[2]`).

Utilisez `fs.createReadStream()` pour connecter (`pipe()`) ce fichier vers
`process.stdout`.

`fs.createReadStream()` prend un chemin de fichier comme argument et renvoie
un flux en lecture sur lequel vous pouvez appeler `.pipe()`.  Voici un flux
en lecture qui est connecté vers `process.stderr` :

    var fs = require('fs');
    fs.createReadStream('data.txt').pipe(process.stderr);

Votre programme sera globalement le même, mais au lieu de `'data.txt'`, il
utilisera le chemin passé dans `process.argv[2]`, et vous devriez connecter
ça vers stdout, pas stderr.
