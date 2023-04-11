-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `hp` INTEGER NOT NULL DEFAULT 100,
    `currentHp` INTEGER NOT NULL DEFAULT 100,
    `str` INTEGER NOT NULL DEFAULT 10,
    `def` INTEGER NOT NULL DEFAULT 3,
    `dex` INTEGER NOT NULL DEFAULT 4,
    `matchId` INTEGER NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_userName_key`(`userName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Match` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player1First` BOOLEAN NOT NULL DEFAULT true,
    `player1Turn` BOOLEAN NOT NULL DEFAULT true,
    `matchStarted` BOOLEAN NOT NULL DEFAULT false,
    `matchDone` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Match_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
