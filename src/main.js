// @ts-check

require('dotenv').config();
const http = require('http');
const { createApi } = require('unsplash-js');
const { default: fetch } = require('node-fetch');
const sharp = require('sharp');

const accessKey = process.env.UNSPLASH_API_ACCESS_KEY;
if (!accessKey) throw new Error();

const unsplash = createApi({ accessKey, fetch });

/**
 * @typedef ImgInfo
 * @property {string} desc
 * @property {string} url
 */

/**
 * @param {string} query
 * @returns
 */
async function searchImage(query) {
  const result = await unsplash.search.getPhotos({ query: 'programmer' });
  if (!result.response) throw new Error('Failed to search image.');

  const image = result.response.results[0];
  if (!image) throw new Error('No image found.');

  /** @type {ImgInfo} */
  const imgInfo = {
    desc: image.description || image.alt_description || 'no desc',
    url: image.urls.regular,
  };

  return imgInfo;
}

const server = http.createServer((req, res) => {
  async function main() {
    const result = await searchImage('mountain');
    const resp = await fetch(result.url);
    resp.body.pipe(res);
  }
  main();
});

const PORT = 5000;

server.listen(PORT, () => console.log('The server is listening at port', PORT));
