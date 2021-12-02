require('dotenv').config()

module.exports = {
  "packagerConfig": {
    "icon": "src/icons/assistant.ico",
    "name": "Sheet Database Manager",
    "authors": "AC Australia - BW",
    "description": "Handle Updates and Checks of the Sheet DB",
    "asar": true,
    "extraResource": []
  },
  "makers": [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "name": "Sheet-Database-Manager",
        "authors": "AC Australia - BW",
        "icon": "src/pages/assistant.ico",
        "description": "Handle Updates and Checks of the Sheet DB"
      }
    }
  ],
  "publishers": [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "AC-Australia",
          name: "sheetdb"
        },
        authToken: process.env.GITHUB_TOKEN,
      }
    }
  ]
}