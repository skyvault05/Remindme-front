const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://ec2-54-238-154-254.ap-northeast-1.compute.amazonaws.com:8080",
      changeOrigin: true,
    })
  );
  // app.use(
  //   "/api",
  //   createProxyMiddleware({
  //     target: "http://localhost:8080",
  //     changeOrigin: true,
  //   })
  // );
};
