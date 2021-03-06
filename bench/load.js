"use strict";

console.time( "chalk" );
const chalk = require( "chalk" );
console.timeEnd( "chalk" );

console.time( "kleur" );
const kleur = require( "kleur" );
console.timeEnd( "kleur" );

console.time( "ansi-colors" );
const color = require( "ansi-colors" );
console.timeEnd( "ansi-colors" );

console.time( "colorette" );
const colorette = require( "colorette" );
console.timeEnd( "colorette" );

console.time( "colourant" );
const colourant = require( ".." );
console.timeEnd( "colourant" );
