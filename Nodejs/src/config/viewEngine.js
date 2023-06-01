import express from "express";

let configViewEngine = (app) => {
    app.use(express.static("./src/public")) //để phía client đc truy cập vào file nào
    app.set("view engine", "ejs") //ejs cho phép code logist trong HTML
    app.set("views", "./src/views") //set đg link để chạy viewEngine này
}

module.exports = configViewEngine; // lúc nào cũng phải có export ra để mới lấy đc function ra