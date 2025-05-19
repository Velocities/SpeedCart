module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          shared: "./Frontend/Shared/src",
        },
      },
    ],
  ],
};
