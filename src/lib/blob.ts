import { put, del, list } from '@vercel/blob';

export async function uploadFile(file: File, filename: string) {
  try {
    const blob = await put(filename, file, {
      access: 'public',
    });
    return blob;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

export async function deleteFile(url: string) {
  try {
    await del(url);
  } catch (error) {
    console.error('Delete failed:', error);
    throw error;
  }
}

export async function listFiles(prefix?: string) {
  try {
    const blobs = await list({
      prefix: prefix || '',
    });
    return blobs;
  } catch (error) {
    console.error('List failed:', error);
    throw error;
  }
}
