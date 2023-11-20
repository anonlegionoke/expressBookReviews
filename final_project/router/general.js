const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function getBooksByAuthor(authorName) {
    const authorBooks = [];
  
    for (const bookId in books) {
      if (books.hasOwnProperty(bookId) && books[bookId].author === authorName) {
        const { title, reviews } = books[bookId];
        authorBooks.push({ isbn: bookId, title, reviews });
      }
    }
  
    return authorBooks;
  }

  function getBooksByTitle(titleName) {
    const TitleBooks = [];
  
    for (const bookId in books) {
      if (books.hasOwnProperty(bookId) && books[bookId].title === titleName) {
        const { author, reviews } = books[bookId];
        TitleBooks.push({ isbn: bookId, author, reviews });
      }
    }
    return TitleBooks;
  }

  function getReview(review) {
    const reviewslis = {};
  
    for (const bookId in books) {
      if (books.hasOwnProperty(bookId) && books[bookId].reviews === review) {
        const { reviews } = books[bookId];
        reviewlis.push(reviews);
      }
    }
    return reviewslis;
  }

  public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
  
    if(username && password){
      if(!isValid(username)){
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
          return res.status(404).json({message:"User already exists!"})
      }
    } else {
        return res.status(404).json({message:"Unable to register user!"});
    }
  
  });
  
  

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    const booklist = await books;
    res.status(200).json(booklist);
  })

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(books[req.params.isbn]), 600);
    })
    promise.then((bookisbn) => {
      res.status(200).json(bookisbn);
    })
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve({ "booksbyauthor": (getBooksByAuthor(req.params.author)) }), 600);
  })
  promise.then((authorBooks) => {
    res.status(200).json(authorBooks);
  })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve({ "booksbytitle": (getBooksByTitle(req.params.title)) }), 600);
  })
  promise.then((titleBooks) => {
    res.status(200).json(titleBooks);
  })
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(getReview(req.params.isbn)), 600);
    })
    promise.then((review) => {
      res.status(200).json(review);
    })
  });

module.exports.general = public_users;
