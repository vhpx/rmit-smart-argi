import { LanguageWrapper } from './(dashboard)/_components/language-wrapper';
import { LogoutDropdownItem } from './(dashboard)/_components/logout-dropdown-item';
import { SystemLanguageWrapper } from './(dashboard)/_components/system-language-wrapper';
import { ThemeDropdownItems } from './(dashboard)/_components/theme-dropdown-items';
import { TTR_URL } from '@/constants/common';
import { getCurrentUser } from '@/lib/user-helper';
import { cn } from '@tutur3u/utils/format';
import { getInitials } from '@/utils/name-helper';
import { Avatar, AvatarFallback, AvatarImage } from '@tutur3u/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@tutur3u/ui/dropdown-menu';
import { Globe, Palette, Settings, User } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function UserNav({
  hideMetadata = false,
}: {
  hideMetadata?: boolean;
}) {
  const t = await getTranslations();
  const user = await getCurrentUser();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex w-full gap-2 rounded border p-2 text-start transition',
            hideMetadata
              ? 'items-center justify-center border-transparent'
              : 'items-start justify-start border-foreground/10 bg-foreground/10 hover:border-foreground/10 hover:bg-foreground/10 md:border-transparent md:bg-transparent'
          )}
        >
          <Avatar className="relative cursor-pointer overflow-visible font-semibold">
            <AvatarImage
              src={user?.avatar_url ?? undefined}
              className="overflow-clip rounded-full"
            />
            <AvatarFallback className="font-semibold">
              {user?.display_name ? (
                getInitials(user.display_name)
              ) : (
                <User className="h-5 w-5" />
              )}
            </AvatarFallback>
          </Avatar>
          {hideMetadata || (
            <div className="grid w-full">
              <div className="line-clamp-1 text-sm font-semibold break-all">
                {user?.display_name || user?.handle || t('common.unnamed')}
              </div>
              <div className="line-clamp-1 text-sm break-all opacity-70">
                {user?.email}
              </div>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align={hideMetadata ? 'start' : 'end'}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col">
            <Link
              href="/settings/account"
              className="line-clamp-1 w-fit text-sm font-medium break-all hover:underline"
            >
              {user?.display_name || user?.handle || t('common.unnamed')}
            </Link>
            <p className="line-clamp-1 text-xs break-all text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Palette className="mr-2 h-4 w-4" />
              <span>{t('common.theme')}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <ThemeDropdownItems />
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Globe className="mr-2 h-4 w-4" />
              <span>{t('common.language')}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <LanguageWrapper locale="en" label="English" />
                <LanguageWrapper locale="vi" label="Tiếng Việt" />
                <DropdownMenuSeparator />
                <SystemLanguageWrapper />
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`${TTR_URL}/settings/account`}
          >
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('common.settings')}</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <LogoutDropdownItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
