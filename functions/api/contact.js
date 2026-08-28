export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: '请求格式无效' }, 400);
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken : '';

  if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return jsonResponse({ error: '请填写有效的姓名、Email 和讯息内容' }, 400);
  }

  if (!captchaToken) {
    return jsonResponse({ error: '请完成人机验证' }, 400);
  }

  if (!env.TURNSTILE_SECRET_KEY || !env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    return jsonResponse({ error: '邮件服务尚未完成配置' }, 500);
  }

  const captchaResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: captchaToken,
      remoteip: request.headers.get('CF-Connecting-IP')
    })
  });
  const captchaResult = await captchaResponse.json();

  if (!captchaResult.success) {
    return jsonResponse({ error: '人机验证已失效，请重新验证' }, 400);
  }

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL || 'Website contact <onboarding@resend.dev>',
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `网站联系表单：${name}`,
      text: `姓名：${name}\nEmail：${email}\n\n讯息内容：\n${message}`
    })
  });

  if (!emailResponse.ok) {
    return jsonResponse({ error: '邮件发送失败，请稍后再试' }, 502);
  }

  return jsonResponse({ ok: true });
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}