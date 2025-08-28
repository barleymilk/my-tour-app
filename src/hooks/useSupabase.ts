import { supabase } from "@/lib/supabase";

export async function getPhotoPath(photoPath: string, bucketName = "images") {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(photoPath);

  return data.publicUrl;
}
