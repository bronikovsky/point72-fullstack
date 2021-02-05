import { path, replace } from 'ramda';
import pl from '../pl.json';

export default function msg(key: string | string[], variables?: { [key: string]: string | number }): string {
  let translation: string | undefined = '';
  const keys = typeof key == 'string' ? [key] : key;

  for (let i = 0; i < keys.length && !translation; i++) {
    translation = path(keys[i].split('.'), pl);
  }

  if (!translation) {
    throw new Error(`Missing translation for key ${key}`);
  }

  if (variables) {
    Object.keys(variables).forEach(k => {
      translation = replace(`{${k}}`, variables[k].toString(), translation as string);
    });
  }

  return translation as string;
}

