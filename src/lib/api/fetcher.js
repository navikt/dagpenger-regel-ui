function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export const fetcher = (uri, options) =>
  fetch(uri, options)
    .then(handleErrors)
    .then((res) => res.json());
