# Contact form email setup

The contact form is handled by the Cloudflare Pages Function at
`/api/contact`. It verifies the Turnstile token server-side and sends the
message through Resend.

## Cloudflare Pages variables

In the Pages project, open **Settings > Environment variables** and add these
variables for both Preview and Production as appropriate:

- `TURNSTILE_SECRET_KEY`: the secret key for the Turnstile widget used in
  `contact/index.html`.
- `RESEND_API_KEY`: a Resend API key with permission to send mail.
- `CONTACT_TO_EMAIL`: the mailbox that should receive contact messages, for
  example `report@thomaswan.uk`.
- `CONTACT_FROM_EMAIL`: a verified sender, for example
  `Website contact <contact@thomaswan.uk>`.

`RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` must be stored as encrypted
secrets. Do not put either value in HTML or client-side JavaScript.

## Resend

Add and verify the sending domain in Resend before setting
`CONTACT_FROM_EMAIL`. The sender domain must be verified or Resend will reject
the request.

After adding the variables, redeploy the Pages project. A successful form
submission returns `{ "ok": true }`; invalid or expired Turnstile tokens are
rejected by the Function.