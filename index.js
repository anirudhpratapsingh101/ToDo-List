import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"Gyanmati@7",
  port:5432
});
 
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

 async function checkList(){
  const result=await db.query("SELECT * FROM items ORDER BY id ASC");
  let list=[];
  result.rows.forEach((item)=>list.push(item));
 console.log(list);
  return list;
 }

 async function addItem(item){
    await db.query("INSERT INTO items(title) VALUES($1)",[item]);
    const result=await db.query("SELECT * FROM items ORDER BY id ASC");
    let list=[];
    result.rows.forEach((item)=>list.push(item));
    items=list;
 }

app.get("/", async(req, res) => {
  items= await checkList();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  await addItem(item);
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
 const result=req.body.updatedItemId;
 const id=parseInt(result);
 const title=req.body.updatedItemTitle;
 await db.query("UPDATE items SET title=($1) WHERE id=$2",[title,id]);
 res.redirect("/");
});

app.post("/delete", async(req, res) => {
  const result=req.body.deleteItemId;
  const id=parseInt(result);
  console.log(typeof result);
  await db.query("DELETE FROM items WHERE id=$1",[id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
