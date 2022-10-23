import { Post } from "./model";

const express = require("express");
const server = express();
const typeorm = require("typeorm");
require("dotenv").config();

server.use(express.json());

console.log({
  username: process.env.MYSQLDB_USER,
  password: process.env.MYSQLDB_ROOT_PASSWORD,
  database: process.env.MYSQLDB_DATABASE,
  port: process.env.MYSQLDB_LOCAL_PORT,
});

const dbSource = new typeorm.DataSource({
  type: "mysql",
  username: process.env.MYSQLDB_USER,
  password: process.env.MYSQLDB_ROOT_PASSWORD,
  database: process.env.MYSQLDB_DATABASE,
  port: process.env.MYSQLDB_LOCAL_PORT,
  entities: [Post],
  synchronize: true,
});

dbSource.initialize().then(() => {
  const port = process.env.PORT || 3000;

  server.get("/lists", async (req, res) => {
    const data = await dbSource.getRepository(Post).find();
    return res.json({ data });
  });

  server.post("/create", async (req, res) => {
    const title = req.body.title;
    const data = await dbSource.getRepository(Post).save({ title });
    return res.json({ data });
  });

  server.listen(port, () => {
    console.log(`the server is running at port ${port}`);
  });
}).catch((err) => {
  console.log(err)
});
