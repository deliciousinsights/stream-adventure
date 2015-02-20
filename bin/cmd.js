#!/usr/bin/env node

var argv = require('optimist').argv;
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var dataDir = path.resolve(
    process.env.HOME || process.env.USERPROFILE,
    '.config/stream-adventure'
);

mkdirp.sync(dataDir);

var exitCode = 0;
process.on('exit', function (code) {
    if (code === 0 && exitCode) process.exit(exitCode);
});

var verify = require('./verify.js');
var order = require('../data/order.json');

if (argv.h || argv.help || argv._[0] === 'help') {
    return fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
}

if (argv._[0] === 'list') {
    order.forEach(function (name) {
        console.log(name);
    });
    return;
}

if (argv._[0] === 'current') {
    var current = getData('current');
    console.log(current);
    return;
}

if (argv._[0] === 'select') {
    return onselect(argv._.slice(1).join(' '));
}

if (argv._[0] === 'print') {
    printProblem(getCurrentProblem());
    return;
}

if (argv._[0] === 'verify' || argv._[0] === 'run') {
    var current = getCurrentProblem();
    var dir = dirFromName(current);
    var setup = require(dir + '/setup.js')({ run: argv._[0] === 'run' });
    setTimeout(function () {
        var a = argv._.slice(1)
            .concat(setup.aArgs || setup.args || [])
        ;
        var b = [ dir + '/solution.js' ]
            .concat(setup.bArgs || setup.args || [])
        ;
        var v = verify(a, b, {
            a: setup.a,
            b: setup.b,
            showStdout: setup.showStdout,
            long: setup.long,
            run: argv._[0] === 'run'
        });
        v.on('pass', onpass);
        v.on('fail', onfail);

        if (setup.stdin) {
            setup.stdin.pipe(v);
            setup.stdin.resume();
        }

        if (setup.a && setup.a.resume) setup.a.resume();
        if (setup.b && setup.b.resume) setup.b.resume();
    }, setup.wait || 1);

    function onpass () {
        console.log('# RÉUSSI');
        console.log('\Votre solution pour ' + current + ' fonctionne !');
        console.log(
            '\nVoici la solution officielle, si vous voulez comparer :\n'
        );
        var src = fs.readFileSync(path.join(dir, 'solution.js'), 'utf8');
        src.split('\n').forEach(function (line) {
            console.log('    ' + line);
        });

        updateData('completed', function (xs) {
            if (!xs) xs = [];
            var ix = xs.indexOf(current);
            return ix >= 0 ? xs : xs.concat(current);
        });

        var completed = getData('completed') || [];

        var remaining = order.length - completed.length;
        if (remaining === 0) {
            console.log("Vous avez terminé tous les défis ! Bravo !\n");
        }
        else {
            console.log('Il vous reste ' + remaining + ' défi(s).');
            console.log('Tapez `stream-adventure` pour afficher le menu.\n');
        }

        if (setup.close) setup.close();
    }

    function onfail () {
        if (setup.close) setup.close();

        console.log('# RATÉ');
        console.log(
            "\nVotre solution ne fonctionne pas."
            + '\nRéessayez, our exécutez `stream-adventure run program.js`'
            + ' pour voir ce qu’affiche votre solution.'
        );
        exitCode = 1;
    }
}
else {
    var opts = {
        completed: getData('completed') || []
    };

    if (argv.b || argv.bg){
        opts.bg = argv.b || argv.bg;
    }

    if (argv.f || argv.fg){
        opts.fg = argv.f || argv.fg;
    }

    var showMenu = require('./menu.js');
    var menu = showMenu(opts);

    menu.on('select', onselect);
    menu.on('exit', function () {
        console.log();
        process.exit(0);
    });
}

function getCurrentProblem() {
    var current = getData('current');
    if (!current) {
        console.error('ERREUR : Aucun exercice en cours.  Choisissez-en un dans le menu.'
        );
        return process.exit(1);
    }
    return current;
}

function printProblem(name) {
    console.log('\n  ' + Array(70).join('#'));
    console.log(center('~~  ' + name + '  ~~'));
    console.log('  ' + Array(70).join('#') + '\n');

    var dir = dirFromName(name);
    var file = path.resolve(dir, 'problem.txt');
    updateData('current', function (c) { return name });
    var rs = fs.createReadStream(file);
    rs.on('close', function () {
        console.log(
                '\nPour vérifier votre programme, tapez : '
                + '`stream-adventure verify program.js`.\n'
        );
    });
    rs.pipe(process.stdout);
}

function onselect (name) {
    printProblem(name);
//    console.log('\n  ' + Array(70).join('#'));
//    console.log(center('~~  ' + name + '  ~~'));
//    console.log('  ' + Array(70).join('#') + '\n');
//
//    var dir = dirFromName(name);
//    var file = path.resolve(dir, 'problem.txt');
//    updateData('current', function (c) { return name });
//    var rs = fs.createReadStream(file);
//    rs.on('close', function () {
//        console.log(
//            '\nTo verify your program, run: '
//            + '`stream-adventure verify program.js`.\n'
//        );
//    });
//    rs.pipe(process.stdout);
}

function updateData (name, fn) {
    var json = {};
    try { json = getData(name) }
    catch (e) {}
    var file = path.resolve(dataDir, name + '.json');
    fs.writeFileSync(file, JSON.stringify(fn(json)));
}

function getData (name) {
    var file = path.resolve(dataDir, name + '.json');
    try { return JSON.parse(fs.readFileSync(file, 'utf8')) }
    catch (e) {}
    return null;
}

function dirFromName (name) {
    return path.resolve(__dirname, '../problems/'
        + name.toLowerCase().replace(/\s/g, '_')
    );
}

function center (s) {
    var n = (67 - s.length) / 2;
    return '  ##' + Array(Math.floor(n)).join(' ')
        + s + Array(Math.ceil(n)).join(' ') + '##'
    ;
}
