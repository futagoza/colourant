import codes from "./codes";
import {

    ChainableTransformer,
    ChainTransformerMap,
    CodeGroup,
    CodeGroupMap,
    Input,
    StyleDefinitions,
    TransformData,
    Transformer,

} from "./types";

/* ============================== @private ============================== */

let NO_COLOR = ( () => {

    const { env, stdout } = process;

    return "NO_COLOR" in env
        || "NODE_DISABLE_COLORS" in env
        || env.FORCE_COLOR === "0"
        || stdout == null
        || stdout.isTTY !== true
        || env.TERM == null
        || env.TERM === "dumb";

} )();

function AssignChainableTransformers( $: unknown, styles: StyleDefinitions, cache: TransformData[] ) {

    function __assign( name: string ) {

        let o: ChainableTransformer<unknown>;

        function get() {

            if ( ! o ) o = BuildChainableTransformer<unknown>( styles, ...cache, styles[ name ] );

            return o;

        }

        Object.defineProperty( $, name, { configurable: true, get } );

    }
    Object.keys( styles ).forEach( __assign );

}

function EscapeInput( input: Input, cache: TransformData[] ) {

    let result = input + "";

    function __escape( data: TransformData ) {

        if ( result.includes( data.close ) ) result = result.replace( data.rgx, data.close + data.open );

    }
    cache.forEach( __escape );

    return result;

}

function BuildChainableTransformer<T>( styles: StyleDefinitions, ...cache: TransformData[] ) {

    let PREFACE = "";
    let POSTFIX = "";

    function __prepost( data: TransformData ) {

        PREFACE = data.open + PREFACE;
        POSTFIX += data.close;

    }
    cache.forEach( __prepost );

    /* istanbul ignore next */
    const $ = cache.length === 0
        ? function $( input?: Input ) {

            if ( input == null ) return $;

            return `${ input }`;

        }
        : function $( input?: Input ) {

            if ( input == null ) return $;

            if ( NO_COLOR ) return `${ input }`;

            return PREFACE + EscapeInput( input, cache ) + POSTFIX;

        };

    AssignChainableTransformers( $, styles, cache );

    return $ as ChainableTransformer<T>;

}

function BuildStyleDefinition( name: string, code: CodeGroup ) {

    return {

        name,
        code,

        open: colourant.ANSI( code[ 0 ] ),
        close: colourant.ANSI( code[ 1 ] ),
        rgx: new RegExp( `\\x1b\\[${ code[ 1 ] }m`, "g" ),

    };

}

/* ============================== @public ============================== */

/**
 * Build a custom styled string transformer.
 */

export function colourant( ...codegroups: CodeGroup[] ): Transformer {

    const count = codegroups.length;

    if ( count === 0 ) return ( input: Input ) => `${ input }`;
    if ( count === 1 ) return colourant.from( codegroups[ 0 ] );

    let PREFACE = "";
    let POSTFIX = "";
    const cache = [] as TransformData[];

    function __cache( codegroup: CodeGroup ) {

        const data = BuildStyleDefinition( codegroup.join( "-" ), codegroup );

        PREFACE = data.open + PREFACE;
        POSTFIX += data.close;

        cache[ cache.length ] = data;

    }
    codegroups.forEach( __cache );

    return ( input: Input ) => {

        if ( NO_COLOR ) return `${ input }`;

        return PREFACE + EscapeInput( input, cache ) + POSTFIX;

    };

}

/**
 * Default style codes used by `colourant`
 */

colourant.codes = codes;

/**
 * When this returns `false`, it means _colourant_ is not appling transform's to any strings.
 */

colourant.enabled = () => NO_COLOR === false;

/**
 * Ensure's that transformer's from `colourant` _apply thier transform's_.
 */

colourant.enable = () => {

    NO_COLOR = false;

    return colourant;

};

/**
 * Ensure's that transformer's from `colourant` _don't apply thier transform's_.
 */

colourant.disable = () => {

    NO_COLOR = true;

    return colourant;

};

/**
 * Builds the ANSI string for the given code.
 */

colourant.ANSI = ( x: number ) => `\x1b[${ x }m`;

/**
 * Create's a non-chainable string transformer from a codegroup.
 */

colourant.from = ( ( start: number | CodeGroup, end: number ) => {

    const code = typeof start === "number" ? [ start, end ] : start;

    const data = BuildStyleDefinition( code.join( ", " ), code as CodeGroup );

    return function transform( input: Input ) {

        if ( NO_COLOR ) return `${ input }`;

        if ( typeof input === "string" && input.includes( data.close ) )

            input = input.replace( data.rgx, data.close + data.open );

        return data.open + input + data.close;

    };

} ) as {

    /**
     * Create's a string transformer from the style's `start` and `end` numbers
     */

    ( start: number, end: number ): Transformer;

    /**
     * Create's a string transformer from a codegroup (e.g. `[start, end]`)
     */

    ( codegroup: CodeGroup ): Transformer;

};

/**
 * Simple, non-chainable string transformer to color a string representaion of a date or time.
 *
 * Default color: __gray__ / __grey__
 */

colourant.time = colourant.from( 90, 39 );

/**
 * Simple, non-chainable string transformer to color _informative_ text.
 *
 * Default color: __white__
 */

colourant.info = colourant.from( 37, 39 );

/**
 * Simple, non-chainable string transformer to color text that conveys a _warning_ to the end user.
 *
 * Default color: __yellow__
 */

colourant.warning = colourant.from( 33, 39 );

/**
 * Simple, non-chainable string transformer to color text that conveys an _error_ has accured.
 *
 * Default color: __red__
 */

colourant.error = colourant.from( 31, 39 );

/**
 * Build a chainable string transformer.
 */

colourant.chain = <T>( codemap: CodeGroupMap<T> ) => {

    const styles = {} as StyleDefinitions;

    function __build( name: string ) {

        styles[ name ] = BuildStyleDefinition( name, codemap[ name ] );

    }
    Object.keys( codemap ).forEach( __build );

    return BuildChainableTransformer<T>( styles );

};

/**
 * Build and assign chainable string transformers for `target`.
 */

colourant.assign = <T, M>( target: T, codemap: CodeGroupMap<M> ) => {

    const styles = {} as StyleDefinitions;

    function __build( name: string ) {

        styles[ name ] = BuildStyleDefinition( name, codemap[ name ] );

    }

    function __assign( name: string ) {

        target[ name ] = BuildChainableTransformer<unknown>( styles, styles[ name ] );

    }

    const keys = Object.keys( codemap );

    keys.forEach( __build );
    keys.forEach( __assign );

    return target as T & ChainTransformerMap<M>;

};

/* ============================== @default-export ============================== */

export * from "./types";

/**
 * A Node.js library for formatting terminal text using ANSI.
 */

export default colourant.assign( colourant, codes );
