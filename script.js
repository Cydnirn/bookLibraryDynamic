const storageKey = "BOOK_STORAGE_KEY";
const bookList = [];
const searchBookList = [];
const RENDER_EVENT = "render-books";
const SEARCH_EVENT = "search=books";

function checkForStorage(){
    if (typeof(Storage)  !== "undefined"){
        console.log("Storage didukung oleh browser");
        return true;
    }
    else{
        window.alert("Storage tidak didukung oleh Browser");
        return false
    }
}

function generateID(){
    return +new Date();
}

function generateBooks(id, judul, penulis, tahun, selesai){
    return{
        id, 
        judul, 
        penulis, 
        tahun, 
        selesai,
    }
}

function findBookIndex (bookId){
    const books = JSON.parse(localStorage.getItem(storageKey));
    for (let i in books){
        if (books[i].id === bookId){
            return i;
        }
    }
    return -1;
}

function searchBooks(judul){
    searchBookList.length = 0;
    const books = JSON.parse(localStorage.getItem(storageKey));
    for (let i in books){
        const bookJudul = books[i].judul.toUpperCase();
        judul = judul.toUpperCase();
        if (bookJudul.indexOf(judul) != -1){
            const container = document.getElementById(books[i].id);
            container.removeAttribute("hidden");
            searchBookList.push(books[i]);
        }
        else{
            const container = document.getElementById(books[i].id);
            container.setAttribute("hidden", true);
        }
    }

    document.dispatchEvent(new Event(SEARCH_EVENT));
}

function addBooks(){
    const judul = document.getElementById("judul").value;
    const penulis = document.getElementById("penulis").value;
    const tahun = parseInt(document.getElementById("tahun").value);
    const selesai = document.getElementById("dibaca-check").checked;
    const id = generateID();
    const book = generateBooks(id, judul, penulis, tahun, selesai);
    bookList.push(book);
    localStorage.setItem(storageKey, JSON.stringify(bookList));

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function addToComplete(bukuId){
    const targetBuku = findBookIndex(bukuId);
    if (targetBuku === -1) return;

    bookList[targetBuku].selesai = true;
    localStorage.setItem(storageKey, JSON.stringify(bookList));

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoFromComplete(bukuId){
    const targetBuku = findBookIndex(bukuId);
    if (targetBuku === -1) return;

    bookList[targetBuku].selesai = false;
    localStorage.setItem(storageKey, JSON.stringify(bookList));

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function intoTheTrashCan(bukuId){
    const targetBuku = findBookIndex(bukuId);
    if (targetBuku === -1) return;

    bookList.splice(targetBuku, 1);
    localStorage.setItem(storageKey, JSON.stringify(bookList));
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function trashButton(bukuId){
    const trashBookButton = document.createElement("input");
    trashBookButton.classList.add("btn", "hapus");
    trashBookButton.setAttribute("value", "Hapus Buku");
    trashBookButton.setAttribute("type", "button");
    trashBookButton.addEventListener("click",function(){
        if (confirm("Apakah Anda benar - benar menghapus list ini?")){
            intoTheTrashCan(bukuId);
        }
        else{
            return;
        }
    });

    return trashBookButton;
}

function undoButton(bukuId){
    const undoBookButton = document.createElement("input");
    undoBookButton.classList.add("btn", "undo");
    undoBookButton.setAttribute("value", "Belum Dibaca");
    undoBookButton.setAttribute("type", "button");
    undoBookButton.addEventListener("click", function(){
        undoFromComplete(bukuId);
    });

    return undoBookButton;
}

function checkButton(bukuId){
    const checkBookButton = document.createElement("input");
    checkBookButton.classList.add("btn", "selesai");
    checkBookButton.setAttribute("value", "Selesai Dibaca");
    checkBookButton.setAttribute("type", "button");
    checkBookButton.addEventListener("click", function(){
        addToComplete(bukuId);
    });
    return checkBookButton;
}

function makeBooks(buku){
    const judul = document.createElement('h2');
    judul.innerText = buku.judul;

    const penulis = document.createElement('p');
    penulis.innerText = "Penulis: " + buku.penulis;

    const tahun = document.createElement('p');
    tahun.innerText = "Tahun: " + buku.tahun;

    const btn = document.createElement('div');
    btn.classList.add('btn-list');

    if(buku.selesai){
        btn.append(undoButton(buku.id), trashButton(buku.id));
    }

    else{
        btn.append(checkButton(buku.id), trashButton(buku.id));
    }

    const innerContainer = document.createElement("div");
    innerContainer.classList.add("buku-isi");
    innerContainer.append(judul, penulis, tahun, btn);

    const container = document.createElement("div");
    container.classList.add("buku");
    container.setAttribute("id", buku.id);
    container.append(innerContainer);

    return container;
}

function extractFromJson(){
    let data = JSON.parse(localStorage.getItem(storageKey));
    
    if (data !== null){
        for (let index of data){
            bookList.push(index);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded",function(){
    console.log("DOM sudah diload");
    const submit = document.getElementById("form");
    const search = document.getElementById("search-form");

    if(checkForStorage){
        extractFromJson();
    }

    submit.addEventListener("submit", function(event){
        
        event.preventDefault();
        addBooks();
        document.getElementById("judul").value = "";
        document.getElementById("penulis").value = "";
        document.getElementById("tahun").value = "";
    });

    search.addEventListener("submit", function(event){
        const searchKeyword = document.getElementById("search-judul").value;
        event.preventDefault();
        searchBooks(searchKeyword);
    });
});

document.addEventListener(RENDER_EVENT, function(){
    const belumDibaca = document.getElementById("belumDibaca");
    belumDibaca.innerHTML = "";

    const sudahDibaca = document.getElementById("dibaca");
    sudahDibaca.innerHTML = "";

    for (let buku of bookList){
        const elementBuku = makeBooks(buku);

        if (buku.selesai){
            sudahDibaca.append(elementBuku);
        }
        else{
            belumDibaca.append(elementBuku);
        }
    }
});

document.addEventListener(SEARCH_EVENT, function(){
    if (searchBookList.length == 0){
        console.log("Search list kosong");
    }
    else{
        return;
    }
});