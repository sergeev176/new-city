
let title = document.querySelector('title');

let list = document.querySelectorAll('li');

for (const item of list) {
    if (item.innerText === title.textContent) {
        item.classList.add('active');
    } else {
        item.classList.remove('active');
    }
}

