# Mohammad Alsifan & Haleema Thasneem — Wedding Invitation

A complete frontend-only React + TypeScript wedding invitation using Vite and Tailwind CSS v4. Inspired by the **experience** of the supplied references, with an original Arabic-classic visual design.

## Requirements
- Node.js 20.19+ or 22.12+ recommended
- VS Code (optional, but convenient)

## Start in VS Code
1. Extract `alsifan-haleema-invitation.zip` to a folder.
2. Open **VS Code → File → Open Folder** and choose the `alsifan-haleema-invitation` folder.
3. Open **Terminal → New Terminal**.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. Open the local URL shown in the terminal (usually `http://localhost:5173/`).
6. Click **OPEN INVITATION** on the cover.

To stop the dev server, press **Ctrl+C** in the terminal.

## Customise
- `src/config.ts`: names, parents, qualifications, date, time, address, YouTube video ID.
- `src/App.tsx`: wording and sections.
- `src/styles.css`: fonts, colours, Arabic pattern, animation, desktop/mobile layouts. It also includes the user-requested Tailwind theme and animations.
- `src/hooks/use-mobile.ts`: responsive viewport hook.
- `src/hooks/use-toast.ts`: simple self-contained notification hook.

**Music:** Select the floating music button after opening the invitation. The YouTube embed is loaded only after this action; visitors can press Play in the player. YouTube may prevent autoplay or embedding on some browsers/devices, and the video must be available for embedding. The site does not host or redistribute the song.

**Calendar:** The Add to Calendar button downloads an `.ics` file; the example event ends at 2:00 PM solely as an editable placeholder. Change `dateTimeEnd` in `src/config.ts` when the actual banquet end time is known.

**Frontend-only:** There is no RSVP database, server, login or admin panel. Google Maps, Google Fonts and YouTube need an internet connection.

## Production build
```bash
npm run build
npm run preview
```
Upload the generated `dist` folder to a static host, or connect this folder to Vercel / Netlify for deployment.

## Troubleshooting
- If `npm` is not recognised, install Node.js from https://nodejs.org and reopen VS Code.
- If port 5173 is in use, Vite will select another port; use the terminal URL.
- If the YouTube player is blank, try the video's normal YouTube page, and check whether the video owner permits embeds.
