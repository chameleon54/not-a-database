<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$file = "../JSON/data.json";

// Buat file jika belum ada
if (!file_exists($file)) {
    file_put_contents($file, json_encode([]));
}

$method = $_SERVER['REQUEST_METHOD'];
//CRUD MULAI
// Ambil Data atau Search
if ($method === "GET") {

    $data = json_decode(file_get_contents($file), true);

    // Jika ada query search
    if (isset($_GET['search'])) {
        $keyword = strtolower($_GET['search']);
        $filtered = [];

        foreach ($data as $item) {
            // Cek semua field barang untuk kecocokan
            if (
                strpos(strtolower($item['kode_barang']), $keyword) !== false ||
                strpos(strtolower($item['nama_barang']), $keyword) !== false ||
                strpos(strtolower($item['harga_perolehan']), $keyword) !== false ||
                strpos(strtolower($item['harga_jual']), $keyword) !== false ||
                strpos(strtolower($item['jumlah_stock']), $keyword) !== false ||
                strpos(strtolower($item['suplier_utama']), $keyword) !== false
            ) {
                $filtered[] = $item;
            }
        }

        echo json_encode($filtered);
        exit;
    }

    // Jika tidak ada search langsung tampilkan semua data
    echo json_encode($data);
    exit;
}


// --- Tambah Data ---
if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $existing = json_decode(file_get_contents($file), true);

    $existing[] = [
        "kode_barang" => $data["kode_barang"],
        "nama_barang" => $data["nama_barang"],
        "harga_perolehan" => intval($data["harga_perolehan"]),
        "harga_jual" => intval($data["harga_jual"]),
        "jumlah_stock" => intval($data["jumlah_stock"]),
        "suplier_utama" => $data["suplier_utama"]
    ];

    file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT));
    echo json_encode(["status" => "sukses"]);
    exit;
}

// --- Hapus Data ---
if ($method === "DELETE") {
    $index = isset($_GET['index']) ? intval($_GET['index']) : -1;
    $existing = json_decode(file_get_contents($file), true);

    if ($index >= 0 && $index < count($existing)) {
        array_splice($existing, $index, 1);
        file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT));
        echo json_encode(["status" => "data terhapus"]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Index tidak valid"]);
    }
    exit;
}

// EDIT Data (PUT)
if ($method === "PUT") {
    parse_str($_SERVER['QUERY_STRING'], $params);
    $index = isset($params['index']) ? intval($params['index']) : -1;

    $existing = json_decode(file_get_contents($file), true);
    $dataBaru = json_decode(file_get_contents("php://input"), true);

    if ($index >= 0 && $index < count($existing)) {
        $existing[$index] = $dataBaru;
        file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT));
        echo json_encode(["status" => "data terupdate"]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Index tidak valid"]);
    }
    exit;
}

?>
