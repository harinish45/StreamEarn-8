import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

type Events = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// We need to declare the `emit` and `on` methods with the correct types
declare interface ErrorEventEmitter {
  emit<T extends keyof Events>(event: T, ...args: Parameters<Events[T]>): boolean;
  on<T extends keyof Events>(event: T, listener: Events[T]): this;
}

class ErrorEventEmitter extends EventEmitter {}

export const errorEmitter = new ErrorEventEmitter();
