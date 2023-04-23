
const bookshelfList = []
const RENDER_EVENT = 'render-books'
const SAVED_EVENT = 'saved-book'
const STORAGE_KEY = 'BOOK_SHELF'

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year: parseInt(year, 0),
        isComplete
    }
}

function findBook(bookId) {
    for (const book of bookshelfList) {
        if (book.id === bookId) {
            return book;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in bookshelfList) {
        if (bookshelfList[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function makeBookShelf(bookObject) {
    const { id, title, author, year, isComplete } = bookObject; // destructuring

    const textTitle = document.createElement('h2');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis: " + author;

    const textYear = document.createElement('p');
    textYear.innerText = "Tahun: " + year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);

    // container style
    const container = document.createElement('div');
    container.classList.add('item', 'shadow')
    container.append(textContainer);
    container.setAttribute('id', `book-${id}`);

    container.style.border = '1px solid #000'; // Add border to container
    container.style.margin = '10px'; // Add margin
    container.style.padding = '10px'; // Add padding
    container.style.borderRadius = '5px'; // Add border-radius (round)

    const button1 = document.createElement('button');
    if (isComplete) {
        button1.innerText = 'Belum Selesai dibaca';
    } else {
        button1.innerText = 'Selesai dibaca';
    }
    
    button1.style.backgroundColor = 'green';
    button1.style.borderRadius = '4px';
    button1.style.padding = '4px';
    button1.style.color = 'white';
    button1.style.marginRight = "8px";
    button1.addEventListener('click', function () {
        addTaskToCompleted(id, !isComplete);
    });

    const button2 = document.createElement('button');
    button2.innerText = 'Hapus buku';
    button2.style.backgroundColor = 'red';
    button2.style.borderRadius = '4px';
    button2.style.padding = '4px';
    button2.style.color = 'white';
    button2.addEventListener('click', function () {
        removeBooks(id);
    });

    container.append(button1, button2);

    return container;
}

function addToBooks() {
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear = document.getElementById('inputBookYear').value;
    const textCompleted = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(
        generatedID,
        textTitle,
        textAuthor,
        textYear,
        textCompleted)
    bookshelfList.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    resetForm();
}

function addTaskToCompleted(bookId, isCompleted) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = isCompleted;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBooks(bookId) {

    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    bookshelfList.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm /* HTMLFormElement */ = document.getElementById('inputBook');
    const searchButton = document.getElementById('searchSubmit');

    if (isStorageExist) {
        loadDataFromStorage();
    }

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addToBooks();
    });

    searchButton.addEventListener('click', function (event) {
        const textSearch = document.getElementById('searchBookTitle').value;
        event.preventDefault();
        loadDataFromStorage(textSearch);
    });

});

// load data from storage
function loadDataFromStorage(title = null) {
    // Clear the bookshelfList array
    bookshelfList.length = 0;

    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {

            book.year = parseInt(book.year, 0);

            if (title === null) {
                bookshelfList.push(book);
            } else {
                if (book.title.toLowerCase().includes(title.toLowerCase())) {
                    bookshelfList.push(book);
                }
            }

        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBooksList = document.getElementById('incompleteBookshelfList');
    const listCompleted = document.getElementById('completeBookshelfList');

    // clearing list item
    uncompletedBooksList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (const bookItem of bookshelfList) {
        const bookElement = makeBookShelf(bookItem);
        if (bookItem.isComplete) {
            listCompleted.append(bookElement);
        } else {
            uncompletedBooksList.append(bookElement);
        }
    }
});

// save to storage
function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bookshelfList);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

// cek jika browser mendukung storage
function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

// for debuging
document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

// reset form data
function resetForm() {
    document.getElementById('inputBook').reset();
}
