
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Updated Supabase URL and key for the kiddo-qr project in Arnaldocloud's Org
const SUPABASE_URL = "https://kiddo-qr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZGRvLXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTc3MzksImV4cCI6MjA1OTc5MzczOX0.w3sgat6M-HbMr5Tpe6QjiZPqA5fkSVelsTkHecXSBXw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
