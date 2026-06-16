-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(2000) NOT NULL DEFAULT '',
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_is_deleted_created_at_idx" ON "tasks"("is_deleted", "created_at");

-- CreateIndex
CREATE INDEX "tasks_is_completed_created_at_idx" ON "tasks"("is_completed", "created_at");

-- CreateIndex
CREATE INDEX "tasks_title_idx" ON "tasks"("title");
