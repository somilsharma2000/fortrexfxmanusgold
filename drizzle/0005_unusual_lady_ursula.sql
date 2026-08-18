CREATE TABLE `analytics_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventName` varchar(80) NOT NULL,
	`path` varchar(255) NOT NULL DEFAULT '/',
	`payload` text,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
