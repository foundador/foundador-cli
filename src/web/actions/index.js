import {
  DEFAULT_ACTION
} from './types';

export function defaultAction(value) {
  return {
    type : DEFAULT_ACTION,
    value
  }
};
