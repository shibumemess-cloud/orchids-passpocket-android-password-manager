import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const supabase = createClient(
  'https://eggmxcmjkvcthleuqdnn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZ214Y21qa3ZjdGhsZXVxZG5uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTc3NjY1NSwiZXhwIjoyMDg3MzUyNjU1fQ.8Ez6o6-zoAqqjF-lKnM6lS6zyfi32_WX7wXrHM9Dgok'
);

const app = new Hono();

app.use(
  '*',
  cors({
    credentials: true,
    origin: (origin) => origin || '*',
  })
);

app.get('/', (c) => {
  return c.json({ message: 'PassPocket API' });
});

// --- Schemas ---
const passwordSchema = z.object({
  title: z.string().min(1),
  username: z.string().optional().default(''),
  email: z.string().optional().default(''),
  password: z.string().min(1),
  website_url: z.string().optional().default(''),
  category: z.string().default('other'),
  notes: z.string().optional().default(''),
  is_favorite: z.boolean().optional().default(false),
});

const updatePasswordSchema = passwordSchema.partial();

// --- GET all passwords ---
app.get('/passwords', async (c) => {
  const category = c.req.query('category');
  const search = c.req.query('search');
  const favorite = c.req.query('favorite');

  let query = supabase
    .from('passwords')
    .select('*')
    .order('created_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  if (favorite === 'true') {
    query = query.eq('is_favorite', true);
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,username.ilike.%${search}%,email.ilike.%${search}%,website_url.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// --- GET single password ---
app.get('/passwords/:id', async (c) => {
  const id = c.req.param('id');
  const { data, error } = await supabase
    .from('passwords')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return c.json({ error: error.message }, 404);
  return c.json(data);
});

// --- POST create password ---
app.post('/passwords', zValidator('json', passwordSchema), async (c) => {
  const body = c.req.valid('json');
  const { data, error } = await supabase
    .from('passwords')
    .insert(body)
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data, 201);
});

// --- PUT update password ---
app.put('/passwords/:id', zValidator('json', updatePasswordSchema), async (c) => {
  const id = c.req.param('id');
  const body = c.req.valid('json');
  const { data, error } = await supabase
    .from('passwords')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// --- DELETE password ---
app.delete('/passwords/:id', async (c) => {
  const id = c.req.param('id');
  const { error } = await supabase
    .from('passwords')
    .delete()
    .eq('id', id);

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

// --- PATCH toggle favorite ---
app.patch('/passwords/:id/favorite', async (c) => {
  const id = c.req.param('id');

  const { data: existing } = await supabase
    .from('passwords')
    .select('is_favorite')
    .eq('id', id)
    .single();

  if (!existing) return c.json({ error: 'Not found' }, 404);

  const { data, error } = await supabase
    .from('passwords')
    .update({ is_favorite: !existing.is_favorite, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// --- GET stats/summary ---
app.get('/stats', async (c) => {
  const { data: all, error } = await supabase
    .from('passwords')
    .select('id, category, password, is_favorite, created_at');

  if (error) return c.json({ error: error.message }, 500);

  const total = all?.length || 0;
  const favorites = all?.filter((p) => p.is_favorite).length || 0;

  // Category counts
  const categories: Record<string, number> = {};
  all?.forEach((p) => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });

  // Health score: based on password length and uniqueness
  let healthScore = 100;
  if (total > 0) {
    const passwords = all!.map((p) => p.password);
    const uniquePasswords = new Set(passwords);
    const duplicateRatio = 1 - uniquePasswords.size / passwords.length;
    const shortPasswords = passwords.filter((p) => p.length < 8).length;
    const shortRatio = shortPasswords / passwords.length;

    healthScore = Math.max(0, Math.round(100 - duplicateRatio * 40 - shortRatio * 30));
  }

  return c.json({
    total,
    favorites,
    categories,
    healthScore,
  });
});

export default {
  fetch: app.fetch,
  port: 3002,
};
