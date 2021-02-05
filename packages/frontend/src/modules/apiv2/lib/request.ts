import * as errors from './errors';
import { replace } from 'ramda';

function prepareUrl(url: string): string {
  const apiUrl = process.env.REACT_APP_API_URL;

  if (!apiUrl) {
    throw new Error('Missing REACT_APP_API_URL in env.');
  }

  if (url.startsWith('http')) {
    return url;
  }

  return `${replace(/\/$/, '',apiUrl)}/${replace(/^\//, '', url)}`;
}

export default async function request(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const preparedInput = typeof input === 'string' ? prepareUrl(input) : { ...input, url: prepareUrl(input.url) };
  let result;

  try {
    result = await fetch(preparedInput, init);
  } catch (e) {
    throw new errors.InternalServerError();
  }

  switch (result.status) {
    case 400:
      throw new errors.BadRequest(await result.json());
    case 401:
      throw new errors.Unauthorized();
    case 404:
      throw new errors.NotFound();
    case 405:
      throw new errors.ApiError();
  }

  return result;
}
