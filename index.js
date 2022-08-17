"use strict";

const Fs = require("fs");
const Path = require("path");
const Axios = require("axios");
const Url = require("url");
const { default: axios } = require("axios");

async function downloadImage(url) {
  const path = Path.join(__dirname, ...Url.parse(url).pathname.split("/"));
  const writer = Fs.createWriteStream(path);

  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// downloadImage("http://forkify-api.herokuapp.com/images/pizzaburgera5bd.jpg")

 axios(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${process.argv[2] || 'pizza'}`).then(
  (res) =>
    res.data.data.recipes.forEach((recipe) => downloadImage(recipe.image_url))
); 

