import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabaseSync("flowers.db");

export function initDb() {
  db.execSync(`
        PRAGMA journal_mode = WAL;
        create table if not exists cases_local (
        id text primary key,
        deceased_name text not null,
        service_date text not null,
        org_id text not null,
        status text default 'draft'
        );
        create table if not exists arrangements_local (
        id text primary key,
        case_id text not null,
        sender_name text,
        sender_message text,
        type text default 'other',
        order_index integer default 0
        );
        create table if not exists photos_local (
        id text primary key,
        arrangement_id text not null,
        kind text not null,
        local_uri text not null,
        width integer,
        height integer,
        synced integer default 0
        );
        create table if not exists upload_queue (
        id integer primary key autoincrement,
        job_type text not null,
        payload text not null,
        state text default 'pending',
        attempts integer default 0,
        last_error text
        );
    `);
}

export { db };
