const exploreFolder = require("../../server.js");
const ROOT_FOLDER_ID = "1JRtjXYtyZNlrpzJwNSR3j4ZLNeViyBh2";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
};

exports.handler = async function (event, context) {
  const files = await exploreFolder(ROOT_FOLDER_ID);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ files }),
  };
};
