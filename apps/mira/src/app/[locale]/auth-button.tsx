'use client';

import { createClient } from '@tutur3u/supabase/next/client';
import { SupabaseUser } from '@tutur3u/supabase/next/user';
import { Button } from '@tutur3u/ui/button';
import { cn } from '@tutur3u/utils/format';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export function AuthButton({
  user,
  onClick,
  className,
}: {
  user: SupabaseUser | null;
  onClick?: () => void;
  className?: string;
}) {
  const supabase = createClient();

  const signOut = async () => {
    await supabase.auth.signOut({
      scope: 'local',
    });

    return redirect('/login');
  };

  return user ? (
    <div className="grid gap-2">
      <div className="break-all">
        <div className="text-xs">Logged in as</div>
        <div className="line-clamp-1 text-sm font-semibold">{user.email}</div>
      </div>
      <form action={signOut}>
        <Button
          onClick={onClick}
          variant="destructive"
          className={cn('w-full', className)}
        >
          Logout
        </Button>
      </form>
    </div>
  ) : (
    <Link href="/login" onClick={onClick} className="w-full">
      <Button className="w-full">Login</Button>
    </Link>
  );
}
