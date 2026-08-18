CREATE TABLE `leaderboard_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rank` int NOT NULL,
	`architectId` varchar(32) NOT NULL,
	`circleSize` int NOT NULL DEFAULT 0,
	`multiplier` varchar(16) NOT NULL,
	`rexAllocation` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaderboard_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platform_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`genesisCap` int NOT NULL DEFAULT 10000,
	`registrationCount` int NOT NULL DEFAULT 1842,
	`tierOneMultiplier` varchar(16) NOT NULL DEFAULT '1.25x',
	`tierTwoMultiplier` varchar(16) NOT NULL DEFAULT '1.50x',
	`tierThreeMultiplier` varchar(16) NOT NULL DEFAULT '2.00x',
	`tierOneProgress` int NOT NULL DEFAULT 72,
	`tierTwoProgress` int NOT NULL DEFAULT 38,
	`tierThreeProgress` int NOT NULL DEFAULT 14,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platform_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`handle` varchar(120),
	`memberId` varchar(32) NOT NULL,
	`multiplier` varchar(16) NOT NULL DEFAULT '1.25x',
	`currentRex` int NOT NULL DEFAULT 0,
	`circleSize` int NOT NULL DEFAULT 0,
	`referralCode` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `registrations_id` PRIMARY KEY(`id`),
	CONSTRAINT `registrations_email_unique` UNIQUE(`email`),
	CONSTRAINT `registrations_memberId_unique` UNIQUE(`memberId`),
	CONSTRAINT `registrations_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `tournaments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp NOT NULL,
	`status` enum('draft','scheduled','live','complete') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tournaments_id` PRIMARY KEY(`id`)
);
