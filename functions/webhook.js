export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // 1. Ler o corpo da requisição do Mercado Pago
    const data = await request.json();
    const url = new URL(request.url);
    
    // Pegamos o ID da loja que foi passado na URL do webhook (ex: webhook?shop_id=...)
    const shopId = url.searchParams.get('shop_id');

    // VERIFICAÇÃO ANTI-ERRO DO TESTE
    if (data.id === "123456" || (data.data && data.data.id === "123456")) {
      return new Response("Teste de conexão recebido.", { status: 200 });
    }

    // 2. Verifica se é uma atualização de pagamento
    if (data.action === 'payment.updated' || data.type === 'payment') {
      const paymentId = data.data.id;
      
      // --- LÓGICA SAAS: BUSCAR TOKEN DA LOJA ESPECÍFICA ---
      let accessToken = env.MP_ACCESS_TOKEN; // Começa com o global (fallback)

      if (shopId) {
        // Se veio um shop_id, buscamos o token dessa loja no Supabase
        const shopResponse = await fetch(`${env.SUPABASE_URL}/rest/v1/barbershops?id=eq.${shopId}&select=mp_access_token`, {
          method: 'GET',
          headers: {
            'apikey': env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (shopResponse.ok) {
          const shopData = await shopResponse.json();
          // Se achou a loja e ela tem token configurado, usamos ele
          if (shopData && shopData.length > 0 && shopData[0].mp_access_token) {
            accessToken = shopData[0].mp_access_token;
            console.log(`Usando token personalizado da loja: ${shopId}`);
          }
        }
      }
      // ----------------------------------------------------

      // 3. Consulta o Mercado Pago usando o token correto (Global ou da Loja)
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!mpResponse.ok) {
        console.error('Erro ao consultar MP. Token inválido ou erro de API.');
        return new Response("Erro MP", { status: 200 }); 
      }

      const paymentInfo = await mpResponse.json();

      // 4. Se aprovado, atualiza o Supabase
      if (paymentInfo.status === 'approved') {
        const appointmentId = paymentInfo.external_reference;

        if (appointmentId) {
          const supabaseResponse = await fetch(`${env.SUPABASE_URL}/rest/v1/appointments?id=eq.${appointmentId}`, {
            method: 'PATCH',
            headers: {
              'apikey': env.SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ status: 'confirmed' })
          });

          if (supabaseResponse.ok) {
            console.log(`Agendamento ${appointmentId} confirmado!`);
          } else {
             console.error(`Erro ao atualizar Supabase: ${await supabaseResponse.text()}`);
          }
        }
      }
    }

    return new Response("Webhook processado", { status: 200 });

  } catch (err) {
    console.error(`Erro no Webhook: ${err.message}`);
    return new Response(`Erro: ${err.message}`, { status: 500 });
  }
}