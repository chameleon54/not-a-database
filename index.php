<?php
$xml = simplexml_load_file("data.xml");

// Delete user
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];

    // Tried deleting with SimpleXML... it deleted my hope instead.
    // Switching to DOM like a responsible adult.
    $dom = new DOMDocument;
    $dom->load("data.xml");
    $xpath = new DOMXPath($dom);

    // Find node by id
    $nodes = $xpath->query("//user[@id='$id']");

    if ($nodes->length > 0) {
        $node = $nodes->item(0);
        $node->parentNode->removeChild($node);
        $dom->save("data.xml");
    }

    header("Location: index.php");
    exit();
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>XML CRUD</title>
    <style> 
        table { border-collapse: collapse; width: 50%; }
        td, th { padding: 8px; border: 1px solid #444; }
        a { padding: 6px 10px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
        .del { background: #dc3545; }
    </style>
</head>
<body>

<h2>XML CRUD ARUL PUNYA</h2>

<a href="create.php">Add New User</a>
<br><br>

<table>
    <tr>
        <th>ID</th><th>Name</th><th>Email</th><th>Action</th>
    </tr>
    <?php foreach ($xml->user as $user): ?>
    <tr>
        <td><?= $user['id']; ?></td>
        <td><?= $user->name; ?></td>
        <td><?= $user->email; ?></td>
        <td>
            <a href="edit.php?id=<?= $user['id']; ?>">Edit</a>
            <a class="del" href="index.php?delete=<?= $user['id']; ?>" 
               onclick="return confirm('Delete this user?')">Delete</a>
        </td>
    </tr>
    <?php endforeach; ?>
</table>

</body>
</html>
