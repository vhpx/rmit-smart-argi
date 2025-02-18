import { Separator } from '@tutur3u/ui/separator';

export default function Loading() {
  return (
    <>
      <div className="h-[5.5rem] rounded-lg border border-border bg-foreground/5 p-4" />
      <Separator className="my-4" />

      <div className="grid gap-4 opacity-50 lg:grid-cols-2">
        <div className="flex h-64 flex-col rounded-lg border border-border bg-foreground/5 p-4" />
        <div className="flex h-64 flex-col rounded-lg border border-border bg-foreground/5 p-4" />
        <div className="flex h-64 flex-col rounded-lg border border-border bg-foreground/5 p-4" />
        <div className="flex h-64 flex-col rounded-lg border border-border bg-foreground/5 p-4" />
      </div>
    </>
  );
}
