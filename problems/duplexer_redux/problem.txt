Dans cet exercice, vous allez écrire un module exportant une fonction qui
reçoit un unique argument, `counter`, lequel est un flux en lecture :

    module.exports = function (counter) {
      // Votre code ici
    };

Renvoyez un flux duplex dont `counter` serait la partie lecture.  Le
flux que vous aurez renvoyé recera en écriture des objets dotés d’un champ
`country` textuel à 2 caractères, comme ceux-ci :

    {"short":"OH","name":"Ohio","country":"US"}
    {"name":"West Lothian","country":"GB","region":"Scotland"}
    {"short":"NSW","name":"New South Wales","country":"AU"}

Créez un objet qui garde le compte de tous les pays en entrée.  Une fois que
plus aucun objet n‘arrive, appelez `counter.setCounts()` avec votre objet
de compteurs en argument.

Les modules `duplexer` et `through` peuvent considérablement vous aider.

Si vous les utilisez, assurez-vous de les installer dans le répertoire
de votre solution, par exemple comme ceci :

    npm install through duplexer
