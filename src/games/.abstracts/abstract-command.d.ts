export interface GameCommand<T extends string> {
    /** The type of the command. */
    type: T;
}

export interface ErrorCommand<E extends string> extends GameCommand<'error'> {
    /** The type of the error. */
    errorType: E;
}