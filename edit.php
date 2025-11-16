<?php
$xml = simplexml_load_file("data.xml");
$id = $_GET['id'];
$target = null;

// find user
foreach ($xml->user as $user) {
    if ((string)$user['id'] === $id) {
        $target = $user;
        break;
    }
}

if (!$target) { die("User not found."); }

if ($_POST) {
    $target->name = $_POST['name'];
    $target->email = $_POST['email'];

    $xml->asXML("data.xml");
    header("Location: index.php");
    exit();
}
?>
<!DOCTYPE html>
<html>
<head><title>Edit User</title></head>
<body>

<h2>Edit User ID <?= $id ?></h2>

<form method="post">
    Name: <br><input type="text" name="name" value="<?= $target->name ?>" required><br><br>
    Email: <br><input type="email" name="email" value="<?= $target->email ?>" required><br><br>

    <button type="submit">Update</button>
</form>

<br>
<a href="index.php">Back</a>

</body>
</html>
