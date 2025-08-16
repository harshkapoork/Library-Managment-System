// Book Class (Model)
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class (Handles UI Tasks)
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><button class="btn btn-danger btn-sm delete">Delete</button></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const alertDiv = document.querySelector("#alert");
    alertDiv.innerHTML = `<div class="alert alert-${className}">${message}</div>`;

    setTimeout(() => (alertDiv.innerHTML = ""), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

// Store Class (Handles Local Storage)
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    const updatedBooks = books.filter(book => book.isbn !== isbn);

    localStorage.setItem("books", JSON.stringify(updatedBooks));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("#title").value.trim();
  const author = document.querySelector("#author").value.trim();
  const isbn = document.querySelector("#isbn").value.trim();

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    const book = new Book(title, author, isbn);

    UI.addBookToList(book);
    Store.addBook(book);
    UI.showAlert("Book Added", "success");
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  UI.deleteBook(e.target);

  const isbn = e.target.parentElement.previousElementSibling.textContent;
  Store.removeBook(isbn);
  UI.showAlert("Book Removed", "warning");
});
