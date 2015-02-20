Écrivez un module qui exporte une fonction, laquelle invoque un processus
décrit par un premier argument `cmd` (texte) et un deuxième argument `args`
(tableau), et renvoie un flux duplex qui connecte à l’entrée standard
et à la sortie standard du processus ainsi invoqué :

    var spawn = require('child_process').spawn;

    module.exports = function spawnAndStream(cmd, args) {
        // invoquez le processus et renvoyez un flux unique
        // qui vous fournisse l’accès à l’entrée et la sortie standard
        // du processus
    };

Il existe un module très pratique pour faire ça : `duplexer`.  Ce module
exporte une unique fonction, `duplexer(writable, readable)`, qui combine
les deux flux qu’on lui passe en un seul flux duplex (c’est-à-dire en
lecture et en écriture).

Si vous utilisez `duplexer`, assurez-vous de l’installer dans le répertoire
de votre solution, par exemple comme ceci :

    npm install duplexer

Vous trouverez la documentation de `spawn()` ici :

    http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
