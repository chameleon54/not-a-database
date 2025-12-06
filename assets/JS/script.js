const tableBody = document.querySelector("#dataTable tbody");
const form = document.querySelector("#dataForm");
const searchInput = document.getElementById("searchInput");

//setting loading
let loadingStart = 0;
const MIN_LOADING_TIME = 300; //0.3ms

function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Hapus setelah animasi selesai (3s + 0.3s)
    setTimeout(() => {
        toast.remove();
    }, 3400);
}




function showLoading() {
    loadingStart = Date.now();

    document.getElementById("loading").style.display = "flex";
    document.getElementById("dataTable").classList.add("hidden");
}

function hideLoading() {
    const now = Date.now();
    const elapsed = now - loadingStart;
    const table = document.getElementById("dataTable");

    const hideAction = () => {
        document.getElementById("loading").style.display = "none";
        table.classList.remove("hidden");
    };

    if (elapsed >= MIN_LOADING_TIME) {
        hideAction();
    } else {
        setTimeout(hideAction, MIN_LOADING_TIME - elapsed);
    }
}


// FORMAT ANGKA
function formatNumber(num) {
    return Number(num).toLocaleString("id-ID");
}

function formatInputNumber(input) {
    let value = input.value.replace(/\D/g, "");
    input.value = Number(value).toLocaleString("id-ID");
}

// LOAD DATA (UTAMA)
function loadData() {
    showLoading();

    fetch("/assets/php/api.php")
        .then(res => res.json())
        .then(data => {
            fullData = data;   // <-- SIMPAN DATA UNTUK SORTING
            renderTable(fullData); 
            hideLoading();
        })
        .catch(err => {
            console.error("Load error:", err);
            hideLoading();
        });
}

let currentPage = 1;
let rowsPerPage = 5; // Jumlah baris per halaman

//render tabel
function renderTable(data) {
    tableBody.innerHTML = "";

    let start = (currentPage - 1) * rowsPerPage;
    let end = start + rowsPerPage;

    let paginatedData = data.slice(start, end);

    paginatedData.forEach((item, index) => {
        const row = `
        <tr class="table-row">
            <td data-label="Kode">${item.kode_barang}</td>
            <td data-label="Nama">${item.nama_barang}</td>
            <td data-label="H. Perolehan">${formatNumber(item.harga_perolehan)}</td>
            <td data-label="H. Jual">${formatNumber(item.harga_jual)}</td>
            <td data-label="Stok">${item.jumlah_stock}</td>
            <td data-label="Supplier">${item.suplier_utama}</td>

            <td data-label="Aksi">
                <button class="action-btn edit-btn" onclick="editData(${start + index})">Edit</button>
                <button class="action-btn delete-btn" onclick="hapusData(${start + index})">Hapus</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    renderPagination(data.length);
}

//pagination
function renderPagination(totalRows) {
    const pageNumbers = document.getElementById("pageNumbers");
    pageNumbers.innerHTML = "";

    let totalPages = Math.ceil(totalRows / rowsPerPage);

    // Buat nomor halaman
    for (let i = 1; i <= totalPages; i++) {
        let page = document.createElement("span");
        page.classList.add("page-number");
        if (i === currentPage) page.classList.add("active");

        page.innerText = i;
        page.onclick = () => {
            currentPage = i;
            renderTable(fullData);
        };

        pageNumbers.appendChild(page);
    }

    // tombol prev & next
    document.getElementById("prevPage").disabled = (currentPage === 1);
    document.getElementById("nextPage").disabled = (currentPage === totalPages);
}
//logic prev & next
document.getElementById("prevPage").onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable(fullData);
    }
};

document.getElementById("nextPage").onclick = () => {
    let totalPages = Math.ceil(fullData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable(fullData);
    }
};



// SEARCH QUERY
searchInput.addEventListener("keyup", function () {
    const keyword = this.value;

    showLoading();
    currentPage = 1; // reset halaman setiap search

    fetch(`/assets/php/api.php?search=${keyword}`)
        .then(res => res.json())
        .then(data => {

            fullData = data;      // simpan hasil search
            renderTable(fullData); // gunakan pagination
            hideLoading();
        })
        .catch(err => {
            console.error("Search error:", err);
            hideLoading();
        });
});


// TAMBAH DATA
form.addEventListener("submit", e => {
    e.preventDefault();

    const formData = {
        kode_barang: document.getElementById("kode_barang").value,
        nama_barang: document.getElementById("nama_barang").value,
        harga_perolehan: document.getElementById("harga_perolehan").value.replace(/\./g, ""),
        harga_jual: document.getElementById("harga_jual").value.replace(/\./g, ""),
        jumlah_stock: document.getElementById("jumlah_stock").value,
        suplier_utama: document.getElementById("suplier_utama").value
    };

    fetch("/assets/php/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })
        .then(res => res.json())
        .then(() => {
            form.reset();
            loadData();
            showToast("Data berhasil ditambahkan!", "success");

        })
        .catch(err => console.error("Tambah error:", err));

});

// EDIT DATA
let editIndex = -1;

function editData(index) {
    editIndex = index; 

    fetch("/assets/php/api.php")
        .then(res => res.json())
        .then(data => {
            const item = data[index];

            document.getElementById("edit_kode_barang").value = item.kode_barang;
            document.getElementById("edit_nama_barang").value = item.nama_barang;
            document.getElementById("edit_harga_perolehan").value = item.harga_perolehan;
            document.getElementById("edit_harga_jual").value = item.harga_jual;
            document.getElementById("edit_jumlah_stock").value = item.jumlah_stock;
            document.getElementById("edit_suplier_utama").value = item.suplier_utama;

            document.getElementById("editModal").style.display = "block";
        });
}
//popout edit modal
function tutupModal() {
    document.getElementById("editModal").style.display = "none";
}

document.getElementById("editForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedData = {
        kode_barang: edit_kode_barang.value,
        nama_barang: edit_nama_barang.value,
        harga_perolehan: edit_harga_perolehan.value,
        harga_jual: edit_harga_jual.value,
        jumlah_stock: edit_jumlah_stock.value,
        suplier_utama: edit_suplier_utama.value
    };

    fetch(`/assets/php/api.php?index=${editIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    })
        .then(res => res.json())
        .then(() => {
            tutupModal();
            loadData();showToast("Data berhasil diperbarui!", "info");
        });
});

