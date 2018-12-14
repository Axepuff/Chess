const presets = [
  [
    "@babel/env",
    {
      targets: {
        "ie": "9",
      },
      useBuiltIns: "usage",
    },
  ],
];

module.exports = { presets };