import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

async function generateUserManual() {
  console.log('Generating 3Sci Infographics Studio General User Manual PDF...');

  const outputPath = path.resolve('./3Sci_Infographics_Studio_User_Manual.pdf');
  
  // Read logo if present
  let logoBase64 = '';
  const logoPath = './templates/logo_white.png';
  if (fs.existsSync(logoPath)) {
    const buf = fs.readFileSync(logoPath);
    logoBase64 = `data:image/png;base64,${buf.toString('base64')}`;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 18mm 16mm;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #080f17;
      color: #f1f5f9;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 11pt;
      line-height: 1.55;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 255mm;
    }
    .page:last-child { page-break-after: avoid; }

    /* Header & Cover */
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #1c2b3d;
      padding-bottom: 12px;
      margin-bottom: 24px;
    }
    .brand-wrap { display: flex; align-items: center; gap: 12px; }
    .brand-logo { height: 32px; width: auto; }
    .brand-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 16pt;
      font-weight: 800;
      color: #00e5be;
      letter-spacing: 0.5px;
    }
    .doc-badge {
      font-size: 9pt;
      font-weight: 800;
      background: #111e2e;
      color: #38bdf8;
      border: 1px solid #23374c;
      padding: 4px 12px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .cover-body {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 16px;
      padding: 40px 0;
    }
    .doc-kicker {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 14pt;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .doc-headline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 34pt;
      font-weight: 800;
      line-height: 1.15;
      color: #ffffff;
      letter-spacing: -1px;
    }
    .doc-summary {
      font-size: 14pt;
      color: #94a3b8;
      max-width: 90%;
      line-height: 1.5;
      margin-top: 8px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      background: #0e1724;
      border: 1px solid #1c2b3d;
      border-radius: 8px;
      padding: 16px 20px;
      margin-top: 30px;
    }
    .meta-item { display: flex; flex-direction: column; gap: 4px; }
    .meta-label { font-size: 8.5pt; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-val { font-size: 11pt; font-weight: 700; color: #f1f5f9; }

    /* Body Elements */
    h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18pt;
      font-weight: 800;
      color: #00e5be;
      border-bottom: 1.5px solid #1c2b3d;
      padding-bottom: 6px;
      margin-top: 20px;
      margin-bottom: 14px;
    }
    h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 13pt;
      font-weight: 700;
      color: #38bdf8;
      margin-top: 14px;
      margin-bottom: 6px;
    }
    p { margin-bottom: 10px; color: #cbd5e1; }
    ul { margin-left: 20px; margin-bottom: 14px; color: #cbd5e1; }
    li { margin-bottom: 6px; }

    .callout {
      background: #0f1925;
      border-left: 4px solid #00e5be;
      border-radius: 6px;
      padding: 12px 18px;
      margin: 14px 0;
      color: #e2e8f0;
      font-size: 10.5pt;
    }

    .step-card {
      background: #0e1724;
      border: 1px solid #1c2b3d;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 12px;
    }
    .step-header {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
      font-size: 11.5pt;
      color: #ffffff;
      margin-bottom: 6px;
    }
    .step-num {
      background: #00e5be;
      color: #080f17;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 9pt;
      font-weight: 800;
    }

    .tbl {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 10pt;
    }
    .tbl th {
      background: #111e2e;
      color: #38bdf8;
      text-align: left;
      padding: 8px 12px;
      border: 1px solid #1c2b3d;
      font-weight: 800;
    }
    .tbl td {
      padding: 8px 12px;
      border: 1px solid #1c2b3d;
      color: #cbd5e1;
      background: #09121d;
    }

    .doc-footer {
      border-top: 1px solid #1c2b3d;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: COVER -->
  <div class="page">
    <div class="doc-header">
      <div class="brand-wrap">
        ${logoBase64 ? `<img src="${logoBase64}" class="brand-logo" alt="3Sci Logo">` : ''}
        <div class="brand-title">3SCI VENTURE STUDIO</div>
      </div>
      <div class="doc-badge">WORK HACK #3 • USER MANUAL</div>
    </div>

    <div class="cover-body">
      <div class="doc-kicker">Operational Playbook</div>
      <h1 class="doc-headline">STRATEGIC INFOGRAPHICS STUDIO</h1>
      <p class="doc-summary">
        A client-side interactive platform for generating high-impact comparative infographics, multi-card executive series, and 4K visual assets for products, contenders, and public figures.
      </p>

      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Product Series</span>
          <span class="meta-val">3Sci Work Hacks</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Classification</span>
          <span class="meta-val">General User Manual</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Primary AI Engine</span>
          <span class="meta-val">Google Gemini 3.8 Flash</span>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <span>3sci.com • Venture Studio Innovation Tools</span>
      <span>Confidential & Proprietary</span>
    </div>
  </div>

  <!-- PAGE 2: USER WORKFLOW -->
  <div class="page">
    <div class="doc-header">
      <div class="brand-title">3SCI INFOGRAPHICS STUDIO</div>
      <div class="doc-badge">END-USER OPERATIONS</div>
    </div>

    <div>
      <h2>1. Overview & Core Mission</h2>
      <p>
        The 3Sci Infographics Studio removes the manual design bottleneck when creating high-density visual briefings. Whether comparing consumer smartphones, SaaS solutions, historical athletes, or emerging market disruptors, the studio structures data into an executive 3-column layout.
      </p>

      <div class="callout">
        <strong>Zero-Setup Execution:</strong> The application runs entirely within your web browser on GitHub Pages. No Node.js runtime, terminal commands, or database connections are required for everyday operations.
      </div>

      <h2>2. Step-by-Step Workflow</h2>

      <div class="step-card">
        <div class="step-header"><span class="step-num">1</span> Enter Your Google Gemini API Key</div>
        <p>Paste your API key into the top header input bar. Your key stays saved in your local browser storage for future visits.</p>
      </div>

      <div class="step-card">
        <div class="step-header"><span class="step-num">2</span> Define Subject & Analytical Angle</div>
        <p>Type your target topic (e.g., <em>"Top 15 EV Models 2026"</em> or <em>"Top 15 Footballers of All Time"</em>) and choose one of the 18 specialized analytical lenses from the dropdown menu.</p>
      </div>

      <div class="step-card">
        <div class="step-header"><span class="step-num">3</span> Select Card Count & Directives</div>
        <p>Select between 1 standalone card, a 2-part comparison, a 3-part series, or a 5-part deep dive. Provide optional focus points or custom parameters in the directives box.</p>
      </div>

      <div class="step-card">
        <div class="step-header"><span class="step-num">4</span> Run Generation or Copy Prompt</div>
        <p>Click <strong>⚡ Generate with AI</strong> to populate the series in 3–5 seconds. If operating air-gapped or without an API key, click <strong>📋 Generate / Copy Prompt</strong> to paste into ChatGPT, Claude, or Perplexity.</p>
      </div>

      <div class="step-card">
        <div class="step-header"><span class="step-num">5</span> Review, In-Place Edit & Export 4K PNG</div>
        <p>Click directly on any text or metric on the canvas to refine wording. Click <strong>⚡ Export 4K PNG</strong> to download a clean, high-resolution 2400×1350 asset ready for slide decks or social feeds.</p>
      </div>
    </div>

    <div class="doc-footer">
      <span>3sci.com • General User Manual</span>
      <span>Page 2 of 3</span>
    </div>
  </div>

  <!-- PAGE 3: FRAMEWORKS & BEST PRACTICES -->
  <div class="page">
    <div class="doc-header">
      <div class="brand-title">3SCI INFOGRAPHICS STUDIO</div>
      <div class="doc-badge">FRAMEWORKS & EXPORT</div>
    </div>

    <div>
      <h2>3. The 18 Analytical Angles</h2>
      <p>The studio adapts column titles, metric definitions, and quadrant categories according to your chosen analytical framework:</p>

      <table class="tbl">
        <thead>
          <tr>
            <th style="width: 32%;">Analytical Lens</th>
            <th>Primary Objective</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Product & Price Comparison</strong></td>
            <td>Contrasts flagship features, tier packaging, and price-to-value elasticity.</td>
          </tr>
          <tr>
            <td><strong>Personalities & Achievements</strong></td>
            <td>Ranks historic figures, athletes, or creators by milestones and global legacy.</td>
          </tr>
          <tr>
            <td><strong>SWOT Analysis</strong></td>
            <td>Forensic 4-quadrant balance evaluating strengths, flaws, and competitive threats.</td>
          </tr>
          <tr>
            <td><strong>Market Share Analysis</strong></td>
            <td>Maps volume versus value capture and expansion velocity across contenders.</td>
          </tr>
          <tr>
            <td><strong>Feature Comparison</strong></td>
            <td>Identifies capability parity, technical debt, and commoditization risks.</td>
          </tr>
          <tr>
            <td><strong>Political Stance & Policies</strong></td>
            <td>Synthesizes ideological alignments, policy platforms, and voter coalitions.</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Best Practices for 4K PNG Exports</h2>
      <ul>
        <li><strong>Editing Direct on Canvas:</strong> You do not need to alter raw code or reload to tweak copy. Simply click any title, percentage, or cell to edit inline.</li>
        <li><strong>Multi-Card Series Navigation:</strong> Use the filmstrip tabs across the top to preview and export Card 1, Card 2, and Card 3 individually.</li>
        <li><strong>Clean Canvas Guarantee:</strong> The PNG export pipeline uses an isolated offscreen renderer that eliminates canvas taint errors and renders crisp typography regardless of local browser zoom.</li>
      </ul>
    </div>

    <div class="doc-footer">
      <span>3sci.com • General User Manual</span>
      <span>Page 3 of 3</span>
    </div>
  </div>

</body>
</html>
`;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,
    margin: { top: '0', bottom: '0', left: '0', right: '0' }
  });

  await browser.close();
  console.log(`User Manual PDF generated successfully: ${outputPath}`);
}

generateUserManual();