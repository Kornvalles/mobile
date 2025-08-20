import { db } from "./db";
import { supabase } from "./supabase";

async function uploadPhoto(job: any) {
  const { local_uri, storage_path, photo_row } = job;
  const file = await fetch(local_uri).then((r) => r.blob());
  const { error: upErr } = await supabase.storage
    .from("flowers")
    .upload(storage_path, file, { upsert: true, contentType: "image/jpeg" });
  if (upErr) throw upErr;
  const { error: rowErr } = await supabase.from("photos").insert(photo_row);
  if (rowErr) throw rowErr;
}

const JOBS: Record<string, (job: any) => Promise<void>> = {
  photo: uploadPhoto,
};

export async function runQueueOnce() {
  const rows = db.getAll(
    "select id, job_type, payload, attempts from upload_queue where state='pending' order by id limit 5"
  );
  for (const r of rows) {
    const payload = JSON.parse(r.payload);
    try {
      await JOBS[r.job_type](payload);
      db.run("update upload_queue set state='done' where id=?", r.id);
    } catch (e: any) {
      db.run(
        "update upload_queue set attempts=attempts+1, last_error=?, state=case when attempts>3 then 'failed' else 'pending' end where id=?",
        String(e?.message || e),
        r.id
      );
    }
  }
}
