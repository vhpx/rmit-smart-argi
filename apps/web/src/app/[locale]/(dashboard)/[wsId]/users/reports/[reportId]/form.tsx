import { UserReportFormSchema } from './editable-report-preview';
import { Button } from '@tutur3u/ui/button';
import { AutosizeTextarea } from '@tutur3u/ui/custom/autosize-textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@tutur3u/ui/form';
import { Input } from '@tutur3u/ui/input';
import { Separator } from '@tutur3u/ui/separator';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';

export default function UserReportForm({
  isNew,
  form,
  submitLabel,
  onSubmit,
}: {
  isNew: boolean;
  form: UseFormReturn<z.infer<typeof UserReportFormSchema>>;
  submitLabel: string;
  onSubmit: (formData: z.infer<typeof UserReportFormSchema>) => void;
}) {
  return (
    <div className="grid h-fit gap-2 rounded-lg border p-4">
      <div className="text-lg font-semibold">Thông tin cơ bản</div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} disabled={isNew} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <AutosizeTextarea
                    placeholder="Content"
                    {...field}
                    disabled={isNew}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback</FormLabel>
                <FormControl>
                  <AutosizeTextarea
                    placeholder="Feedback"
                    {...field}
                    disabled={isNew}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <Button type="submit" className="w-full" disabled={isNew}>
            {submitLabel}
          </Button>
        </form>
      </Form>
    </div>
  );
}
