import * as XLSX from 'xlsx';

interface ExcelCrawlerProps {
  url: string;
  headerRow?: number;
  dataStartRow: number;
  // eslint-disable-next-line no-unused-vars
  onProgress: (progress: number, status: string) => void;
}

interface SheetInfo {
  name: string;
  rows: number;
  columns: number;
}

export class ExcelCrawler {
  private async fetchExcelFile(url: string): Promise<ArrayBuffer> {
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
    }
    return response.arrayBuffer();
  }

  private findRelevantSheet(workbook: XLSX.WorkBook): string | undefined {
    return (
      workbook.SheetNames.find(
        (name) =>
          name.toLowerCase().includes('monthly') ||
          name.toLowerCase().includes('price')
      ) || workbook.SheetNames[0]
    );
  }

  private cleanupData(data: any[][]): any[][] {
    // Remove empty rows (all cells are null, undefined, or empty string)
    const nonEmptyRows = data.filter((row) =>
      row.some(
        (cell) =>
          cell !== null && cell !== undefined && cell.toString().trim() !== ''
      )
    );

    if (nonEmptyRows.length === 0) return [];

    // Find the last non-empty column index
    const maxColIndex = Math.max(
      ...nonEmptyRows.map((row) => {
        let lastNonEmptyIndex = -1;
        for (let i = row.length - 1; i >= 0; i--) {
          if (
            row[i] !== null &&
            row[i] !== undefined &&
            row[i].toString().trim() !== ''
          ) {
            lastNonEmptyIndex = i;
            break;
          }
        }
        return lastNonEmptyIndex;
      })
    );

    // Trim rows to remove empty trailing columns
    return nonEmptyRows.map((row) =>
      row
        .slice(0, maxColIndex + 1)
        .map((cell) =>
          cell !== null && cell !== undefined ? cell.toString().trim() : ''
        )
    );
  }

  private cleanupHeaders(headers: any[]): string[] {
    if (!headers || headers.length === 0) return [];

    return headers.map((header, index) => {
      const cleaned = header?.toString().trim() || '';
      return cleaned || `Column ${index + 1}`;
    });
  }

  async preloadFile(url: string): Promise<{
    workbook: XLSX.WorkBook;
    sheetInfo: SheetInfo;
  }> {
    const arrayBuffer = await this.fetchExcelFile(url);
    const workbook = XLSX.read(arrayBuffer);
    const sheetName = this.findRelevantSheet(workbook);

    if (!sheetName || !workbook.Sheets[sheetName]) {
      throw new Error('No valid worksheet found');
    }

    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

    return {
      workbook,
      sheetInfo: {
        name: sheetName,
        rows: range.e.r + 1,
        columns: range.e.c + 1,
      },
    };
  }

  getPreviewFromWorkbook(
    workbook: XLSX.WorkBook,
    sheetName: string,
    headerRow: number,
    dataStartRow: number
  ): { headers: string[]; preview: any[][]; error?: string } {
    try {
      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        return {
          headers: [],
          preview: [],
          error: 'No valid worksheet found',
        };
      }

      // Get all data as array of arrays
      const allData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false, // Convert all cells to strings
        defval: '', // Use empty string for empty cells
      }) as any[][];

      if (!allData || allData.length === 0) {
        return {
          headers: [],
          preview: [],
          error: 'Worksheet is empty',
        };
      }

      // Clean up the data first
      const cleanData = this.cleanupData(allData);

      if (cleanData.length === 0) {
        return {
          headers: [],
          preview: [],
          error: 'No valid data found after cleanup',
        };
      }

      if (headerRow === 0) {
        return {
          headers: [],
          preview: [],
          error: 'Header row cannot be 0',
        };
      }

      // Get and clean headers
      const headers =
        headerRow > 0 && cleanData[headerRow - 1]
          ? this.cleanupHeaders(cleanData[headerRow - 1] as any[])
          : Array.from(
              { length: cleanData[0]?.length || 0 },
              (_, i) => `Column ${i + 1}`
            );

      // Get preview rows starting from dataStartRow
      const startIndex = dataStartRow - 1;
      const previewData = cleanData.slice(startIndex, startIndex + 10);

      return {
        headers,
        preview: previewData,
        error: undefined,
      };
    } catch (error) {
      return {
        headers: [],
        preview: [],
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error processing Excel file',
      };
    }
  }

  async crawl({
    url,
    headerRow = 1,
    dataStartRow,
    onProgress,
  }: ExcelCrawlerProps): Promise<{
    headers: string[];
    data: any[][];
    sheetInfo: SheetInfo;
  }> {
    try {
      onProgress(10, 'Fetching Excel file...');
      const arrayBuffer = await this.fetchExcelFile(url);

      onProgress(30, 'Parsing Excel data...');
      const workbook = XLSX.read(arrayBuffer);
      const sheetName = this.findRelevantSheet(workbook);

      if (!sheetName) {
        throw new Error('No valid sheet found');
      }

      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        throw new Error('No valid worksheet found');
      }

      onProgress(50, 'Processing worksheet...');
      onProgress(70, 'Extracting data...');
      const rawData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
        defval: '',
      }) as any[][];

      // Clean up the data
      const cleanData = this.cleanupData(rawData);

      if (cleanData.length === 0) {
        throw new Error('No valid data found after cleanup');
      }

      if (headerRow === 0) {
        throw new Error('Header row cannot be 0');
      }

      // Get and clean headers
      const headers = this.cleanupHeaders(
        headerRow > 0 && cleanData[headerRow - 1]
          ? (cleanData[headerRow - 1] as any[])
          : Array.from(
              { length: cleanData[0]?.length || 0 },
              (_, i) => `Column ${i + 1}`
            )
      );

      const dataRows = cleanData.slice(dataStartRow - 1);

      onProgress(100, 'Data processing complete');

      return {
        headers,
        data: dataRows,
        sheetInfo: {
          name: sheetName,
          rows: cleanData.length,
          columns: headers.length,
        },
      };
    } catch (error) {
      console.error('Excel crawling error:', error);
      throw error;
    }
  }

  async getPreview(props: ExcelCrawlerProps): Promise<{
    headers: string[];
    sampleData: any[][];
    sheetInfo: SheetInfo;
  }> {
    const { headers, data, sheetInfo } = await this.crawl(props);
    const sampleData = data.slice(0, 5); // Get first 5 rows for preview
    return { headers, sampleData, sheetInfo };
  }
}
