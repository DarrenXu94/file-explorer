const { google } = require("googleapis");
require("dotenv").config();

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.NETLIFY_GOOGLE_CLIENT_EMAIL,
    private_key: process.env.NETLIFY_GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

async function readSheet(id) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: "Sheet1!A1:D5",
  });

  return parseExerciseData(res.data.values);
}

function parseExerciseData(data) {
  const header = data[0];
  const weekHeaders = header.slice(2); // ['Week 1', 'Week 2']

  return data.slice(1).map((row) => {
    const name = row[0];
    const sets = row[1];

    const sessions = weekHeaders
      .map((weekName, i) => {
        const value = row[i + 2];

        return {
          name: weekName,
          weight: !value || value.trim() === "" ? "No data" : value,
        };
      })
      .filter((session) => session !== null);

    return {
      name,
      sets,
      sessions,
    };
  });
}

module.exports = readSheet;
