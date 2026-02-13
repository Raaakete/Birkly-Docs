# Help and Onboarding

## Summary

**Help** is the in-admin documentation: a link or icon in the sidebar opens guides that explain collections, entries, field types, templating, and integration. This content can be sourced from Birkly Docs so it stays in sync with the product. **Onboarding** is the optional first-time setup flow (e.g. project name, first collection) shown when you or the first admin logs in; you can complete it in a few steps or skip it. If the instance was preconfigured, onboarding may not appear.

## Beginner

**Help**

The **Help** section (often a “?” icon or a “Help” link in the sidebar) opens documentation **inside** the admin. You don’t have to leave the panel or search the web—you can read how to create a collection, what field types mean, how to connect your website, and so on.

- **What’s in Help:** Topics usually match the main areas of the CMS: What is Birkly, Getting started, Content (collections and entries), Field types, Media, Templating, Website integration, Automation, Settings. You can use it as a mini manual.
- **How it’s organized:** You may see a short summary for each topic and a way to “Read more” or open a longer explanation. That way you can skim the basics or dive into detail when you need it.
- **Who updates it:** If your installation is set up to use Birkly Docs (the central doc set), the Help content can be updated whenever the docs are updated, so the in-admin help stays accurate.

**Example:** You’re not sure how to add a “Featured image” to a blog post. You click **Help**, open the “Entries” or “Field types” topic, and follow the steps. You never leave the admin.

**Onboarding**

**Onboarding** is a short setup flow that may appear **the first time** someone logs in (often the first administrator). It guides you through the very first steps so the CMS isn’t empty and confusing.

- **Typical steps:** A welcome message, then: set the **project name** (what appears in the admin), optionally upload a **logo**, and sometimes create your **first collection** (e.g. “Blog posts”) or add your **first entry**. Each step usually has a short explanation and a “Next” or “Skip” button.
- **Skipping:** If you already know what you’re doing, you can often click “Skip” or “Do this later” and go straight to the Dashboard. The CMS works fine without completing onboarding.
- **After you finish (or skip):** The system remembers that onboarding was shown. The next time you (or anyone) log in, you go straight to the Dashboard and don’t see the wizard again.
- **Preconfigured installs:** If someone set up the CMS for you and already chose a project name and created collections, you might never see onboarding—it may have been completed or disabled.

**Example:** You install Birkly for the first time and log in as admin. A wizard appears: “Welcome! Let’s set up your project.” You enter “Acme Blog” as the project name, click Next, optionally create a “Blog posts” collection, then click “Go to Dashboard.” From then on, logging in takes you directly to the Dashboard.

**For administrators**

If you maintain the CMS, you can point the Help content to the Birkly Docs folder (or a built version of it) so that when docs are updated, the Help panel reflects those updates. For any steps that are specific to your organization (e.g. “Always create the Blog collection first”), you can document them in your own internal wiki or in a custom Help page if the system allows it.

## Advanced Users

**Help:** Content can be static HTML/JS bundled in the admin, or loaded from a path (e.g. Birkly Docs). If from Markdown: build step or runtime conversion to HTML; navigation can mirror DOCS_ARCHITECTURE (Summary / Beginner / Advanced). Optional: search, deep links to sections.

**Onboarding:** State stored (e.g. `onboarding_completed` in settings or user). Steps can be linear (wizard) or checklist; completion can set flag and optionally create default collection/entry. Reset: admin action or script that clears the flag so onboarding shows again (useful for demos or new tenants). Skipping sets the same “completed” state so the wizard doesn’t reappear.

## Related

- [Getting started](../00-overview/getting-started.md)
- [DOCS_ARCHITECTURE.md](../DOCS_ARCHITECTURE.md) (for maintainers)
- [Dashboard](dashboard.md)
