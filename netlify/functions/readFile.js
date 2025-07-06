const readFile = require("../../readFile.js");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
};

exports.handler = async function (event, context) {
  const id = event.queryStringParameters.id;

  const data = await readFile(id);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ data }),
  };
};
