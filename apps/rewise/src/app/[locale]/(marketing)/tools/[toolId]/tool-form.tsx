'use client';

import { Tool } from '../data';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Album, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function ToolForm({ tool }: { tool: Tool }) {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(tool);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  };

  const fillPlaceholderContent = () => {
    setFormData({
      ...tool,
      fields: tool.fields.map((field) => ({
        ...field,
        value: field.placeholder
          ? field.placeholder.replace(/e\.g\.\s*/i, '')
          : '',
      })),
    });
  };

  const resetContent = () => {
    setFormData(tool);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-2">
        <Button
          onClick={fillPlaceholderContent}
          disabled={
            isLoading ||
            formData.fields.every(
              (field) =>
                field.value === field.placeholder?.replace(/e\.g\.\s*/i, '')
            )
          }
        >
          <Album className="h-4 w-4" />
          {t('common.example_content')}
        </Button>
        <Button
          variant="secondary"
          onClick={resetContent}
          disabled={isLoading || formData.fields.every((field) => !field.value)}
        >
          <RotateCcw className="h-4 w-4" />
          {t('common.reset')}
        </Button>
      </div>

      {formData.fields?.map((field) => {
        return (
          <div key={field.label} className="space-y-2">
            <Label htmlFor={field.label}>
              {field.label}
              {field.required && <span className="ml-1 text-red-500">*</span>}
            </Label>
            {field.type === 'text' ? (
              <Input
                id={field.label}
                placeholder={field.placeholder}
                required={field.required}
                value={field.value || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fields: formData.fields.map((f) =>
                      f.label === field.label
                        ? { ...f, value: e.target.value }
                        : f
                    ),
                  })
                }
              />
            ) : field.type === 'textarea' ? (
              <Textarea
                id={field.label}
                placeholder={field.placeholder}
                required={field.required}
                value={field.value || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fields: formData.fields.map((f) =>
                      f.label === field.label
                        ? { ...f, value: e.target.value }
                        : f
                    ),
                  })
                }
              />
            ) : (
              <Input
                id={field.label}
                placeholder={field.placeholder}
                required={field.required}
                value={field.value || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fields: formData.fields.map((f) =>
                      f.label === field.label
                        ? { ...f, value: e.target.value }
                        : f
                    ),
                  })
                }
              />
            )}
          </div>
        );
      })}

      <Button
        type="submit"
        className="w-full"
        disabled={
          isLoading ||
          formData.fields.some((field) => field.required && !field.value)
        }
      >
        {isLoading ? t('common.generating') : t('common.generate')}
      </Button>
    </form>
  );
}
