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

export function audience(app) {
  return `api://${process.env.NAIS_CLUSTER_NAME}.teamdagpenger.${app}/.default`;
}
