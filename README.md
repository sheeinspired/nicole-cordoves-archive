# Nicole Cordoves — The Career Archive

A modular, fan-made archive website based on the structure and browsing experience of the Miho Cosplay project.

## Folder structure

```text
nicole-cordovs-archive/
├── index.html
├── css/
│   ├── variables.css
│   ├── style.css
│   ├── intro.css
│   ├── navbar.css
│   ├── hero.css
│   ├── marquee.css
│   ├── about.css
│   ├── timeline.css
│   ├── career.css
│   ├── articles.css
│   ├── gallery.css
│   ├── social.css
│   ├── contact.css
│   └── responsive.css
├── data/
│   ├── journey.json
│   ├── career.json
│   ├── articles.json
│   └── photos.json
├── js/
│   ├── main.js
│   ├── journey.js
│   ├── career.js
│   ├── articles.js
│   └── gallery.js
└── images/
    ├── hero/
    └── photos/
```

## Preview on your computer

Because the site loads JSON files with `fetch()`, don't open `index.html` by double-clicking it.

1. Open this folder in Visual Studio Code.
2. Install the free **Live Server** extension if you don't already have it.
3. Right-click `index.html`.
4. Choose **Open with Live Server**.

You can also run `python -m http.server 8000` in this folder and open `http://localhost:8000`.

## Add Nicole photos

The first version uses designed placeholders instead of borrowing photos from another website.

1. Put image files in `images/photos/`.
2. Open `data/photos.json`.
3. Change each `image` value to the exact filename you added.
4. Use photos you own or have permission to publish.

To use a hero photo, add your chosen image and update the `.hero-image-frame` styling in `css/hero.css`.

## Edit the website content

- `data/journey.json` — timeline milestones
- `data/career.json` — career category cards
- `data/articles.json` — articles, interviews, publications and links
- `data/photos.json` — gallery items
- `css/` — visual design, with separate files for each section
- `js/` — navigation and interactive features

## Important

This is an independent fan-made archive. It is not affiliated with or endorsed by Nicole Cordoves or her representatives. The article links and career information were carried over from the supplied draft HTML and have not been independently re-verified in this build. Check dates, titles, credits and links before publishing.
