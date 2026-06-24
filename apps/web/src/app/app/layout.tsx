import type { ReactNode } from 'react';

import { WorkspaceProvider } from '@/components/workspace/workspace-provider';
import { WorkspaceShell } from '@/components/workspace/workspace-shell';
import { env } from '@/env';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider apiUrl={env.NEXT_PUBLIC_API_URL}>
      <WorkspaceShell>{children}</WorkspaceShell>
    </WorkspaceProvider>
  );
}
