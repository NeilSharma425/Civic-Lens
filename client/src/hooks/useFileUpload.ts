import { useState, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';

export interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export function useFileUpload() {
  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const uploadFile = useCallback(async (file: File) => {
    setState({ isUploading: true, progress: 0, error: null });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/feedback/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setState({ isUploading: false, progress: 100, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setState({ isUploading: false, progress: 0, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isUploading: false, progress: 0, error: null });
  }, []);

  return {
    ...state,
    uploadFile,
    reset,
  };
}
