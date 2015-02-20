Écrivez un module exportant une unique fonction, laquelle renvoie un flux
duplex créé par le module `stream-combiner`.  Voici un morceau de code pour
démarrer :

    var combine = require('stream-combiner')

    module.exports = function () {
        return combine(
            // 1. Lire du JSON ligne à ligne,
            // 2. Grouper les livres par genre,
            // 3. Compresser le tout en GZip
        )
    }

En fait, votre flux va représenter un segment de *pipeline* réutilisable.
On y écrira des fragments JSON, un par ligne, qui représentent une liste
de sous-genres et d’ouvrages de Science-Fiction.  Tous les livres qui
apparaissent après une ligne de genre appartiennent à ce genre, jusqu’à
la prochaine ligne qui changera le genre actif.

    {"type":"genre","name":"cyberpunk"}
    {"type":"book","name":"Neuromancer"}
    {"type":"book","name":"Snow Crash"}
    {"type":"genre","name":"space opera"}
    {"type":"book","name":"A Deepness in the Sky"}
    {"type":"book","name":"Void"}

Votre programme doit générer une liste de lignes JSON, une par genre,
chacune avec une propriété `name` pour le nom du genre et une propriété
`books` qui est un tableau des titres de livres associés.  Pour les
données ci-dessus, ça donnerait donc ceci :

    {"name":"cyberpunk","books":["Neuromancer","Snow Crash"]}
    {"name":"space opera","books":["A Deepness in the SKy","Void"]}

Votre flux doit par ailleurs compresser le résultat à l’aide de l’API
noyau `zlib.createGzip()`.

## Conseils

Le module `stream-combiner` crée une *pipeline* à partir d’une liste de flux,
et renvoie un flux duplex unique qui expose en écriture le premier flux
de la série, et en lecture le dernier.  C’est un peu comme le module
`duplexer`, mais pour un nombre quelconque de flux.  Contrairement au
module `duplexer`, chaque flux est connecté au suivant.  Par exemple :

    var combine = require('stream-combiner');
    var stream = combine(a, b, c, d);

…va, en interne, faire `a.pipe(b).pipe(c).pipe(d)`, mais le flux renvoyé
par `combine()` a comme côté en écriture le flux `a`, et comme côté en lecture
le flux `d`.

Comme pour l’aventure LIGNES qu’on a faite plus tôt, le module `split` va
pas mal vous aider ici.  On peut en insérer un directement dans la pipeline
du combinateur.

Assurez-vous d’avoir installé les modules `split` et `stream-combiner` dans
le répertoire de votre programme, par exemple comme ceci :

    npm install split stream-combiner
