const { google } = require("googleapis");
require("dotenv").config();

// Load your service account key JSON
const auth = new google.auth.GoogleAuth({
  // keyFile: "./service-account-key.json",
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const ROOT_FOLDER_ID = "1JRtjXYtyZNlrpzJwNSR3j4ZLNeViyBh2";

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

  for (const file of files.data.files) {
    const fullPath = `${pathPrefix}/${file.name}`;
    if (file.mimeType === "application/vnd.google-apps.folder") {
      return {
        id: file.id,
        name: file.name,
        items: await exploreFolder(file.id, fullPath), // Recursively explore subfolder
      };
    } else {
      return {
        id: file.id,
        name: file.name,
      };
    }
  }
}

// exploreFolder(ROOT_FOLDER_ID).catch(console.error);

// const items = exploreFolder(ROOT_FOLDER_ID)
//   .then((files) => {
//     console.log("Files in root folder:", files);
//   })
//   .catch((error) => {
//     console.error("Error exploring folder:", error);
//   });

module.exports = exploreFolder;
