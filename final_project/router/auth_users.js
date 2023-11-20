const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userwithsamename = users.filter((user) => user.username === username);
    if(userwithsamename.length > 0 ){
        return true;
    } else { return false; }
}

const authenticatedUser = (username,password)=>{
    let authUser = users.filter((user) => { 
        return(user.username === username && user.password === password);
    });
    if(authUser.length > 0){
        return true;
    } else { return false; } 
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  
  if(!username || !password){
    return res.status(404).json({message: "Error logging in"});
  }  

  if(authenticatedUser(username,password)){
      let accessToken = jwt.sign({
          "data" : password
      }, 'access', {expiresIn: 60*60});

      req.session.authorization = { accessToken, username};

      return res.status(200).json({message:"User Successfully Logged In!"});

  } else { 
      return res.status(208).json({message:"Invalid Login ! Check Username & Password"});
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.reviews;
    const username = req.session.authorization.username;
    let book = books[isbn];
    
    if(!username) {
        return res.status(403).json({message:"User not authenticated"});
    }

    if(book){
        if(book.reviews[username]){
            book.reviews[username] = review;
            return res.status(200).json({message:`Review updated for book ` +isbn+ ` by ${username}` });
        } else {
            book.reviews[username] = review;
            return res.status(200).json({message:`Review updated for book ` +isbn+ ` by ${username}`});
        } 
    } else {
        return res.status(404).json({message:"Book not found!"});
    }  
   
});

regd_users.delete("/auth/review/:isbn",(req,res) => {
    const isbn = req.params.isbn;
    let username = req.session.authorization.username; 
    
    if(!username){
        return res.status(403).send("Unauthenticated user!!");
    } else {
        delete books[isbn].reviews[username];
        return res.status(200).send(`Review has been deleted for book ` + isbn + ` by ${username}!`);
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
