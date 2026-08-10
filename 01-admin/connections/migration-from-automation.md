# Migration from Automation mail

## Summary

Outbound SMTP used to live under **Automation → Setup** (`settings/automation_mail.json`, often with a plaintext password). **Settings → Connections** is now the home for email. During migration, Birkly **dual-reads** legacy Automation (and User plugin) mail settings so delivery keeps working; saving in Connections writes the encrypted vault and binds aliases. Automation Setup email UI **redirects / deep-links** to Connections. You can deactivate Automation and still send Commerce, form, and reset mail once Connections is healthy.

## Beginner

### Do I need to migrate?

If you previously configured SMTP (or Log / PHP mail) under **Automation → Setup**, yes — open Connections once, confirm the settings, save, and test. If you never used Automation mail, skip this page and follow [Email setup](email-setup.md).

### Guided steps

1. Open **Settings → Connections**.
2. If Birkly still finds `automation_mail.json`, Outbound mail may already show your From address and transport (labeled as legacy / Automation until you save).
3. Review From name/email, transport, and credentials.
4. Click **Save email connection** — this copies secrets into the encrypted Connections vault and sets the `transactional_email` alias.
5. **Test send** to yourself.
6. Visit **Automation → Setup** (if the plugin is active) — email settings should summarize status and link to **Settings → Connections** instead of a separate SMTP form.
7. Optional: deactivate Automation under **Settings → Plugins**. Commerce thank-you mail, form notify, invites, and password reset should still work via Connections.

### What about old workflows?

Automation **Send email** actions keep working. They call through the shared pipeline (`birkly_send_mail` / wrapper) instead of a private SMTP client. You do not rewrite every workflow.

### What about User Management email settings?

If User plugin stored its own `email_settings` (SMTP stub), Connections dual-reads that file when no core email connection exists. Saving in Connections is the supported path going forward — remove duplicate SMTP UIs from plugin Setup when prompted.

### Checklist

- [ ] Connections Email health is Healthy (or intentional Logged only in dev)
- [ ] Test send received (or visible in Delivery log for Log transport)
- [ ] Automation Setup no longer asks for a separate SMTP password
- [ ] Commerce template test / real order uses Connections (see [Commerce email prerequisite](commerce-email-prerequisite.md))
- [ ] Production sets `BIRKLY_SECRETS_KEY` so the vault is not tied only to a local `security.json` key

## Advanced Users

### Dual-read order

`birkly_mail_resolve_connection()`:

1. Explicit `connection_id` in opts  
2. Alias (default `transactional_email`)  
3. Any active core `email` connection  
4. Legacy `settings/automation_mail.json` (`source: automation_mail`, id `legacy_automation_mail`)  
5. Legacy User `data/plugins/user_management/metadata/email_settings.json` (`source: user_email_settings`)

Legacy rows are not written back; first admin **save** creates a core connection + encrypted secrets and should bind aliases.

### Legacy file shape (`automation_mail.json`)

Typical fields: `method` (`smtp`|`log`|`mail`), `from_email`, `from_name`, `reply_to`, `smtp_host`, `smtp_port`, `smtp_username`, `smtp_password`, `smtp_encryption`. After cutover, stop writing this file; keep a backup until you confirm delivery.

### Automation wrapper

`automation_send_mail(...)` becomes a thin wrapper around `birkly_send_mail`. Setup health (`setup_health.php`) should report Connections health and deep-link:

```text
?page=settings&tab=connections
```

Aliases also accepted: `email-connections`, `system-connections`, `smtp` → Connections tab.

### Deprecation freeze (phase end state)

- No new writes to `automation_mail.json` from Setup UI  
- One-shot migrate remaining installs  
- Commerce removes “ok: true” log-only success without `logged` / honest flags  
- PHP `mail()` remains only as explicit Connections transport `mail`

### Ops boundary

Do not merge CMS Connections with Marketplace Ops Resend (`marketplace_send_mail`). Hub license mail stays on Ops.

### Plugin contract after migration

```json
{
  "requires_connections": [
    { "type": "email", "alias": "transactional_email", "optional": false }
  ]
}
```

Official plugins must not ship private SMTP settings UIs for platform mail.

## Related

- [Connections overview](connections-overview.md)
- [Email setup](email-setup.md)
- [Commerce email prerequisite](commerce-email-prerequisite.md)
- [Automation overview](../../05-automation/automation-overview.md)
