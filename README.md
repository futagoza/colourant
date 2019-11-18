[![GitHub Actions](https://github.com/futagoza/colourant/workflows/ci/badge.svg)](https://github.com/futagoza/colourant/actions?workflow=ci)
[![codecov](https://codecov.io/gh/futagoza/colourant/branch/master/graph/badge.svg)](https://codecov.io/gh/futagoza/colourant)
[![release](https://img.shields.io/npm/v/colourant.svg)](https://www.npmjs.com/package/colourant)
[![dependencies](https://img.shields.io/david/futagoza/colourant.svg)](https://david-dm.org/futagoza/colourant)
[![license](https://img.shields.io/badge/license-mit-blue.svg)](https://opensource.org/licenses/MIT)

> Node 8+ is required. Only LTS versions of Node are tested.

A Node.js library for formatting terminal text using ANSI

## features

* No dependencies
* Super [performant](#performance)
* Supports [nested](#nested-methods) & [chained](#chained-methods) colours
* No `String.prototype` modifications
* Conditional [colour support](#conditional-support)
* Familiar [API](#api)
* Fully written in [TypeScript](#typescript)

## install

```
$ npm install --save colourant
```

## usage

```js
const { blue, bold, red, white } = require( "colourant" );

// basic usage
red( "red text" );

// chained methods
blue().bold().underline( "howdy partner" );

// nested methods
bold(`${ white().bgRed( "[ERROR]" ) } ${ red().italic( "Something happened" ) }`);
```

#### Chained Methods

```js
const { bold, green } = require( "colourant" );

console.log( bold().red( "this is a bold red message" ) );
console.log( bold().italic( "this is a bold italicized message" ) );
console.log( bold().yellow().bgRed().italic( "this is a bold yellow italicized message" ) );
console.log( green().bold().underline( "this is a bold green underlined message" ) );
```

<img src="screenshots/chained-methods.png" width="300" />

#### Nested Methods

```js
const { cyan, red, yellow } = require( "colourant" );

console.log( yellow( `foo ${ red().bold( "red" ) } bar ${ cyan( "cyan" ) } baz` ) );
console.log( yellow( "foo " + red().bold( "red" ) + " bar " + cyan( "cyan" ) + " baz" ) );
```

<img src="screenshots/nested-methods.png" width="300" />

#### Conditional Support

Toggle colour support as needed; `colourant` includes simple auto-detection which may not cover all cases.

```js
const colourant = require( "colourant" );

// manually enable
colourant.enable();

// manually disable
colourant.disable();

// or use another library to detect support
colourant.enabled = require( "color-support" ).level;

console.log( colourant.red( "I will only be coloured red if `colourant.enabled` is true" ) );
```

## api

#### Built-in Styles

Built-in `colourant` styles return a `String` when invoked with input; otherwise chaining is expected.

> It's up to the developer to pass the output to destinations like `console.log`, `process.stdout.write`, etc.

The methods below are grouped by type for legibility purposes only. They each can be [chained](#chained-methods) or [nested](#nested-methods) with one another.

***Colours:***
> black &mdash; red &mdash; green &mdash; yellow &mdash; blue &mdash; magenta &mdash; cyan &mdash; white &mdash; gray &mdash; grey

***Backgrounds:***
> bgBlack &mdash; bgRed &mdash; bgGreen &mdash; bgYellow &mdash; bgBlue &mdash; bgMagenta &mdash; bgCyan &mdash; bgWhite

***Modifiers:***
> reset &mdash; bold &mdash; dim &mdash; italic* &mdash; underline &mdash; inverse &mdash; hidden &mdash; strikethrough*

<sup>* <em>Not widely supported</em></sup>

#### Utility Methods

As well as supporting the [kleur 3](https://github.com/lukeed/kleur) API, _colourant_ also provides:

```js
/*
    `codegroup` refer's to an array containing the start and end codes
    `codemap` refer's to a map of codegroups
*/

const colourant = require( "colourant" );

// Build a custom styled string transformer (stacked, alternative to chain)
colourant( ...codegroups )

// Build a non-chainable string transformer
colourant.from( number, number )
colourant.from( codegroup )

// Build a chainable string transformer
colourant.chain( codemap )

// Build and assign chainable string transformers
colourant.assign( target, codemap )

// Map of default styles
colourant.codes

// Build ANSI string for the given number
colourant.ANSI( number )

// Returns a grey string
colourant.time( string )

// Returns a white string
colourant.info( string )

// Returns a yellow string
colourant.warning( string )

// Returns a red string
colourant.error( string )
```

## benchmarks

> Using Node v12.6.0 on a laptop powered by an AMD A10-4600M APU & 6GB RAM

#### Load time

```
chalk       :: 57.240ms
kleur       ::  3.389ms
ansi-colors ::  8.243ms
colourant   :: 13.433ms
```

#### Performance

```
# All Colors
  ansi-colors  x  56,395 ops/sec ±2.34% (76 runs sampled)
  chalk        x   3,166 ops/sec ±3.88% (69 runs sampled)
  kleur        x 208,322 ops/sec ±2.36% (76 runs sampled)
  colourant    x 264,908 ops/sec ±1.39% (78 runs sampled)

# Stacked colors
  ansi-colors  x  6,152 ops/sec ±2.69% (70 runs sampled)
  chalk        x    637 ops/sec ±4.34% (68 runs sampled)
  kleur        x 22,137 ops/sec ±2.21% (77 runs sampled)
  colourant    x 77,264 ops/sec ±1.46% (78 runs sampled)

# Nested colors
  ansi-colors  x 17,563 ops/sec ±1.48% (82 runs sampled)
  chalk        x  1,454 ops/sec ±2.71% (70 runs sampled)
  kleur        x 54,422 ops/sec ±2.33% (76 runs sampled)
  colourant    x 57,182 ops/sec ±1.66% (78 runs sampled)
```

## credits

This project is based on [kleur 3](https://github.com/lukeed/kleur), and contains content originally from it:

- Some source code, like [`colourant/out/codes`](https://github.com/futagoza/colourant/blob/master/src/codes.ts)
- The [screenshots](https://github.com/futagoza/colourant/tree/master/screenshots) used in this README
- This README is a rewrite of [kleur's readme.md](https://github.com/lukeed/kleur/blob/master/readme.md)

## license

Copyright (c) 2019 [Futago-za Ryuu](http://github.com/futagoza)<br>
The MIT License, [http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT)
