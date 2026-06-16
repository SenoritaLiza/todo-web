import type { TaskDraft } from './task';

export function createDraft(input: { title: string; description?: string }): TaskDraft {
  return {
    title: (input?.title ?? '').trim(),
    description: (input?.description ?? '').trim(),
  };
}

export function isValidDraft(draft: TaskDraft): boolean {
  return Boolean(draft && draft.title && draft.title.length > 0);
}
