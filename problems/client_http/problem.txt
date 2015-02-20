Envoyez une requête HTTP POST sur `http://localhost:8000`, et connectez-y
`process.stdin` en entrée, et `process.stdout` en sortie.

Voici un exemple qui utilise le module `request` pour créer une requête GET
et connecter sa réponse vers la sortie standard :

    var request = require('request');
    request('http://beep.boop:80/').pipe(process.stdout);

Pour faire une requête POST, appelez simplement `request.post()` au lieu
de `request()` tout court :

    var request = require('request');
    var r = request.post('http://beep.boop:80/');

L’objet `r` que vous obtenez en réponse à `request.post()` est un flux en
lecture/écriture, vous pouvez donc connecter un flux en lecture vers lui
(`src.pipe(r)`) tout comme un flux en écriture depuis lui (`r.pipe(dst)`).

Vous pouvez même faire les deux d’un coup : `src.pipe(r).pipe(dst)`.

## Conseil

Pour votre code, `src` sera `process.stdin` et `dst` sera `process.stdout`.

Assurez-vous d’avoir installé le module `request` dans le répertoire de
votre programme, par exemple comme ceci :

    npm install request
