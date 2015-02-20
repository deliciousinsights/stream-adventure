Convertissez les données de `process.stdin` en majuscules, pour les envoyer
ensuite vers `process.stdout`, à l’aide du module `through`.

`through(write, end)` renvoie un flux en lecture/écriture sur la base de deux
fonctions de rappel optionnelles, `write` et `end`.

Quand vous appelez `src.pipe(dst)` avec un flux `dst` qui a été créé par un
appel à `through()`, la fonction de rappel `write(buf)` sera appelée chaque fois
que des données issues de `src` deviennent disponibles.  Et quand `src` aura
fini d’envoyer des données, la fonction de rappel `end()` sera appelée.

Au sein de vos fonctions de rappel, `this` représente le flux de transformation
en cours (celui renvoyé par `through()`), et vous pouvez appeler `this.queue(…)`
pour émettre des données transformées.

Si vous passez une valeur *falsy* à la place d’une fonction de rappel `write`,
une fonction par défaut sera utilisée, qui ré-émet les données sans les modifier :

    function write(buf) { this.queue(buf) }

Sachez par ailleurs que `this.queue(null)` indique que vous avez terminé votre
travail de transformation : la suite de la *pipeline* ne doit plus s’attendre
à du contenu supplémentaire.

La fonction par défaut utilisée pour le rappel `end` est juste :

    function end() { this.queue(null) }

Pour concrétiser un peu tout ça, voici un programme qui déclenche les rappels
`write(buf)` et `end()` en écrivant manuellement dans le flux retourné par
`through()` :

    var through = require('through');
    var tr = through(write, end);
    tr.write('beep\n');
    tr.write('boop\n');
    tr.end();

    function write (buf) { console.dir(buf) }
    function end () { console.log('__END__') }

Au lieu d’appeler `console.dir(buf)`, votre programme devrait naturellement
utiliser `this.queue(…)` dans votre fonction de rappel `write(buf)`, de façon
à émettre les données en majuscules.

N’oubliez pas de bien alimenter votre flux de transformation à partir de
l’entrée standard, et de consommer ses résultats avec la sortie standard, ce
qui devrait ressembler à ça :

    process.stdin.pipe(tr).pipe(process.stdout);

Remarquez pour finir que les blocs que vous recevrez depuis `process.stdin`
sont des `Buffer`s, pas des `String`s.  Vous pouvez appeler `buf.toString()`
sur un `Buffer` pour obtenir le texte, à partir de quoi `.toUpperCase()` est
utilisable.

Assurez-vous d’avoir installé le module nécessaire depuis npm en tapant dans
le répertoire de votre programme la commande suivante :

    npm install through
