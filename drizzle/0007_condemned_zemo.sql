CREATE TABLE `admin_audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminUserId` int NOT NULL,
	`action` varchar(64) NOT NULL,
	`entityType` varchar(64) NOT NULL,
	`entityId` varchar(64),
	`summary` varchar(255) NOT NULL,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	CONSTRAINT `admin_audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `platform_settings` ADD `registrationRetentionDays` int DEFAULT 365 NOT NULL;--> statement-breakpoint
ALTER TABLE `platform_settings` ADD `analyticsRetentionDays` int DEFAULT 90 NOT NULL;--> statement-breakpoint
ALTER TABLE `platform_settings` ADD `securityRetentionDays` int DEFAULT 14 NOT NULL;