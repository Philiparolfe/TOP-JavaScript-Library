let myLibrary = [];


/* HTML Elements */
form = document.querySelector('.form')
formDisplay = document.querySelector('.formDisplay')

titleinput = document.querySelector('#title');
authorinput = document.querySelector('#author');
pagesinput = document.querySelector('#pages');
readinput = document.querySelector('#read');
submitbtn = document.querySelector('#submitbtn');
returnButon = form.querySelector('#return');
clear = document.querySelector('#clear');

table = document.querySelector('.table');
tbody = table.querySelector('tbody');

document.addEventListener('DOMContentLoaded', () => {
  pagesinput.addEventListener('input', () => {if(!pagesinput.validity.valid) pagesinput.value=''});
  submitbtn.addEventListener('click', () => {
    if (validation() == false) return;
    addBookToLibrary();
    console.table(myLibrary);
    updateTable();
    clearForm();
  });

  returnButon.addEventListener('click', () => {
    toggleHiddenElements();
    clearForm();
  });

  if(!localStorage.getItem('library')) {
    populateLibrary();
  }else {
    getLibrary();
  }
  updateTable();  
});

clear.addEventListener('click', () => {
    clearForm();
});

const validation = () => {
  if (titleinput.value == "" && document.querySelector('#titleError') == null) addError(titleinput);
  if (titleinput.value == "" && document.querySelector('#authorError') == null) addError(authorinput);
  if (titleinput.value == "" && document.querySelector('#pagesError') == null) addError(pagesinput);
  if (titleinput.value == "" || pagesinput.value == "") return false;
  else return true;
}

const addError = (el) => {
  let spanError = document.createElement('span');
  spanError.textContent = `Invalid`;
  spanError.id = `${el.id}Error`;
  spanError.classList.add('errorText');
  form.insertBefore(spanError, el);

  el.classList.add('errorInput');

  el.addEventListener('input', removeError);
}

const removeError = (el) => {
  if (el.target.value != '') {
    el.target.removeEventListener('input', removeError);
    el.target.classList.remove('errorInput');
    document.querySelector(`#${el.target.id}Error`).remove();
    
  }
}

const getReadStatus = () => {
  if(form.querySelector('input[name="read"]:checked').value == 'yes') return true;
  else return false;
}


const createReadStatusTd = (book) => {
  let readStatusTd = document.createElement('td');
  readStatusTd.classList.add('readStatusTd');
  let readStatusButton = document.createElement('button');
  readStatusButton.classList.add('readStatus');
  readStatusButton.textContent = 'Change';
  
  
  readStatusButton.addEventListener('click', () => {
    book.read = !book.read;
    updateTable();
    
  });
  readStatusTd.appendChild(readStatusButton);
  return readStatusTd;
}

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  //this.info = function() {
    //console.log(`${title} By: ${author}, ${pages} pages, ${read}`)
  //}
}

const populateLibrary = () => {
  localStorage.setItem('library', JSON.stringify(myLibrary));
}

const getLibrary = () => {
  myLibrary = JSON.parse(localStorage.getItem('library'));
}

const createEditTd = (book, index) => {
  let editTd = document.createElement('td');
  let editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => {
    titleinput.value = book.title;
    authorinput.value = book.author;
    pagesinput.value = book.pages;
    book.read ? form.querySelector('#yes').checked = true : form.querySelector('#no').checked = true;
    submitbtn.addEventListener('click', removeFromLibrary);
  });
  editTd.appendChild(editButton);
  return editTd;
}

const createDeleteTd = (index) => {
  let deleteTd = document.createElement('td');
  let deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    myLibrary.splice(index, 1);
    updateTable();
  });
  deleteTd.appendChild(deleteButton);
  return deleteTd;
}

const removeFromLibrary = (index) => {
  myLibrary.splice(index, 1)
  submitbtn.removeEventListener('click', removeFromLibrary);
  updateTable();
  showDisplay();
}


const updateTable = () => {
  tbody.textContent = '';

  myLibrary.forEach((book, index) => {
    let row = document.createElement('tr');
    Object.keys(book).forEach(prop => {
      let newTd = document.createElement('td');
      newTd.textContent = book[prop];
      if (prop == 'read') newTd.textContent = book[prop] ? 'Read' : 'Not read';
      row.appendChild(newTd);
      
    }); 

    row.appendChild(createReadStatusTd(book));
    row.appendChild(createEditTd(book, index));
    row.appendChild(createDeleteTd(index));
    tbody.appendChild(row);
  });
  table.style.visibility = 'hidden';
  table.style.display = 'none';
  populateLibrary();
  showDisplay()

}
const showDisplay = () => {
  if(myLibrary.length > 0){
    table.style.visibility = 'visible';
    table.style.display = 'initial';
    formDisplay.style['border-radius'] = '5px 5px 0px 0px'}
    else { formDisplay.style['border-radius'] = '5px 5px 5px 5px' } 
}



function addBookToLibrary() {
  const title = titleinput.value;
  const author = authorinput.value;
  const pages = pagesinput.value;
  const read = getReadStatus();
  const newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);
  clearForm();
}

const clearForm = () => {
    titleinput.value = "";
    authorinput.value = "";
    pagesinput.value = "";
  }
