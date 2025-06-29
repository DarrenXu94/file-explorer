const { google } = require("googleapis");
require("dotenv").config();
// const ROOT_FOLDER_ID = "1JRtjXYtyZNlrpzJwNSR3j4ZLNeViyBh2";

// Load your service account key JSON
const auth = new google.auth.GoogleAuth({
  // keyFile: "./service-account-key.json",
  credentials: {
    client_email: process.env.NETLIFY_GOOGLE_CLIENT_EMAIL,
    private_key: process.env.NETLIFY_GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

/**
 * Recursively explores folders in Google Drive.
 * @param {string} folderId - The ID of the root folder.
 * @param {string} pathPrefix - For displaying the folder structure (optional).
 */
async function exploreFolder(folderId, pathPrefix = "") {
  const files = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType)",
  });

  let children = [];

  for (const file of files.data.files) {
    const fullPath = `${pathPrefix}/${file.name}`;
    if (file.mimeType === "application/vnd.google-apps.folder") {
      // If it's a folder, recursively explore it
      children.push({
        id: file.id,
        name: file.name,
        items: await exploreFolder(file.id, fullPath), // Recursively explore subfolder
      });
    } else {
      // If it's a file, just add it to the list
      children.push({
        id: file.id,
        name: file.name,
      });
    }
  }

  return children;
}

// const items = exploreFolder(ROOT_FOLDER_ID)
//   .then((files) => {
//     console.log("Files in root folder:", files);
//   })
//   .catch((error) => {
//     console.error("Error exploring folder:", error);
//   });

module.exports = exploreFolder;
