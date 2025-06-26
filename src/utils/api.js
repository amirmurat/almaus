export const fetchJson = (file) =>
  fetch(process.env.PUBLIC_URL + '/data/' + file).then(r => r.json());
