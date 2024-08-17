import { FinanceDashboardSearchParams } from '../../finance/(dashboard)/page';
import StatisticCard from '@/components/cards/StatisticCard';
import { getPermissions } from '@/lib/workspace-helper';
import { createClient } from '@/utils/supabase/server';
import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';

const enabled = true;

export default async function ExpenseStatistics({
  wsId,
  searchParams: { startDate, endDate },
}: {
  wsId: string;
  searchParams: FinanceDashboardSearchParams;
}) {
  const supabase = createClient();
  const t = await getTranslations();

  const { data: expense } = enabled
    ? await supabase.rpc('get_workspace_wallets_expense', {
        ws_id: wsId,
        start_date: startDate ? dayjs(startDate).toISOString() : undefined,
        end_date: endDate ? dayjs(endDate).toISOString() : undefined,
      })
    : { data: 0 };

  const { permissions } = await getPermissions({
    wsId,
    requiredPermissions: [
      'ai_chat',
      'ai_lab',
      'manage_calendar',
      'manage_projects',
      'manage_documents',
      'manage_drive',
      'manage_users',
      'manage_inventory',
      'manage_finance',
    ],
  });

  if (!enabled || !permissions.includes('manage_finance')) return null;

  return (
    <StatisticCard
      title={t('finance-overview.total-expense')}
      value={Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        signDisplay: 'exceptZero',
      }).format(expense || 0)}
    />
  );
}
