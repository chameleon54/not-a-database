<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$file = "data.json";

// Buat file jika belum ada
if (!file_exists($file)) {
    file_put_contents($file, json_encode([]));
}

$method = $_SERVER['REQUEST_METHOD'];

//  Ambil Data
if ($method === "GET") {
    echo file_get_contents($file);
    exit;
}

//Tambah Data 
if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $existing = json_decode(file_get_contents($file), true);
    $existing[] = $data;
    file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT));
    echo json_encode(["status" => "sukses"]);
    exit;
}

// Hapus Data 
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
