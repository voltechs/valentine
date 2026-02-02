# Valentine Website 💝

A fun, interactive valentine's day proposal website with floating hearts, dodging buttons, and fireworks.

## Features

- **Dodging "No" button** - tries to escape the cursor, grows the "Yes" button bigger with each attempt
- **Smooth floating hearts** - sine wave animations for natural bubble-like motion
- **Fireworks celebration** - GPU-accelerated CSS fireworks when they click "Yes"
- **Sound effect** - plays a celebratory "yay" sound on acceptance
- **Click-to-firework** - after saying yes, clicking anywhere creates more fireworks

## Setup

1. Make sure you have the audio file:
   - Download your "yay" sound effect
   - Save it as `yay.m4a` in the same folder as `valentine.html`
   - Trim any silence from the start for instant playback

2. Open `valentine.html` in a browser - that's it!

## Customization

Edit these lines in `valentine.html`:

- **Line 256**: `"He knows you're an indecisive queen"` - change the opening text
- **Line 257**: `"Will you be my valentine?"` - change the question
- **Line 266**: `"pls say yes"` - change the caption
- **Line 488**: `yayAudio.volume = 0.7;` - adjust sound volume (0.0 to 1.0)

## Deployment

### GitHub Pages (Free & Easy)
1. Rename `valentine.html` to `index.html`
2. Create a new GitHub repository
3. Upload `index.html` and `yay.m4a`
4. Enable GitHub Pages in Settings → Pages
5. Your site will be at `https://yourusername.github.io/your-repo-name/`

### Other Free Options
- **Netlify Drop**: Drag files to [netlify.com/drop](https://app.netlify.com/drop)
- **Vercel**: Deploy via [vercel.com](https://vercel.com)
- **Cloudflare Pages**: Deploy via [pages.cloudflare.com](https://pages.cloudflare.com)

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Audio requires user interaction to play (browser security policy).

---

Made with 💕
