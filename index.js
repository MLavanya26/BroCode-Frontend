const axios =require('axios')
const express = require('express')
const mongoose= require('mongoose')
const user = require ('./data/user')
const app = express();
const port = process.env.port || 5000

const db="mongodb+srv://demo:demo@cluster0.4x59mpz.mongodb.net/mynodejsdb?retryWrites=true&w=majority"
const connectDB =async()=>{
    try{
        await mongoose.connect(db);
        console.log("connected");

    }catch(e){
        console.log("error while connecting"+e)
    }
};
connectDB();

const postSchema = new mongoose.Schema({
    Title: {
        type:String,
        required: true
    },
    Description:{
        type: String,
        required: true
    },
    Url:{
        type:String,
        required: true
    },
    UrlToImage:{
        type: String,
        required: true
    }
})

const Post = mongoose.model('Post',postSchema);

var cors=require('cors')
app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/api/user',async(req,res)=>{
    try{ 
    let response=await axios.get("https://newsapi.org/v2/top-headlines?country=us&apiKey=40a28407f86241d8a49720fe812e138b")
    console.log(response.data)
      let articles=response.data.articles;
    for(let i=0;i<articles.length;i++){ 
      const post=  new Post({
           Title: articles[i]['title'],
           Description: articles[i]['description'],
           Url: articles[i]['url'],
           UrlToImage: articles[i]['urlToImage']
        })
        console.log(post)
       await post.save();
    }
    res.json(response.data)
}
catch(e){
    console.log(e)
}

    // console.log(user)
    // res.json(user)
})

app.listen(port, () => console.log(`Example2 app1 listening on port ${port}!`))