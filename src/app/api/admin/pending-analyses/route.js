import { supabaseAdmin } from '@/lib/supabase'

function checkAuth(request) {
  const secret = request.headers.get('x-admin-secret')
  return secret && secret === process.env.ADMIN_SECRET
}

export async function GET(request) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: analyses, error } = await supabaseAdmin
    .from('room_analyses')
    .select('id, email, created_at, pdf_url, room_context')
    .eq('status', 'done')
    .is('delivered_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    return Response.json({ error: 'Erreur base de données' }, { status: 500 })
  }

  return Response.json({
    analyses: (analyses ?? []).map(a => ({
      id: a.id,
      email: a.email,
      created_at: a.created_at,
      pdf_url: a.pdf_url,
      type_piece: a.room_context?.type_piece ?? null,
    })),
  })
}
