import { createSupabaseServerClient } from './supabase/server';

export type StorageBucket = 'game-thumbnails' | 'game-banners' | 'hero-banners' | 'user-avatars';

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  bucket: StorageBucket,
  folder?: string
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = folder 
      ? `${folder}/${timestamp}-${randomStr}.${extension}`
      : `${timestamp}-${randomStr}.${extension}`;
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });
    
    if (error) {
      console.error('Supabase upload error:', error);
      return { url: null, error: error.message };
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return { url: urlData.publicUrl, error: null };
  } catch (err) {
    console.error('Upload error:', err);
    return { url: null, error: 'Failed to upload file' };
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: 'Failed to delete file' };
  }
}

/**
 * Extract path from Supabase public URL
 */
export function extractPathFromUrl(url: string, bucket: StorageBucket): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.indexOf(bucket);
    if (bucketIndex === -1) return null;
    return pathParts.slice(bucketIndex + 1).join('/');
  } catch {
    return null;
  }
}
