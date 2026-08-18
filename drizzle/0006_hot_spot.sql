CREATE TABLE `rate_limit_buckets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bucketKey` varchar(128) NOT NULL,
	`route` varchar(96) NOT NULL,
	`count` int NOT NULL DEFAULT 0,
	`windowStartedAt` timestamp NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rate_limit_buckets_id` PRIMARY KEY(`id`),
	CONSTRAINT `rate_limit_buckets_bucketKey_unique` UNIQUE(`bucketKey`)
);
--> statement-breakpoint
CREATE TABLE `security_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventType` varchar(48) NOT NULL,
	`route` varchar(96) NOT NULL,
	`keyHash` varchar(64),
	`metadata` varchar(255),
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	CONSTRAINT `security_events_id` PRIMARY KEY(`id`)
);
