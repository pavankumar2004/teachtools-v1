CREATE TABLE `bookmarks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`category_id` integer,
	`tags` text,
	`favicon` text,
	`screenshot` text,
	`excerpt` text,
	`og_image` text,
	`og_title` text,
	`og_description` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer,
	`last_visited` integer,
	`notes` text,
	`is_archived` integer DEFAULT false NOT NULL,
	`is_favorite` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);;
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`slug` text NOT NULL,
	`color` text,
	`icon` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer
);;
CREATE UNIQUE INDEX `bookmarks_url_unique` ON `bookmarks` (`url`);;
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);;
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);;
ALTER TABLE `bookmarks` ADD `slug` text NOT NULL;;
CREATE UNIQUE INDEX `bookmarks_slug_unique` ON `bookmarks` (`slug`);;
ALTER TABLE `bookmarks` RENAME COLUMN `excerpt` TO `overview`;;
DROP INDEX IF EXISTS `categories_name_unique`;;
/*
 SQLite does not support "Changing existing column type" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/;
/*
 SQLite does not support "Set default to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/;
/*
 SQLite does not support "Set not null to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/;
ALTER TABLE `bookmarks` ADD `search_results` text;;