// DELETE DATA
function hapusData(index) {
    if (!confirm("Yakin ingin menghapus?")) return;

    fetch(`/assets/php/api.php?index=${index}`, { method: "DELETE" })
        .then(res => res.json())
        .then(() => loadData());showToast("Data berhasil dihapus!", "warning");
}


// EXPORT DATA
document.getElementById("exportCSV").addEventListener("click", function () {

    fetch("/assets/php/api.php")
        .then(res => res.json())
        .then(data => {

            let csv = "Kode Barang,Nama Barang,Harga Perolehan,Harga Jual,Jumlah Stock,Suplier Utama\n";

            data.forEach(item => {
                csv += `${item.kode_barang},${item.nama_barang},${formatNumber(item.harga_perolehan)},${formatNumber(item.harga_jual)},${item.jumlah_stock},${item.suplier_utama}\n`;
            });

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "data_barang.csv";
            link.click();
        });
});

document.getElementById("exportExcel").addEventListener("click", function () {

    fetch("/assets/php/api.php")
        .then(res => res.json())
        .then(data => {

            let table =
                `<table>
                    <tr>
                        <th>Kode Barang</th>
                        <th>Nama Barang</th>
                        <th>Harga Perolehan</th>
                        <th>Harga Jual</th>
                        <th>Jumlah Stock</th>
                        <th>Suplier Utama</th>
                    </tr>`;

            data.forEach(item => {
                table += `
                    <tr>
                        <td>${item.kode_barang}</td>
                        <td>${item.nama_barang}</td>
                        <td>${formatNumber(item.harga_perolehan)}</td>
                        <td>${formatNumber(item.harga_jual)}</td>
                        <td>${item.jumlah_stock}</td>
                        <td>${item.suplier_utama}</td>
                    </tr>`;
            });

            table += "</table>";

            const blob = new Blob([table], {
                type: "application/vnd.ms-excel"
            });

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "data_barang.xls";
            link.click();
        });

});

//darkmode

const toggleButton = document.getElementById("themeToggle");

// apply saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleButton.textContent = "☀️ Light Mode";
}

toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        toggleButton.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        toggleButton.textContent = "🌙 Dark Mode";
    }
});

//sorting
let currentSort = { key: null, order: "asc" };
let fullData = []; // simpan data untuk sorting lokal

function applySorting(key) {
    if (currentSort.key === key) {
        currentSort.order = currentSort.order === "asc" ? "desc" : "asc";
    } else {
        currentSort.key = key;
        currentSort.order = "asc";
    }

    // Sorting
    fullData.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        // pastikan angka disortir sebagai angka
        if (!isNaN(valA) && !isNaN(valB)) {
            valA = Number(valA);
            valB = Number(valB);
        }

        if (currentSort.order === "asc") return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
    });

    renderTable(fullData);
}

document.querySelectorAll("th.sortable").forEach(th => {
    th.addEventListener("click", () => {
        const key = th.dataset.key;

        // reset semua header icons
        document.querySelectorAll("th.sortable").forEach(h => {
            h.classList.remove("asc", "desc");
        });

        applySorting(key);

        // tambahkan class asc / desc untuk icon
        th.classList.add(currentSort.order);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector(".splash-title");
    const subtitle = document.querySelector(".splash-subtitle");

    // ⏳ 1) Tunggu title masuk dulu (1.2s animasi + sedikit jeda)
    setTimeout(() => {

        // 2) Fade-out title
        title.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        title.style.opacity = "0";
        title.style.transform = "translateY(-12px)";

        // 3) Setelah fade-out selesai → fade-in subtitle
        setTimeout(() => {
            subtitle.style.transition = "opacity 0.9s ease, transform 0.9s ease";
            subtitle.style.opacity = "1";
            subtitle.style.transform = "translateY(0)";
        }, 900);

    }, 2200); 
});


// // SPLASH SCREEN HIDE AFTER LOADING
// window.addEventListener("load", () => {
//     setTimeout(() => {
//         document.getElementById("splashPremium").classList.add("hidden");
//     }, 2000);//settime splash screen
// });

window.addEventListener("load", () => {

    const splash = document.getElementById("splashPremium");

    if (!sessionStorage.getItem("premiumSplashShown")) {

        sessionStorage.setItem("premiumSplashShown", "1");

        splash.style.display = "flex";

        setTimeout(() => {
            splash.remove();
        }, 3500);  // total splash duration

    } else {
        splash.remove();
    }
});

// reset splash
function resetSplash() {
    sessionStorage.removeItem("premiumSplashShown");
    location.reload();
}


// window.addEventListener("load", () => {
//     if (!sessionStorage.getItem("splashShown")) {
//         setTimeout(() => {
//             document.getElementById("splashScreen").classList.add("hidden");
//         }, 1200);//detik splash screen

//         sessionStorage.setItem("splashShown", "yes");
//     } else {
//         document.getElementById("splashScreen").style.display = "none";
//     }
// });



loadData();
