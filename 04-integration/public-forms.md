# Public Forms

Public forms let visitors submit data (e.g. contact form, newsletter, application) that is stored as entries in a Birkly collection. The collection must allow “Public API” (or “Public submit”), and you send the data to the Birkly API from your website, often with security measures like rate limiting or CAPTCHA.

## Summary

To **accept form submissions** from your website into Birkly: (1) Create a collection with the fields you need (name, email, message, etc.). (2) In the collection’s Settings, set **Entry method** to **Public API** (or “Public submit”) and configure security (rate limit, CAPTCHA if available). (3) On your site, use a form that POSTs to the Birkly submit endpoint (e.g. `/api/public/collections/contact/entries` or the documented form endpoint). Don’t expose admin credentials; use the public submit API and optional tokens/keys as described in your docs.

## Beginner

**Public forms** mean: a visitor fills out a form on your website (contact, newsletter, job application), and that data is saved as an **entry** in a Birkly collection. You can then see and manage it in the admin, and optionally trigger automations (e.g. email or Slack).

**Step 1: Create a collection**

Create a collection that matches what you want to collect. For a contact form, for example:

| Field label | Type   | Required? | Key (example) |
|-------------|--------|-----------|----------------|
| Name        | Text   | Yes       | name          |
| Email       | Email  | Yes       | email         |
| Message     | Textarea | Yes     | message       |

Give the collection a name (e.g. “Contact submissions”) and a **handle** (e.g. `contact`). The handle is used in the submit URL.

**Step 2: Allow public submissions**

In the collection’s **Settings** (or Edit collection):

- Find **Entry method** (or “Who can create entries”).
- Set it to **Public API** (or “Public submit” / “Allow public submissions”).
- Enable **rate limiting** if available (e.g. 5 submissions per IP per hour) to reduce spam.
- If your Birkly has **CAPTCHA** or **honeypot**, turn them on for extra protection.
- Choose whether new submissions are saved as **Draft** (you review and publish) or **Published**. For contact forms, Draft is usually better so you don’t list them publicly.

**Step 3: Add a form on your website**

Your form must send a POST request to Birkly’s submit endpoint. Exact URL and format depend on your version; typical pattern:

- **Endpoint:** Something like `https://your-cms.com/api/public_submit.php?collection=contact` or `https://your-cms.com/api/public/collections/contact/entries`
- **Method:** POST
- **Body:** Field names should match the collection’s field keys (`name`, `email`, `message`). Format may be form-encoded or JSON—check your API docs.

**Example: simple HTML form**

```html
<form action="https://your-cms.com/api/public_submit.php?collection=contact"
      method="post">
  <label>Name <input type="text" name="name" required></label>
  <label>Email <input type="email" name="email" required></label>
  <label>Message <textarea name="message" required></textarea></label>
  <button type="submit">Send</button>
</form>
```

If your Birkly uses a different URL or requires a token/CSRF field, the admin or “Public forms” / “Secure integration” docs will say how to add it.

**Example: submit with JavaScript (fetch)**

```javascript
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  };

  const res = await fetch('https://your-cms.com/api/public/collections/contact/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert('Thank you! We’ll get back to you.');
    form.reset();
  } else {
    alert('Something went wrong. Please try again.');
  }
});
```

Replace the URL and field names with what your API expects. Some setups require an API key in a header or a one-time token from a “secure form” endpoint—see your docs.

**After submission**

- New entries appear in the admin under that collection. You can reply, export, or delete them.
- You can add **Automation** (e.g. “When an entry is created in Contact, send a Slack message or email”) so your team is notified. See [Automation overview](../05-automation/automation-overview.md) and [Webhooks](../05-automation/webhooks.md).

**Security checklist**

- **Never** put admin login or API keys that have admin rights in the browser.
- Use **HTTPS** for your site and the submit URL.
- Enable **rate limiting** and **CAPTCHA** (or honeypot) if available.
- Rely on **server-side validation** in Birkly for required fields and formats (e.g. email).

## Advanced Users

**When to use public forms**

Contact forms, newsletter signups, job applications, feedback, event registration—any flow where you want form data to become entries in a collection for viewing in the admin, export, or downstream automation.

**Setup in the admin**

1. **Collection:** Create with fields matching the form (keys = name, email, message, etc.).
2. **Entry method:** Set to **Public API** / **Public submit**. Configure rate limit, CAPTCHA, honeypot.
3. **Publish behavior:** Draft (review first) or Published (immediately visible if you ever list them; often still draft for contact-type collections).

**Submitting from the website**

| Option | Description |
|--------|-------------|
| **Form POST** | `action` = submit URL, `method="POST"`, `name` attributes = field keys. May require CSRF/token field; check docs. |
| **JavaScript fetch** | POST JSON (or form-encoded) to the submit endpoint. Include required headers (e.g. API key, Content-Type). |
| **Secure form flow** | Request a one-time token from a dedicated endpoint, then POST form + token. Reduces CSRF and abuse; see “secure integration” or “public forms” in your docs. |

**Endpoint and body format**

- URL: Often `POST /api/public/collections/{handle}/entries` or `POST /api/public_submit.php?collection={handle}`. Confirm in API docs.
- Body: JSON `{ "name": "...", "email": "...", "message": "..." }` or `application/x-www-form-urlencoded` with same keys. Field keys must match the collection schema.

**Security**

- No admin credentials on the frontend. Use public submit endpoint only.
- Rate limiting (per IP or per key) on the server.
- CAPTCHA/honeypot where appropriate.
- Server-side validation (required, format, length). Optional: sanitize or strip HTML from text fields.
- HTTPS only.

**After submission**

- Entries appear in the collection. Use **Automation** (trigger: entry created; actions: Slack, email, HTTP) to notify or sync. See [Triggers](../05-automation/triggers.md), [Conditions and actions](../05-automation/conditions-and-actions.md), [Webhooks](../05-automation/webhooks.md).

## Related

- [Collections](../02-content/collections.md)
- [Public API](public-api.md)
- [Automation overview](../05-automation/automation-overview.md)
- [Webhooks](../05-automation/webhooks.md)
