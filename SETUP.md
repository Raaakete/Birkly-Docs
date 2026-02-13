# Repository Setup Checklist

Follow these steps to complete the setup of your Birkly Docs repository.

## ✅ Step 1: Provide Repository URL

**Tell me your GitHub repository URL**, for example:
- `https://github.com/Raaakete/Birkly-Docs.git`
- Or `git@github.com:Raaakete/Birkly-Docs.git`

Once I have this, I can help you push the docs.

## ✅ Step 2: Initial Git Setup

After I push the initial files, you can verify with:
```bash
cd /path/to/birkly-docs
git status
git log
```

## ✅ Step 3: Update package.json

Edit `package.json` and update:
- `"repository.url"` with your actual GitHub repo URL
- `"author"` with your name/org

## ✅ Step 4: Add to CMS

In your CMS repository:
```bash
git submodule add https://github.com/Raaakete/Birkly-Docs.git docs
```

Then configure your CMS to serve docs from `docs/` folder (see SYNC.md).

## ✅ Step 5: Add to Website

Either:
- Add as submodule: `git submodule add https://github.com/Raaakete/Birkly-Docs.git docs`
- Or create a sync script (see SYNC.md)

## 🎉 Done!

Your docs are now:
- ✅ In a separate repository
- ✅ Ready to be consumed by CMS and website via git submodule or sync script
- ✅ Version-controlled independently

## Next Steps

- Edit docs in this repo
- Push changes → CMS/website can pull updates
- Update submodules in CMS/website when you want to sync
- See `SYNC.md` for detailed integration instructions
