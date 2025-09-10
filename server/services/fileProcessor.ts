import { parse } from 'csv-parse/sync';

export interface FileProcessingResult {
  success: boolean;
  data?: Array<{
    feedback: string;
    language?: string;
    demographic?: string;
  }>;
  error?: string;
}

export async function processCSVFile(fileContent: string): Promise<FileProcessingResult> {
  try {
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const data = records.map((record: any) => ({
      feedback: record.feedback || record.text || record.comment || '',
      language: record.language || record.lang || undefined,
      demographic: record.demographic || record.group || undefined,
    })).filter(item => item.feedback.trim() !== '');

    if (data.length === 0) {
      return {
        success: false,
        error: 'No valid feedback found in CSV file. Please ensure the file has a "feedback" column with text content.',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function processTextFile(fileContent: string): Promise<FileProcessingResult> {
  try {
    const lines = fileContent.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      return {
        success: false,
        error: 'No text content found in the file.',
      };
    }

    const data = lines.map(line => ({
      feedback: line,
    }));

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to process text file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
