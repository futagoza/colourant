"use strict";

const { Suite } = require( "benchmark" );
const cursor = require( "ansi" )( process.stdout );
const color = require( "ansi-colors" );
const colorette = require( "colorette" );
const chalk = require( "chalk" );
const kleur = require( "kleur" );
const colourant = require( ".." );

const names = [
    "reset",
    "bold",
    "dim",
    "italic",
    "underline",
    "inverse",
    "hidden",
    "strikethrough",
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
    "gray",
    "bgBlack",
    "bgRed",
    "bgGreen",
    "bgYellow",
    "bgBlue",
    "bgMagenta",
    "bgCyan",
    "bgWhite",
];

const cycle = ( e, nl ) => {

    cursor.eraseLine();
    cursor.horizontalAbsolute();
    cursor.write( "  " + e.target );
    if ( nl ) cursor.write( "\n" );

};

function bench( name ) {

    console.log( `\n# ${ name }` );
    const suite = new Suite();
    const res = {
        add( key, fn ) {

            suite.add( key, {
                onCycle: e => cycle( e ),
                onComplete: e => cycle( e, true ),
                fn: fn,
            } );
            return res;

        },
        run: () => suite.run(),
    };
    return res;

}

bench( "All Colors" )
    .add( "ansi-colors", () => {

        names.forEach( name => color[ name ]( "foo" ) );

    } )
    .add( "chalk", () => {

        names.forEach( name => chalk[ name ]( "foo" ) );

    } )
    .add( "kleur", () => {

        names.forEach( name => kleur[ name ]( "foo" ) );

    } )
    .add( "colorette", () => {

        names.forEach( name => colorette[ name ]( "foo" ) );

    } )
    .add( "colourant", () => {

        names.forEach( name => colourant[ name ]( "foo" ) );

    } )
    .run();

bench( "Stacked colors" )
    .add( "ansi-colors", () => {

        names.forEach( name => color[ name ].bold.underline.italic( "foo" ) );

    } )
    .add( "chalk", () => {

        names.forEach( name => chalk[ name ].bold.underline.italic( "foo" ) );

    } )
    .add( "kleur", () => {

        names.forEach( name => kleur[ name ]().bold().underline().italic( "foo" ) );

    } )
    .add( "colourant", () => {

        names.forEach( name => colourant[ name ]().bold().underline().italic( "foo" ) );

    } )
    .run();

bench( "Nested colors" )
    .add( "ansi-colors", () => fixture( color ) )
    .add( "chalk", () => fixture( chalk ) )
    .add( "kleur", () => fixture( kleur ) )
    .add( "colorette", () => fixture( colorette ) )
    .add( "colourant", () => fixture( colourant ) )
    .run();

function fixture( lib ) {

    return lib.italic( `
        white ${ lib.white( "message" ) }
        red ${ lib.red( "message" ) }
        gray ${ lib.gray( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        blue ${ lib.blue( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        green ${ lib.green( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        magenta ${ lib.magenta( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        cyan ${ lib.cyan( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        yellow ${ lib.yellow( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
        red ${ lib.red( "message" ) }
    ` );

}
