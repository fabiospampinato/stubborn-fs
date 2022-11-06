
/* IMPORT */

import RetryfyQueue from './retryify_queue';

/* MAIN */

const retryifyAsync = <T extends Function> ( fn: T, isRetriableError: (( error: NodeJS.ErrnoException ) => boolean | void) ): (( timeout: number ) => T) => {

  return function retrified ( timestamp: number ) {

    return function attempt ( ...args ) {

      return RetryfyQueue.schedule ().then ( cleanup => {

        const onResolve = result => {

          cleanup ();

          return result;

        };

        const onReject = error => {

          cleanup ();

          if ( Date.now () >= timestamp ) throw error;

          if ( isRetriableError ( error ) ) {

            const delay = Math.round ( 100 * Math.random () );
            const delayPromise = new Promise ( resolve => setTimeout ( resolve, delay ) );

            return delayPromise.then ( () => attempt.apply ( undefined, args ) );

          }

          throw error;

        };

        return fn.apply ( undefined, args ).then ( onResolve, onReject );

      });

    } as any;

  };

};

const retryifySync = <T extends Function> ( fn: T, isRetriableError: (( error: NodeJS.ErrnoException ) => boolean | void) ): (( timeout: number ) => T) => {

  return function retrified ( timestamp: number ) {

    return function attempt ( ...args ) {

      try {

        return fn.apply ( undefined, args );

      } catch ( error: any ) {

        if ( Date.now () > timestamp ) throw error;

        if ( isRetriableError ( error ) ) return attempt.apply ( undefined, args );

        throw error;

      }

    } as any;

  };

};

/* EXPORT */

export {retryifyAsync, retryifySync};
