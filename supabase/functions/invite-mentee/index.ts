import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const adminClient = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar que o chamador é admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const callerClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user: caller } } = await callerClient.auth.getUser()
    if (!caller) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single()

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Apenas admins podem convidar mentorados' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Dados do novo mentorado
    const { email, mentee_id, name } = await req.json()

    if (!email || !mentee_id) {
      return new Response(JSON.stringify({ error: 'email e mentee_id são obrigatórios' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Convidar usuário — Supabase envia o e-mail de convite automaticamente
    const { data, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: 'https://arcusclub.com.br/definir-senha',
      data: { mentee_id: String(mentee_id), name },
    })

    let authUserId: string

    if (inviteError) {
      if (inviteError.message.includes('already been registered')) {
        // Usuário já existe — busca o ID existente
        const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers()
        if (listError) {
          console.error('[invite-mentee] listUsers error:', listError.message)
          return new Response(JSON.stringify({ error: listError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        const existing = users.find(u => u.email === email)
        if (!existing) {
          return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        authUserId = existing.id
      } else {
        console.error('[invite-mentee] inviteUserByEmail error:', inviteError.message)
        return new Response(JSON.stringify({ error: inviteError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    } else {
      authUserId = data.user.id
    }

    // Criar perfil linkando o auth user ao mentorado
    const { error: profileError } = await adminClient
      .from('profiles')
      .upsert({ id: authUserId, role: 'mentee', mentee_id: String(mentee_id) })

    if (profileError) {
      console.error('[invite-mentee] profile insert error:', profileError.message)
      return new Response(JSON.stringify({ error: profileError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
