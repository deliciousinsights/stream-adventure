Au lieu de transformer chaque ligne, comme dans l’exemple précédent,
"ENTREE SORTIE", pour cet exercice vous allez convertir les lignes paires
en majuscules, et les impaires en minuscules.  On considère que la première
ligne est impaire.  Par exemple, sur la base de l’entrée suivante :

    Un
    Deux
    Trois
    Quatre

Votre programme devrait afficher

    un
    DEUX
    trois
    QUATRE

Vous pouvez utiliser le module `split` pour découper l’entrée sur la base
des sauts de ligne.  Par exemple :

    var split = require('split');
    process.stdin
        .pipe(split())
        .pipe(through(function (line) {
            console.dir(line.toString());
        }))

Ce code va bufferiser l’entrée et la découper à la volée sur base des retours
chariots, avant de vous transmettre un bloc par ligne.  Par exemple, pour le
fichier `split.js` ci-dessus, nous obtiendrons des événements distincts pour
chaque ligne même si les données arrivent probablement d’un bloc à l’origine :

    $ echo -e 'un\ndeux\ntrois' | node split.js
    'un'
    'deux'
    'trois'

Votre propre programme devrait utiliser `split` de cette façon, mais il vous
faudra transformer l’entrée et la connecter à la sortie (`process.stdout`).

Assurez-vous d’avoir installé les modules `split` et `through` dans le répertoire
de votre programme, par exemple comme ceci :

    npm install split through
