'use client';

import { Button } from '@/components/components/ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@repo/ui/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Separator } from '@repo/ui/components/ui/separator';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import { z } from 'zod';

const FormSchema = z.object({
  url: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .regex(/\.(xlsx|xls)$/i, {
      message: 'URL must point to an Excel file',
    }),
  headerRow: z.string().optional(),
  dataRow: z.string().min(1, {
    message: 'Data row is required.',
  }),
});

export function DatasetCrawler({
  url,
  wsId,
  datasetId,
}: {
  url: string | null;
  wsId: string;
  datasetId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [, setRawData] = useState<any[][]>([]);
  const [processedData, setProcessedData] = useState<any[][]>([]);
  const [sheetInfo, setSheetInfo] = useState({ rows: 0, columns: 0, name: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [, setColumns] = useState<any[]>([]);
  const [, setRows] = useState<any[]>([]);

  useEffect(() => {
    const fetchColumnsAndRows = async () => {
      const columnsRes = await fetch(
        `/api/v1/workspaces/${wsId}/datasets/${datasetId}/columns`
      );
      if (columnsRes.ok) {
        const cols = await columnsRes.json();
        setColumns(cols);
      }
      const rowsRes = await fetch(
        `/api/v1/workspaces/${wsId}/datasets/${datasetId}/rows`
      );
      if (rowsRes.ok) {
        const { data } = await rowsRes.json();
        setRows(data);
      }
    };

    fetchColumnsAndRows();
  }, [wsId, datasetId]);

  // Calculate pagination values
  const totalRows = processedData.length - 1; // Subtract header row
  const totalPages = Math.ceil(totalRows / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1; // +1 to skip header
  const endIndex = Math.min(startIndex + pageSize - 1, totalRows);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: url || '',
      headerRow: '',
      dataRow: '1',
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/proxy?url=${encodeURIComponent(data.url)}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);

      const sheetName =
        workbook.SheetNames.find(
          (name) =>
            name.toLowerCase().includes('monthly') ||
            name.toLowerCase().includes('price')
        ) || workbook.SheetNames[0];

      if (!sheetName) {
        throw new Error('No suitable sheet found in the workbook');
      }

      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        throw new Error('Worksheet is undefined');
      }

      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      const excelData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      }) as any[][];

      setRawData(excelData);
      setSheetInfo({
        rows: range.e.r + 1,
        columns: range.e.c + 1,
        name: sheetName,
      });

      // Process the data with header and data row configurations
      const headerRowIndex = data.headerRow ? parseInt(data.headerRow) - 1 : -1;
      const dataRowIndex = parseInt(data.dataRow) - 1;

      const headers =
        headerRowIndex >= 0
          ? excelData[headerRowIndex]
          : Array.from(
              { length: excelData[0]?.length || 0 },
              (_, i) => `Column ${i + 1}`
            );

      const processedRows = excelData ? excelData.slice(dataRowIndex) : [];
      setProcessedData([headers, ...processedRows] as any[][]);
    } catch (error) {
      console.error('Error processing Excel file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const getPageHref = (page: number) => {
    // Using # since we're handling navigation in-memory
    return `#page=${page}`;
  };

  const handlePageClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: number
  ) => {
    e.preventDefault();
    setCurrentPage(page);
  };

  const syncDataset = async () => {
    try {
      setLoading(true);

      // Ensure we have data to sync
      if (!processedData?.length || !processedData[0]?.length) {
        throw new Error('No data to sync');
      }

      // First sync columns
      const headers = processedData[0];
      const columnsResponse = await fetch(
        `/api/v1/workspaces/${wsId}/datasets/${datasetId}/columns/sync`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            columns: headers
              .map((name: string) => ({
                name: String(name).trim(),
              }))
              .filter((col) => !!col.name),
          }),
        }
      );

      if (!columnsResponse.ok) {
        const error = await columnsResponse.json();
        throw new Error(error.message || 'Failed to sync columns');
      }

      // Then sync rows with validated headers
      const processedHeaders = headers
        .map((h: string) => String(h).trim())
        .filter(Boolean);
      const rows = processedData.slice(1); // Skip header row

      if (rows.length === 0) {
        throw new Error('No rows to sync');
      }

      const processedRows = rows.map((row: any[]) => {
        const rowData: Record<string, any> = {};
        processedHeaders.forEach((header: string, index: number) => {
          // Ensure we only include data for valid headers
          if (header && index < row.length) {
            rowData[header] = row[index] ?? null;
          }
        });
        return rowData;
      });

      const rowsResponse = await fetch(
        `/api/v1/workspaces/${wsId}/datasets/${datasetId}/rows/sync`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rows: processedRows }),
        }
      );

      if (!rowsResponse.ok) {
        const error = await rowsResponse.json();
        throw new Error(error.message || 'Failed to sync rows');
      }

      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error syncing dataset:', error);
      // You might want to show an error toast here
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} disabled={!url}>
          Sync Dataset
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Excel Dataset Preview</DialogTitle>
          <DialogDescription>
            {sheetInfo.name
              ? `Sheet: ${sheetInfo.name} (${sheetInfo.rows} rows, ${sheetInfo.columns} columns)`
              : 'Configure and fetch your Excel dataset'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excel File URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/data.xlsx"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the URL of an Excel file (.xlsx or .xls)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="headerRow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Header Row</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>Leave blank for no header</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataRow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Start Row</FormLabel>
                    <FormControl>
                      <Input placeholder="2" {...field} />
                    </FormControl>
                    <FormDescription>1-based row index</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Fetch and Process'}
            </Button>
          </form>
        </Form>

        {processedData.length > 0 && <Separator />}
        {processedData.length > 0 && (
          <div className="mt-4 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  Rows per page:
                </span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 100].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-muted-foreground text-sm">
                Showing rows {startIndex} to {endIndex} of {totalRows}
              </div>
            </div>

            <div className="grid grid-cols-1 overflow-x-auto">
              <div className="w-fit">
                <table className="border-foreground/30 w-full table-auto border-collapse border">
                  <thead>
                    <tr className="[&_th]:bg-foreground/20">
                      {processedData[0]?.map((header: any, index: number) => (
                        <th
                          key={index}
                          className="border-foreground/30 border px-4 py-2"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {processedData
                      .slice(startIndex, startIndex + pageSize)
                      .map((row: any[], rowIndex: number) => (
                        <tr key={rowIndex}>
                          {row.map((cell: any, cellIndex: number) => (
                            <td
                              key={cellIndex}
                              className="border-foreground/30 border px-4 py-2"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={getPageHref(currentPage - 1)}
                    onClick={(e) => handlePageClick(e, currentPage - 1)}
                    className={
                      currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => {
                    if (index > 0 && array[index - 1] !== page - 1) {
                      return (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href={getPageHref(page)}
                          onClick={(e) => handlePageClick(e, page)}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                <PaginationItem>
                  <PaginationNext
                    href={getPageHref(currentPage + 1)}
                    onClick={(e) => handlePageClick(e, currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="mt-4 flex justify-end">
              <Button onClick={syncDataset} disabled={loading}>
                {loading ? 'Syncing...' : 'Sync Dataset'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
