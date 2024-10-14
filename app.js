// const path = require("path");
const getMethod = require("./module/getMethod.js");
const postMethod = require("./module/postMethod.js");
const deleteJson = require("./module/deleteJson.js");
const postCheck = require("./module/postCheck.js");

// 문서 형식에 따른 표기
const mimeType = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
};

// url에 따른 파일 경로 결정 함수 객체
const fileUtils = {
  getFilePath: function (url) {
    if (url === "/") {
      return "public/index.html";
    } else {
      return `public${url}`;
    }
  },
  getFileExtension: function (filePath) {
    let ext = path.extname(filePath);
    return ext.toLowerCase();
  },
  getContentType: function (ext) {
    if (mimeType.hasOwnProperty(ext)) {
      return mimeType[ext];
    } else {
      return "text/plain";
    }
  },
};

exports.handler = async (event) => {
  const { httpMethod, path: urlPath } = event;

  if (urlPath === "/favicon.ico") {
    return { statusCode: 204 };
  }

  let filePath = fileUtils.getFilePath(urlPath);
  let ext = fileUtils.getFileExtension(filePath);
  let contentType = fileUtils.getContentType(ext);

  try {
    let response;

    switch (httpMethod) {
      case "GET":
        response = await getMethod(event, filePath, contentType);
        break;
      case "POST":
        if (urlPath === "/check") {
          response = await postCheck(event);
        } else if (urlPath === "/submit") {
          response = await postMethod(event);
        }
        break;
      case "DELETE":
        response = await deleteJson(event);
        break;
      default:
        response = { statusCode: 405, body: "Method Not Allowed" };
    }

    return response;
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
