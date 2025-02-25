import NavbarActions from '../../navbar-actions';
import { UserNav } from '../../user-nav';
import InvitationCard from './invitation-card';
import { Structure } from './structure';
import type { NavLink } from '@/components/navigation';
import {
  MAIN_CONTENT_SIZE_COOKIE_NAME,
  SIDEBAR_COLLAPSED_COOKIE_NAME,
  SIDEBAR_SIZE_COOKIE_NAME,
} from '@/constants/common';
import { getCurrentUser } from '@/lib/user-helper';
import {
  getPermissions,
  getWorkspace,
  verifySecret,
} from '@/lib/workspace-helper';
import {
  Box,
  ChartArea,
  Clock,
  Cog,
  Database,
  HardDrive,
  Logs,
  Play,
  ScanSearch,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type ReactNode, Suspense } from 'react';

interface LayoutProps {
  params: Promise<{
    wsId: string;
  }>;
  children: ReactNode;
}

export default async function Layout({ children, params }: LayoutProps) {
  const t = await getTranslations();
  const { wsId } = await params;

  const { withoutPermission } = await getPermissions({
    wsId,
  });

  const navLinks: (NavLink | null)[] = [
    {
      title: t('common.dashboard'),
      href: `/${wsId}`,
      icon: <ChartArea className="h-4 w-4" />,
      matchExact: true,
      shortcut: 'D',
    },
    null,
    {
      title: t('sidebar_tabs.models'),
      href: `/${wsId}/models`,
      icon: <Box className="h-4 w-4" />,
      disabled:
        !(await verifySecret({
          forceAdmin: true,
          wsId,
          name: 'ENABLE_AI',
          value: 'true',
        })) || withoutPermission('ai_lab'),
      experimental: 'alpha',
    },
    {
      title: t('sidebar_tabs.datasets'),
      href: `/${wsId}/datasets`,
      icon: <Database className="h-4 w-4" />,
      disabled:
        !(await verifySecret({
          forceAdmin: true,
          wsId,
          name: 'ENABLE_AI',
          value: 'true',
        })) || withoutPermission('ai_lab'),
      experimental: 'beta',
    },
    {
      title: t('sidebar_tabs.pipelines'),
      href: `/${wsId}/pipelines`,
      icon: <Play className="h-4 w-4" />,
      disabled:
        !(await verifySecret({
          forceAdmin: true,
          wsId,
          name: 'ENABLE_AI',
          value: 'true',
        })) || withoutPermission('ai_lab'),
      experimental: 'alpha',
    },
    {
      title: t('sidebar_tabs.crawlers'),
      href: `/${wsId}/crawlers`,
      icon: <ScanSearch className="h-4 w-4" />,
      disabled:
        !(await verifySecret({
          forceAdmin: true,
          wsId,
          name: 'ENABLE_AI',
          value: 'true',
        })) || withoutPermission('ai_lab'),
      experimental: 'alpha',
    },
    {
      title: t('sidebar_tabs.cron'),
      href: `/${wsId}/cron`,
      icon: <Clock className="h-4 w-4" />,
      disabled:
        !(await verifySecret({
          forceAdmin: true,
          wsId,
          name: 'ENABLE_AI',
          value: 'true',
        })) || withoutPermission('ai_lab'),
      experimental: 'alpha',
    },
    {
      title: t('sidebar_tabs.queues'),
      href: `/${wsId}/queues`,
      icon: <Logs className="h-4 w-4" />,
      disabled:
        !(await verifySecret({
          forceAdmin: true,
          wsId,
          name: 'ENABLE_AI',
          value: 'true',
        })) || withoutPermission('ai_lab'),
      experimental: 'alpha',
    },
    {
      title: t('sidebar_tabs.drive'),
      href: `/${wsId}/drive`,
      icon: <HardDrive className="h-4 w-4" />,
      disabled:
        !(await verifySecret({
          forceAdmin: true,
          wsId,
          name: 'ENABLE_DRIVE',
          value: 'true',
        })) || withoutPermission('manage_drive'),
      shortcut: 'R',
      experimental: 'beta',
    },
    null,
    {
      title: t('common.settings'),
      href: `/${wsId}/settings`,
      icon: <Cog className="h-4 w-4" />,
      aliases: [
        `/${wsId}/members`,
        `/${wsId}/teams`,
        `/${wsId}/secrets`,
        `/${wsId}/infrastructure`,
        `/${wsId}/migrations`,
        `/${wsId}/activities`,
      ],
      shortcut: ',',
    },
  ];

  const workspace = await getWorkspace(wsId);
  const user = await getCurrentUser();

  const sidebarSize = (await cookies()).get(SIDEBAR_SIZE_COOKIE_NAME);
  const mainSize = (await cookies()).get(MAIN_CONTENT_SIZE_COOKIE_NAME);

  const collapsed = (await cookies()).get(SIDEBAR_COLLAPSED_COOKIE_NAME);

  const defaultLayout =
    sidebarSize !== undefined && mainSize !== undefined
      ? [JSON.parse(sidebarSize.value), JSON.parse(mainSize.value)]
      : undefined;

  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  if (!workspace) redirect('/onboarding');
  if (!workspace?.joined)
    return (
      <div className="flex h-screen w-screen items-center justify-center p-2 md:p-4">
        <InvitationCard workspace={workspace} />
      </div>
    );

  return (
    <>
      <Structure
        wsId={wsId}
        user={user}
        workspace={workspace}
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
        links={navLinks}
        actions={
          <Suspense
            fallback={
              <div className="h-10 w-[88px] animate-pulse rounded-lg bg-foreground/5" />
            }
          >
            <NavbarActions />
          </Suspense>
        }
        userPopover={
          <Suspense
            fallback={
              <div className="h-10 w-10 animate-pulse rounded-lg bg-foreground/5" />
            }
          >
            <UserNav hideMetadata />
          </Suspense>
        }
      >
        {children}
      </Structure>

      {/* {(await verifySecret({
        forceAdmin: true,
        wsId,
        name: 'ENABLE_CHAT',
        value: 'true',
      })) && <FleetingNavigator wsId={wsId} />} */}
    </>
  );
}
