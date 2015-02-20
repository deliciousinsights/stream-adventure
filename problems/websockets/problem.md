Pour cette nouvelle aventure, écrivez du code conçu pour le navigateur, qui
utilisera le module `websocket-stream` pour afficher le texte `"hello\n"`.

Votre fichier de solution sera compilé avec **browserify**, et le script de
vérification vous demandera d’ouvrir `http://localhost:8000` dans votre
navigateur pour valider votre solution.

Pour ouvrir un flux `websocket-stream` sur `localhost:8000`, vous aurez
juste besoin d’écrire :

    var ws = require('websocket-stream');
    var stream = ws('ws://localhost:8000');

Ensuite, écrivez la chaîne `"hello\n"` dans le flux, et fermez-le.

La documentation du module `websocket-stream` vous donne davantage
d’information si vous souhaitez savoir, par exemple, comment on écrirait
la partie serveur :

  https://github.com/maxogden/websocket-stream

Assurez-vous d’avoir installé le module `websocket-stream` dans le répertoire
de votre programme, par exemple comme ceci :

    npm install websocket-stream
