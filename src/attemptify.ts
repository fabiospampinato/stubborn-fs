
/* MAIN */

const attemptifyAsync = <T extends Function> ( fn: T, onError: (( error: NodeJS.ErrnoException ) => void) ): T => {

  return function attemptified () {

    return fn.apply ( undefined, arguments ).catch ( onError );

  } as any;

};

const attemptifySync = <T extends Function> ( fn: T, onError: (( error: NodeJS.ErrnoException ) => void) ): T => {

  return function attemptified () {

    try {

      return fn.apply ( undefined, arguments );

    } catch ( error: any ) {

      return onError ( error );

    }

  } as any;

};

/* EXPORT */

export {attemptifyAsync, attemptifySync};
