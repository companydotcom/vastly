module.exports = {
  root: true,
  extends: ["custom"],
  {
    "files": [
      "src/templates/**/*"
    ],
    "rules": { "react/react-in-jsx-scope": "off" }
  },
};
