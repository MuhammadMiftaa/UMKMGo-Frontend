import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * ~ Utility function to merge class names
 * @param inputs - The class names to merge
 * @returns Merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * ~ Convert a File object to base64 string
 * @param file - The file to convert
 * @returns Promise that resolves to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * ~ Convert a File object to base64 string without data URI prefix
 * @param file - The file to convert
 * @returns Promise that resolves to base64 string without prefix
 */
export const fileToBase64Pure = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove data URI prefix (e.g., "data:image/png;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * ~ Validate if file is an image
 * @param file - The file to validate
 * @returns boolean
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * ~ Validate image file size
 * @param file - The file to validate
 * @param maxSizeInMB - Maximum file size in megabytes
 * @returns boolean
 */
export const validateImageSize = (file: File, maxSizeInMB: number = 5): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};