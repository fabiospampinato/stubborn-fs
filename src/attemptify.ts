
/* MAIN */

const attemptifyAsync = <Args extends unknown[], Return> ( fn: ( ...args: Args ) => Promise<Return>, onError: (( error: unknown ) => undefined) ): (( ...args: Args ) => Promise<Return | undefined>) => {

  return function attemptified ( ...args: Args ): Promise<Return | undefined> {

    return fn.apply ( undefined, args ).catch ( onError );

  };

};

const attemptifySync = <Args extends unknown[], Return> ( fn: ( ...args: Args ) => Return, onError: (( error: unknown ) => undefined) ): (( ...args: Args ) => Return | undefined) => {

  return function attemptified ( ...args: Args ): Return | undefined {

    try {

      return fn.apply ( undefined, args );

    } catch ( error: unknown ) {

      return onError ( error );

    }

  };

};

/* EXPORT */

export {attemptifyAsync, attemptifySync};
