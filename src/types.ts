/**
 * Input to be transformed.
 */

export type Input = string | number;

/**
 * Represent's 2 numbers describing the start and end of a style.
 */

export type CodeGroup = [ number, number ];

/**
 * Represent's a map of codegroups, numbers that describe the start and end of a style.
 */

export type CodeGroupMap<T> = { [ K in keyof T ]: CodeGroup; };

/**
 * Represent's a string transformer.
 */

export type Transformer = ( input: Input ) => string;

/**
 * Describes an object that is used to transform an input.
 */

export type TransformData = {

    name: string;
    code: CodeGroup;

    open: string;
    close: string;
    rgx: RegExp;

};

/**
 * Describes multiple styles that are used to transform input.
 */

export type StyleDefinitions = { [ x: string ]: TransformData };

/**
 * Represent's a function that can either transform a string, or returns chainable transformers.
 */

export type ChainTransformer<T> = {

    /**
     * Transform a string.
     */

    ( input: Input ): string;

    /**
     * Chainable string transformers.
     */

    (): ChainableTransformer<T>;

};

/**
 * Represent's a map of chainable transformers.
 */

export type ChainTransformerMap<T> = {

    [ K in keyof T ]: ChainTransformer<T>;

};

/**
 * Represent's a chainable transformer that also doubles as a map of chainable transformers.
 */

export type ChainableTransformer<T> = ChainTransformer<T> & ChainTransformerMap<T>;
