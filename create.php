<?php
if ($_POST) {
    $xml = simplexml_load_file("data.xml");

    $new = $xml->addChild('user');
    $new->addAttribute('id', $_POST['id']);
    $new->addChild('name', $_POST['name']);
    $new->addChild('email', $_POST['email']);

    $xml->asXML("data.xml");
    header("Location: index.php");
    exit();
}
?>
<!DOCTYPE html>
<html>
<head><title>Add User</title></head>
<body>

<h2>Add New User</h2>

<form method="post">
    ID: <br><input type="text" name="id" required><br><br>
    Name: <br><input type="text" name="name" required><br><br>
    Email: <br><input type="email" name="email" required><br><br>

    <button type="submit">Save</button>
</form>

<br>
<a href="index.php">Back</a>

</body>
</html>
