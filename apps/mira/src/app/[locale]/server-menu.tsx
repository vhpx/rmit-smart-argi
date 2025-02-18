import Menu from './menu';
import { getCurrentUser } from '@/lib/user-helper';
import { createClient } from '@tutur3u/supabase/next/server';

export default async function ServerMenu() {
  const supabase = await createClient();

  const {
    data: { user: sbUser },
  } = await supabase.auth.getUser();

  const user = await getCurrentUser(true);

  return <Menu sbUser={sbUser} user={user} />;
}
