# reaction-gallery
Example Flow.js project for storing & tagging images. Intended to be used as a private gallery for quickly sharing "reaction pics" in social media.
Minimal backend written in PHP. The project utilizes <a href="https://github.com/flowjs/ng-flow">ngFlow</a> & <a href="https://github.com/flowjs/flow-php-server">flow.js php server</a> for uploading images and <a href="https://github.com/leafo/scssphp">scssphp</a> for compiling scss into stylesheets.

The frontend is built with AngularJS and a bit of Bootstrap for styles.

To get the app running you need to define the database connection in dbcon.php, create two tables and set them up in dbfunctions.php.

First we need the extension table:
```sql
  CREATE TABLE `gallery_extensions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `extension` varchar(128) COLLATE utf8_swedish_ci NOT NULL,
  PRIMARY KEY (`id`)
  ) DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;
  INSERT INTO `gallery_extensions` (`extension`) VALUES ("jpg"), ("jpeg"), ("png"), ("gif");
```

Then we need a table for files - the unique id is used as the filename:
```sql
  CREATE TABLE `gallery_test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keywords` longtext COLLATE utf8_swedish_ci NOT NULL,
  `extension` int(11) NOT NULL,
  PRIMARY KEY (`id`)
  ) DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;
```
