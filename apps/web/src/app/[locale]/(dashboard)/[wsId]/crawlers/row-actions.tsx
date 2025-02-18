'use client';

import { Row } from '@tanstack/react-table';
import type { CrawledUrl } from '@tutur3u/types/db';
import { Button } from '@tutur3u/ui/button';
import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface RowActionsProps {
  row: Row<CrawledUrl>;
  href?: string;
  extraData?: any;
}

export function RowActions({ href }: RowActionsProps) {
  const t = useTranslations();

  return (
    <div className="flex items-center justify-end gap-2">
      {href && (
        <Link href={href}>
          <Button>
            <Eye className="mr-1 h-5 w-5" />
            {t('common.view')}
          </Button>
        </Link>
      )}
    </div>
  );
}
