# Project Git sync

Connect **Settings → Project → Git** to GitHub, GitLab, Bitbucket, Codeberg, Gitea/Forgejo, SourceHut, Buzz, or any other git remote to push and pull the files under `project/` — your site's HTML, CSS, JS, and static assets. It works on any Birkly install with the system `git` binary available; there is no Birkly Cloud dependency.

**Project Git sync only ever touches `project/`.** It does not sync CMS content, media, users, plugins, or settings. If you want to package or move **content and media** between installs, use [Hub site packs](../06-plugin-economy/theme-and-template-packs.md) instead — see [Project git sync vs. site packs](#project-git-sync-vs-site-packs) below.

## Summary

- **What it is:** a directional push/pull sync between the `project/` folder and a git remote, driven by the system `git` binary.
- **What syncs:** only allowlisted files under `project/` (HTML, CSS, JS, JSON, Markdown, SVG, images, etc.) — the same set the Project **Files** browser and **Download project** ZIP use.
- **What never syncs:** `content/`, `media/`, `users/`, `settings/` (including the encrypted git credentials themselves), plugins, cache, logs, and `config.php`.
- **Direction:** **Push** = Birkly's `project/` wins and overwrites the remote branch. **Pull** = the remote branch wins and overwrites `project/`.
- **Conflicts:** if both sides changed, nothing is overwritten automatically — you choose **Keep Birkly** or **Keep remote**.
- **Where:** Settings → **Project** → **Git** tab.
- **Requires:** `manage_settings` permission (Admin role by default) to connect, push, pull, or disconnect. Viewing status only needs `read_settings`.

## Where to find it

Settings has its own dedicated **Project** tab (`?tab=project`), separate from **Site delivery**:

| Settings tab | Sections |
|---|---|
| **General** | Site identity (project name, description, logo), timezone, language, media defaults |
| **Site delivery** | Domains, Hosting URLs wizard, Redirects |
| **Project** | **Overview**, **Files**, **Rendering**, **Git**, **Activity** |

The Project tab's **Files** section is the same file browser used for uploading, editing, downloading, and deleting project files — Git sync is an additional way to get files in and out, alongside manual upload/download. See [Settings](settings.md) for the rest of the Settings tabs.

## What syncs (and what doesn't)

| Included | Excluded |
|---|---|
| Files under `project/` with an allowed extension: `html`, `css`, `js`, `json`, `md`, `svg`, `webp`, `txt`, `jpg`, `jpeg`, `png`, `gif`, `ico` | `content/` (collections and entries) |
| The `.gitignore` Birkly writes into `project/` on connect | `media/` (uploaded assets in the media library) |
| | `users/`, `settings/` (including this feature's own stored credentials) |
| | Installed plugins and their data |
| | Any dotfile or dot-folder path segment (e.g. `.env`, `.well-known/`) |
| | `.php` / `.phtml` / `.phar` files — server-side code is never served from `project/` and is never staged |

This is the **same allowlist** used by the Project Files browser and the **Download project** ZIP, so what you see in the file browser is what git will stage.

### Project Git sync vs. site packs

These are two unrelated features that both touch `project/` — do not confuse them:

| | Project Git sync (this page) | [Hub site packs](../06-plugin-economy/theme-and-template-packs.md) |
|---|---|---|
| **Moves** | Only `project/` files, to/from a git remote | Collections (`content/collections/`) **and** `project/` files, as a versioned package |
| **Use case** | Version-control your site's code, deploy via git, edit `project/` in an external editor/CI | Bootstrap or update a site's **content model and starter content** across installs |
| **Content/media** | Never touched | Schemas always install; demo **entries** are opt-in |
| **Where** | Settings → Project → Git | Plugins → Hub (catalog, upload pack, updates) |

If you need to move your content model, sample entries, or a reusable site structure to another Birkly install, package it as a **site pack** — Git sync will not carry your collections or media along.

## Requirements

- The **`git`** command must be installed and on the web server's `PATH`.
- PHP must be able to spawn processes (`proc_open` not disabled) — Birkly orchestrates git as a subprocess and never accepts raw flags from the browser.
- `project/` must be writable by the web server.

The Git section runs a capability check before showing the connect form and explains which requirement is missing:

| Message | Meaning |
|---|---|
| "The `git` command is not installed on this server." | Install git on the host and reload the page. |
| "This server blocks PHP from running external programs (`proc_open` is disabled)..." | Ask your host to allow `proc_open`, or manage `project/` another way (manual upload/download, or your own deploy pipeline). |
| "The `project/` folder is not writable by the web server." | Fix folder permissions. |

No Birkly Cloud account or connectivity is required — this works the same way on a local PHP install, Docker, or any self-hosted deployment, using your own instance credentials.

## Connect

1. Go to **Settings → Project → Git**.
2. Choose a **Provider**. The same engine drives every option over plain HTTPS or SSH (Buzz uses standard git Smart HTTP on the relay):

| Group | Providers |
|---|---|
| **Popular** | GitHub · GitLab · Bitbucket |
| **Open source & European** | Codeberg · Gitea · Forgejo · SourceHut |
| **AI-native** | **Buzz** (Block’s open Slack/GitHub alternative) |
| **Other** | Any generic git remote |

3. Enter the **Repository URL** and the **Branch** (defaults to `main`). Examples:
   - GitHub: `https://github.com/your-org/your-site.git`
   - Codeberg: `https://codeberg.org/your-org/your-site.git`
   - Buzz: `https://your-relay.example/git/<owner-pubkey>/<repo>`
4. Choose **Authentication** (see table below). Provider-specific username hints (e.g. Bitbucket `x-token-auth`, GitLab `oauth2`) are filled in for you and can be edited.
5. Click **Connect**. Birkly initializes a local repository in `project/`, writes a `.gitignore` (only if one doesn't already exist), sets the remote, and tests connectivity.

| Authentication | Use it for |
|---|---|
| **Access token (HTTPS)** | A personal access token, app password, or deploy token with read/write access. Optionally set a **Username** if your host requires one alongside the token. |
| **SSH private key** | A deploy key with write access. Birkly writes it to a private temporary file only while a git command runs, then deletes it. |
| **Nostr key (Buzz / NIP-98)** | Buzz relay auth. Requires `git-credential-nostr` on the server’s PATH. Store an `nsec` (or hex) key — encrypted at rest, never written into `project/`. |
| **None** | A public read-only remote, or a local/mounted bare repository — you won't be able to push without write access some other way. |

On first connect, Birkly writes a `.gitignore` template into `project/` that excludes server code, secrets, and CMS data paths (`content/`, `media/`, `users/`, `settings/`, `logs/`, `cache/`, `data/`, `backups/`) — this keeps the repository clean even if it is later used outside Birkly.

Re-opening the Git section after connecting shows **Edit connection** instead of the connect form. Leaving the token or SSH key field blank when editing keeps the currently stored secret.

## Status

Once connected, the Git section shows:

| Field | Meaning |
|---|---|
| **Remote** | The configured URL, with any embedded credentials redacted |
| **Branch** | The tracked branch |
| **Authentication** | Access token (with a masked hint) or SSH key, or None |
| **Local changes** | Files in `project/` that differ from the last commit and are not yet pushed |
| **To push** | Commits ahead of the remote branch |
| **To pull** | Commits behind the remote branch |
| **Last commit** | Message and short SHA of the most recent local commit |
| **Last push** / **Last pull** | When this install last pushed or pulled, and who triggered it |

Use **Refresh status** or **Test connection** to re-check without pushing or pulling.

## Push

**Push = Birkly wins.** Pushing stages every allowlisted file currently in `project/`, commits any changes (with an optional commit message), and updates the remote branch to match.

1. Click **Push to remote**.
2. Optionally enter a commit message (defaults to "Update project files from Birkly").
3. If the remote has commits Birkly doesn't have yet, you'll see a conflict instead of a silent overwrite — see [Conflicts](#conflicts).
4. On success, the remote branch now matches `project/` exactly (for the allowlisted files).

If there is nothing new to commit and the remote already matches, push reports "Nothing to push."

## Pull

**Pull = git wins.** Pulling replaces the matching files in `project/` with the remote branch's version.

1. Click **Pull from remote** — this fetches and shows an **incoming changes** preview (added/modified/deleted files) without touching `project/` yet.
2. Review the file list.
3. Click **Apply changes** to fast-forward `project/` onto the remote branch, or **Cancel** to back out.
4. After applying, Birkly invalidates the server-rendering (SSR) cache automatically so visitors see the updated pages.

If Birkly has local changes that would be overwritten and the remote has also moved, pull surfaces a conflict instead of applying — see below.

## Conflicts

A conflict means **both** Birkly's `project/` and the remote branch changed since they last agreed, so applying either side blindly would silently discard changes. Birkly detects this on push and pull and blocks with a **Keep Birkly / Keep remote / Cancel** choice — nothing is changed until you pick a side.

The conflict panel shows:

- Files changed **in Birkly** (local, not yet pushed)
- Files changed **on the remote**
- Files changed **on both sides** (the ones that would actually be affected)
- Any unfinished merge from a previous conflict

| Choice | Effect |
|---|---|
| **Keep Birkly** | The current `project/` files win. Birkly commits them (merging over the remote's history) and pushes, so the remote ends up matching Birkly. |
| **Keep remote** | `project/` is reset to match the remote branch exactly. Local-only files under `project/` and any uncommitted local edits to the conflicting files are discarded. |
| **Cancel** | Nothing changes. Resolve manually (e.g. edit files, then push or pull again) or try the other direction. |

Files that can't be merged line-by-line (images, or any file where both sides changed the same bytes) always take the **whole side** you choose — there is no partial/manual merge UI for individual files.

## Disconnect

**Disconnect** clears the stored remote URL and encrypted credentials (token or SSH key) and removes the git remote. It does **not** delete the local `project/.git` history — the repository stays in place in case you want to reconnect to the same or a different remote later.

## Security

- Credentials (access token or SSH private key) are **encrypted at rest** on the instance, in `settings/project_git.json` — never inside `project/`, so they can never be committed, pulled by someone else, or served publicly.
- An SSH key is written to a private (`0600`) temporary file only for the duration of a git command, then deleted.
- The remote URL, when shown in the UI or written to logs, has any embedded username/password redacted.
- `project/.git/` (and any `.git/` path) is denied at the HTTP layer by the server router, in addition to the admin file browser already refusing to open dot-segment paths — the repository's internal git objects are never publicly servable.
- Only HTTPS and SSH git URLs are accepted (plus local/mounted paths for testing); no other git transport can be driven from the UI.
- Connect, push, pull, and disconnect require the **`manage_settings`** permission (Admin role by default) and a valid CSRF token; every action is recorded in the security/audit log and in the Project **Activity** section.

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Git section shows "Git sync unavailable" | See [Requirements](#requirements) — install `git`, enable `proc_open`, or fix `project/` permissions |
| "Authentication failed" on push/pull/test | Token or SSH key is wrong, expired, or lacks write access to the repository |
| "Could not reach the remote" | Check the repository URL and that this server has outbound network access to the git host |
| "Repository not found" | Check the URL, and that the token/key has access to that specific repository |
| "The remote has newer commits — pull before pushing" | Pull first (or resolve the conflict prompt if one appears) |
| Push/pull reports a conflict every time | A previous merge may be unfinished — check **Unfinished merge** in the conflict panel and choose a side to clear it |
| Content or media didn't come across after pull | Expected — Git sync never touches `content/` or `media/`. Use a [site pack](../06-plugin-economy/theme-and-template-packs.md) to move content/media |

## Advanced Users

**API:** `api/project_git.php` — actions `capability`, `status` (read-only, `read_settings`), and `connect`, `test`, `disconnect`, `push`, `pull_preview`, `pull_apply`, `resolve_conflict` (mutating, `manage_settings` + CSRF).

**Engine:** `core/project_git.php` (`ProjectGit` class) wraps the system `git` binary with a fixed argument list per operation — the UI never sends arbitrary flags. It stages only paths that pass the same allowlist as `core/project_site_filesystem.php`, runs network operations (`fetch`, `push`, `ls-remote`) with `GIT_TERMINAL_PROMPT=0` so a bad credential fails fast instead of hanging on a prompt, and scopes HTTPS token auth to the remote's exact host via a git `http.<url>.extraheader` config so a redirect to another host can't see the token.

**Settings storage:** `core/project_git_settings.php` reads/writes `settings/project_git.json`. Tokens and SSH keys are encrypted with the same secret-box helper used elsewhere in Birkly; the public config (`birkly_project_git_public_config()`) sent to the browser never includes the decrypted secret, only a `has_token` / `has_ssh_key` flag and a short masked hint.

**Conflict detection:** a conflict is raised when `git status` shows unmerged paths, or when the branch is both **ahead** (local commits) and **behind** (remote commits) at the same time, or when the remote moved while `project/` has uncommitted allowlisted changes. See `birkly_project_git_conflict()`.

**`.git` HTTP deny:** `server-router.php` calls `birkly_deny_git_metadata_request()` before serving any request, blocking `project/.git/**` (and any other `.git/` path) regardless of hosting setup.

## Related

- [Settings](settings.md) — full Settings tab reference
- [Hub, themes, and site packs](../06-plugin-economy/theme-and-template-packs.md) — the path for content/media across installs
- [AI site builder](ai-site-builder.md) — MCP tools that also read/write `project/`
- [Security](../07-operations/security.md)
