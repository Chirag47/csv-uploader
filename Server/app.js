const express = require('express')
const app = express();
const PORT = process.env.PORT;
const path = require('path');
const router = express.Router();
const bodyParser = require("body-parser");
const InitModule = require('./InitModule');
const initObject = new InitModule();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"../build")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let dbObject, CSV_COLLECTION;
initObject.getMongoDB()
  .then(dbo => {
    dbObject = dbo;
    CSV_COLLECTION = dbObject.collection("csv");
    console.log('MOngodb connected')
  })
  .catch(e => {
    console.log("Mongo Connection Failed", e);
  });

router.get("/",(req,res) => {
  res.sendFile(path.join(__dirname, '..' , 'build', 'index.html'));
})
//api getDbUsers
function getFilterQuery(filter){
  if(Object.keys(filter).length > 0){
    return filter;
  } else {
    return {};
  }
}
function getSortQuery(sortCriteria){
  if(sortCriteria.column){
    let query = {};
    query[sortCriteria.column] = sortCriteria.order === "ascending" ? 1 : -1;
    return query;
  } else {
    return {};
  }
}
router.post('/getRows',async(req,res)=>{
  try {
    let pageNo = req.body.pageNo,
    pageSize = req.body.pageSize,
    sortCriteria = req.body.sortCriteria,
    filter = req.body.filter;
    let filterQuery = getFilterQuery(filter), sortQuery = getSortQuery(sortCriteria);
    let rows = await CSV_COLLECTION.find(filterQuery).sort(sortQuery).skip((pageNo -1) * pageSize).limit(pageSize).toArray();
    let count = await CSV_COLLECTION.find().count();
    for(let i=0;i<rows.length;i++){
      let row = rows[i];
      delete row._id;
      let date = new Date(row.dob);
      row.dob = date.toISOString().split('T')[0];
      rows[i] = row;
    }
    res.status(200).send({
      data: rows,
      total: count
    });
  } catch (error) {
    res.status(500).send({error: error.message})
  }
})

router.post('/setRows', async(req,res) => {
  try {
    let data = req.body.data, columnDefinitions = req.body.columns;
    data = data.map(row => {
      for(let column of columnDefinitions){
        if(column.dataType === "date"){
          row[column.name] = new Date(row[column.name]);
        } else if(column.dataType === "number"){
          row[column.name] = Number(row[column.name]);
        }
      }
      return row;
    })
    let test = await CSV_COLLECTION.findOne();
    if(test){
      await CSV_COLLECTION.drop();
    }
    let insertResponse = await CSV_COLLECTION.insertMany(data);
    if(insertResponse.result.ok === 1){
      res.status(200).send();
    } else {
      throw {message: "Could not save data"}
    }
  } catch (error) {
    res.status(500).send({error: error.message});
  }
})

router.post('/reset', async(req,res) => {
  try {
    let isDone = false;
    let test = await CSV_COLLECTION.findOne();
    if(test){
      let resetResponse = await CSV_COLLECTION.drop();
      isDone = resetResponse;
    } else {
      isDone = true;
    }
    if(isDone){
      res.status(200).send();
    } else {
      throw {message: "Could not reset data"}
    }
  } catch (error) {
    res.status(500).send({error: error.message});
  }
})

app.use('/', router);
app.listen(PORT, () => console.log(`Listening on ${PORT}`))

console.log(`Running at Port ${PORT}`);
