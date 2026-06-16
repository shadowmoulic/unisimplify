-- SQL script to add the saved_colleges column to the profiles table
ALTER TABLE "unisimplify-profiles" ADD COLUMN IF NOT EXISTS saved_colleges JSONB DEFAULT '[]'::jsonb;
