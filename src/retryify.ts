
/* IMPORT */

import RetryfyQueue from './retryify_queue';

/* MAIN */

const retryifyAsync = <Args extends unknown[], Return> ( fn: ( ...args: Args ) => Promise<Return>, isRetriableError: (( error: unknown ) => boolean | void) ): (( timeout: number ) => ( ...args: Args ) => Promise<Return>) => {

  return function retrified ( timestamp: number ) {

    return function attempt ( ...args: Args ): Promise<Return> {

      return RetryfyQueue.schedule ().then ( cleanup => {

        const onResolve = ( result: Return ): Return => {

          cleanup ();

          return result;

        };

        const onReject = ( error: unknown ): Promise<Return> => {

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

    };

  };

};

const retryifySync = <Args extends unknown[], Return> ( fn: ( ...args: Args ) => Return, isRetriableError: (( error: unknown ) => boolean | void) ): (( timeout: number ) => ( ...args: Args ) => Return) => {

  return function retrified ( timestamp: number ) {

    return function attempt ( ...args: Args ): Return {

      try {

        return fn.apply ( undefined, args );

      } catch ( error: unknown ) {

        if ( Date.now () > timestamp ) throw error;

        if ( isRetriableError ( error ) ) return attempt.apply ( undefined, args );

        throw error;

      }

    };

  };

};

/* EXPORT */

export {retryifyAsync, retryifySync};
