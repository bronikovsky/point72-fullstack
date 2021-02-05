import { ApiError } from './errors';
import { SERVER_ERROR } from '../constants';


type UnwrapPromise<S> = S extends Promise<infer U> ? U : S
type Handler<T extends any[], S, U = void> = (...args: T) => Promise<UnwrapPromise<S> | U>

/**
 * Syntactic sugar for silencing {ApiError}
 *
 * @param fn Any async function that throws {ApiError}
 */
export function silent<T extends any[], S extends Promise<any>>(fn: ((...args: T) => S)): Handler<T, S> {
  return async (...args: T): Promise<UnwrapPromise<S> | void> => {
    try {
      return await fn(...args);
    } catch (e) {
      if (!(e instanceof ApiError)) {
        throw e;
      }

      return;
    }
  };
}

/**
 * Converts errors to {string}
 *
 * @param fn Any async function that throws {ApiError}
 */
export function handleError<T extends any[], S extends Promise<any>>(fn: ((...args: T) => S)): Handler<T, S, string | undefined> {
  return async (...args: T): Promise<UnwrapPromise<S> | string | undefined> => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e instanceof ApiError) {
        return e.toString();
      }

      return SERVER_ERROR;
    }
  };
}
