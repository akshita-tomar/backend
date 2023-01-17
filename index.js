let express=require("express");
let app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
let mongoose=require('mongoose');
const cors = require('cors');





app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
app.use(fileUpload());
app.use(cors({
    origin: '*'
}));
require('./routes/user')(app);



// mongoose.connect("mongodb://127.0.0.1:27017/tab1")
// mongoose.connection.once("open",()=>console.log("db is connected..."));
// mongoose.connection.on("error",(error)=>console.log(" " + error));

mongoose.set('strictQuery',false);
mongoose.connect("mongodb://127.0.0.1:27017/gig?readPreference=primary&directConnection=true&ssl=false",{useNewUrlParser: true,useUnifiedTopology:true});
// mongoose.connect("mongodb://localhost:27017/gig", {
//   useNewUrlParser: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true
// });


app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.listen(3000,()=>console.log("backend is running......"))