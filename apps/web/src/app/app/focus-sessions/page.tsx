import { FocusSessionsPage, RemindersBlock } from '@/components/workspace/workspace-pages';

export default function WorkspaceFocusSessionsRoute() {
  return (
    <div className="grid gap-6">
      <FocusSessionsPage />
      <RemindersBlock />
    </div>
  );
}
