const starterBooks = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', borrowed: false },
  { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Software Engineering', borrowed: true },
  { id: 3, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', borrowed: false },
  { id: 4, title: 'Atomic Habits', author: 'James Clear', category: 'Personal Development', borrowed: false }
];
let books = [...starterBooks];
const rows = document.getElementById('bookRows');
const formWrap = document.getElementById('formWrap');
const bookForm = document.getElementById('bookForm');
const searchInput = document.getElementById('searchInput');

document.getElementById('today').textContent = '📅 ' + new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
document.getElementById('showFormBtn').addEventListener('click', () => {
  formWrap.classList.toggle('hidden');
  if (!formWrap.classList.contains('hidden')) document.getElementById('titleInput').focus();
});
document.getElementById('cancelBtn').addEventListener('click', () => {
  bookForm.reset(); formWrap.classList.add('hidden');
});
bookForm.addEventListener('submit', event => {
  event.preventDefault();
  const title = document.getElementById('titleInput').value.trim();
  const author = document.getElementById('authorInput').value.trim();
  const category = document.getElementById('categoryInput').value.trim();
  if (!title || !author || !category) return;
  books.unshift({ id: Date.now(), title, author, category, borrowed: false });
  bookForm.reset(); formWrap.classList.add('hidden'); renderBooks();
});
searchInput.addEventListener('input', renderBooks);

function renderBooks() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = books.filter(book => `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query));
  rows.innerHTML = '';
  filtered.forEach(book => {
    const tr = document.createElement('tr');
    const details = document.createElement('td');
    const title = document.createElement('div'); title.className = 'book-name'; title.textContent = book.title;
    const author = document.createElement('div'); author.className = 'book-author'; author.textContent = 'by ' + book.author;
    details.append(title, author);
    const category = document.createElement('td'); category.className = 'category'; category.textContent = book.category;
    const statusCell = document.createElement('td');
    const status = document.createElement('span'); status.className = 'status ' + (book.borrowed ? 'borrowed' : 'available'); status.textContent = book.borrowed ? 'Borrowed' : 'Available'; statusCell.append(status);
    const actions = document.createElement('td'); actions.className = 'action-cell';
    const borrowBtn = document.createElement('button'); borrowBtn.className = 'action-btn'; borrowBtn.textContent = book.borrowed ? 'Return' : 'Borrow';
    borrowBtn.addEventListener('click', () => { book.borrowed = !book.borrowed; renderBooks(); });
    const deleteBtn = document.createElement('button'); deleteBtn.className = 'action-btn delete'; deleteBtn.textContent = 'Remove';
    deleteBtn.addEventListener('click', () => {
      if (confirm(`Remove “${book.title}” from the collection?`)) { books = books.filter(item => item.id !== book.id); renderBooks(); }
    });
    actions.append(borrowBtn, deleteBtn); tr.append(details, category, statusCell, actions); rows.append(tr);
  });
  document.getElementById('totalCount').textContent = books.length;
  document.getElementById('availableCount').textContent = books.filter(book => !book.borrowed).length;
  document.getElementById('borrowedCount').textContent = books.filter(book => book.borrowed).length;
  document.getElementById('resultLabel').textContent = `${filtered.length} book${filtered.length === 1 ? '' : 's'}`;
  document.getElementById('emptyState').classList.toggle('hidden', filtered.length !== 0);
}
renderBooks();