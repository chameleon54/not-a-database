
const tableBody = document.querySelector("#dataTable tbody");
const form = document.querySelector("#dataForm");


// Search Query API
searchInput.addEventListener("keyup", function () {
    const keyword = this.value;

    showLoading();

    fetch(`api.php?search=${keyword}`)
        .then(res => res.json())
        .then(data => {
            tableBody.innerHTML = "";

            data.forEach((item, index) => {
                const row = `
                <tr>
                    <td>${item.kode_barang}</td>
                    <td>${item.nama_barang}</td>
                    <td>${item.harga_perolehan}</td>
                    <td>${item.harga_jual}</td>
                    <td>${item.jumlah_stock}</td>
                    <td>${item.suplier_utama}</td>
                    <td>
                        <button class="edit-btn" onclick="editData(${index})">Edit</button>
                        <button class="delete-btn" onclick="hapusData(${index})">Hapus</button>
                    </td>
                </tr>`;
                tableBody.innerHTML += row;
            });

            hideLoading();
        })
        .catch(() => hideLoading());
});


function showLoading() {
    document.getElementById("loading").style.display = "block";
}

function hideLoading() {
    document.getElementById("loading").style.display = "none";
}



// Load Data
function loadData() {
    showLoading(); // tampilkan loading

    fetch("api.php")
        .then(res => res.json())
        .then(data => {
            tableBody.innerHTML = "";
            data.forEach((item, index) => {
                const row = `
                <tr>
                    <td>${item.kode_barang}</td>
                    <td>${item.nama_barang}</td>
                    <td>${item.harga_perolehan}</td>
                    <td>${item.harga_jual}</td>
                    <td>${item.jumlah_stock}</td>
                    <td>${item.suplier_utama}</td>
                    <td>
                        <button class="edit-btn" onclick="editData(${index})">Edit</button>
                        <button class="delete-btn" onclick="hapusData(${index})">Hapus</button>
                    </td>
                </tr>`;
                tableBody.innerHTML += row;
            });

            hideLoading(); // sembunyikan loading
        })
        .catch(() => hideLoading());
}


// Tambah data
form.addEventListener("submit", e => {
  e.preventDefault();

  const formData = {
    kode_barang: document.getElementById("kode_barang").value,
    nama_barang: document.getElementById("nama_barang").value,
    harga_perolehan: document.getElementById("harga_perolehan").value,
    harga_jual: document.getElementById("harga_jual").value,
    jumlah_stock: document.getElementById("jumlah_stock").value,
    suplier_utama: document.getElementById("suplier_utama").value
  };

  fetch("api.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  })
    .then(res => res.json())
    .then(() => {
      form.reset();
      loadData();
    })
    .catch(err => console.error("Gagal menambah data:", err));
});

let editIndex = -1;

// Buka popout dan isi edit
function editData(index) {
    editIndex = index;

    fetch("api.php")
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

// Tutup popout
function tutupModal() {
    document.getElementById("editModal").style.display = "none";
}

// Simpan perubahan
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

    fetch(`api.php?index=${editIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    })
        .then(res => res.json())
        .then(() => {
            tutupModal();
            loadData();
        });
});

//export export
document.getElementById("exportCSV").addEventListener("click", function () {

    fetch("api.php")
        .then(res => res.json())
        .then(data => {
            let csv = "Kode Barang,Nama Barang,Harga Perolehan,Harga Jual,Jumlah Stock,Suplier Utama\n";

            data.forEach(item => {
                csv += `${item.kode_barang},${item.nama_barang},${item.harga_perolehan},${item.harga_jual},${item.jumlah_stock},${item.suplier_utama}\n`;
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

    fetch("api.php")
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
                        <td>${item.harga_perolehan}</td>
                        <td>${item.harga_jual}</td>
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



// Hapus Data
function hapusData(index) {
  if (confirm("Yakin ingin menghapus barang ini?")) {
    fetch(`api.php?index=${index}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => loadData())
      .catch(err => console.error("Gagal menghapus data:", err));
  }
}

loadData();
