import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

async function generateTechnicalManual() {
  console.log('Generating 3Sci Infographics Studio Technical Manual PDF...');

  const outputPath = path.resolve('./3Sci_Infographics_Studio_Technical_Manual.pdf');
  
  // Read index.html for full verbatim inclusion
  let indexHtmlCode = '';
  if (fs.existsSync('./index.html')) {
    indexHtmlCode = fs.readFileSync('./index.html', 'utf-8');
  } else {
    indexHtmlCode = '/* index.html not found in current working directory */';
  }

  // Escape HTML entities for the code block
  const escapedCode = indexHtmlCode
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

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
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 16mm 14mm;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #080f17;
      color: #f1f5f9;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 260mm;
    }
    .page:last-child { page-break-after: avoid; }

    /* Header */
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #1c2b3d;
      padding-bottom: 10px;
      margin-bottom: 18px;
    }
    .brand-wrap { display: flex; align-items: center; gap: 12px; }
    .brand-logo { height: 28px; width: auto; }
    .brand-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 15pt;
      font-weight: 800;
      color: #00e5be;
    }
    .doc-badge {
      font-size: 8.5pt;
      font-weight: 800;
      background: #111e2e;
      color: #38bdf8;
      border: 1px solid #23374c;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    /* Cover */
    .cover-body {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 14px;
      padding: 30px 0;
    }
    .doc-kicker {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 13pt;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .doc-headline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 32pt;
      font-weight: 800;
      line-height: 1.15;
      color: #ffffff;
      letter-spacing: -1px;
    }
    .doc-summary {
      font-size: 13pt;
      color: #94a3b8;
      max-width: 90%;
      line-height: 1.5;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      background: #0e1724;
      border: 1px solid #1c2b3d;
      border-radius: 8px;
      padding: 14px 18px;
      margin-top: 24px;
    }
    .meta-item { display: flex; flex-direction: column; gap: 3px; }
    .meta-label { font-size: 8pt; font-weight: 700; color: #64748b; text-transform: uppercase; }
    .meta-val { font-size: 10pt; font-weight: 700; color: #f1f5f9; }

    /* Typography & Tables */
    h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 16pt;
      font-weight: 800;
      color: #00e5be;
      border-bottom: 1.5px solid #1c2b3d;
      padding-bottom: 5px;
      margin-top: 14px;
      margin-bottom: 10px;
    }
    h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 12pt;
      font-weight: 700;
      color: #38bdf8;
      margin-top: 10px;
      margin-bottom: 4px;
    }
    p { margin-bottom: 8px; color: #cbd5e1; }
    ul { margin-left: 18px; margin-bottom: 10px; color: #cbd5e1; }
    li { margin-bottom: 4px; }

    .tbl {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 9pt;
    }
    .tbl th {
      background: #111e2e;
      color: #38bdf8;
      text-align: left;
      padding: 7px 10px;
      border: 1px solid #1c2b3d;
      font-weight: 800;
    }
    .tbl td {
      padding: 6px 10px;
      border: 1px solid #1c2b3d;
      color: #cbd5e1;
      background: #09121d;
    }

    .code-block {
      background: #050a10;
      border: 1px solid #1e2c3c;
      border-radius: 6px;
      padding: 10px 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.2pt;
      line-height: 1.38;
      color: #e2e8f0;
      white-space: pre-wrap;
      word-break: break-all;
      overflow: hidden;
      margin-top: 6px;
    }

    .doc-footer {
      border-top: 1px solid #1c2b3d;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
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
      <div class="doc-badge">WORK HACK #3 • ARCHITECTURE MANUAL</div>
    </div>

    <div class="cover-body">
      <div class="doc-kicker">Technical Architecture & Full Codebase</div>
      <h1 class="doc-headline">STRATEGIC INFOGRAPHICS STUDIO</h1>
      <p class="doc-summary">
        Full system specifications, client-side reactive state engine, Gemini API integration, CORS-clean canvas export pipeline, and annotated source code for Work Hack #3.
      </p>

      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Architecture</span>
          <span class="meta-val">Zero-Backend SPA (Static)</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Export Native Resolution</span>
          <span class="meta-val">2400 × 1350 px (16:9 4K)</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Hosting Target</span>
          <span class="meta-val">GitHub Pages</span>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <span>3sci.com • Technical Setup Manual</span>
      <span>Confidential & Proprietary</span>
    </div>
  </div>

  <!-- PAGE 2: ARCHITECTURE SPECIFICATIONS -->
  <div class="page">
    <div class="doc-header">
      <div class="brand-title">3SCI INFOGRAPHICS STUDIO</div>
      <div class="doc-badge">SYSTEM ARCHITECTURE</div>
    </div>

    <div>
      <h2>1. Architecture Overview</h2>
      <p>
        The Infographics Studio is engineered as an entirely self-contained single-page application (SPA). Unlike the initial command-line Puppeteer batch runner, this application eliminates all runtime server dependencies while preserving pixel-perfect 2400×1350 canvas generation.
      </p>

      <table class="tbl">
        <thead>
          <tr>
            <th style="width: 25%;">Subsystem</th>
            <th style="width: 30%;">Component</th>
            <th>Technical Role & Behavior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Canvas Scaling</strong></td>
            <td><code>ResizeObserver</code> Engine</td>
            <td>Dynamically calculates viewport dimensions and computes a uniform CSS matrix scale factor to fit any display without layout degradation.</td>
          </tr>
          <tr>
            <td><strong>State Management</strong></td>
            <td>In-Memory <code>cards[]</code> Array</td>
            <td>Maintains clean isolation per card; ensures no stale project state is cached between visits while persisting the user's Gemini API key.</td>
          </tr>
          <tr>
            <td><strong>AI Synthesis</strong></td>
            <td>Google Gemini 3.8 Flash</td>
            <td>Issues direct client-side fetch requests with <code>response_mime_type: "application/json"</code> to guarantee schema-valid parsing.</td>
          </tr>
          <tr>
            <td><strong>Export Engine</strong></td>
            <td>Offscreen DOM Clone + <code>html2canvas</code></td>
            <td>Clones the 2400×1350 DOM into a detached container, substitutes local asset pointers with SVG vector badges to prevent canvas tainting, and invokes <code>toBlob()</code>.</td>
          </tr>
        </tbody>
      </table>

      <h2>2. Anti-Taint PNG Export Pipeline</h2>
      <p>
        Exporting canvases in client-side applications typically fails with security exceptions (<em>"Tainted canvases may not be exported"</em>) when assets are loaded via local <code>file:///</code> paths. The studio bypasses this via a 4-step sequence:
      </p>
      <ul>
        <li><strong>Step 1:</strong> An offscreen DOM container is created at <code>position: fixed; left: -10000px; width: 2400px; height: 1350px;</code>.</li>
        <li><strong>Step 2:</strong> The active canvas DOM is deep-cloned without CSS transform scaling.</li>
        <li><strong>Step 3:</strong> All <code>&lt;img&gt;</code> elements are replaced with inline styled vector containers, eliminating external cross-origin taint.</li>
        <li><strong>Step 4:</strong> <code>html2canvas</code> renders with <code>allowTaint: false</code>, and output is streamed through <code>canvas.toBlob()</code> to trigger a native binary file download.</li>
      </ul>
    </div>

    <div class="doc-footer">
      <span>3sci.com • Technical Setup Manual</span>
      <span>Page 2 of 5</span>
    </div>
  </div>

  <!-- PAGE 3: FULL CODE LISTING (PART 1) -->
  <div class="page">
    <div class="doc-header">
      <div class="brand-title">3SCI INFOGRAPHICS STUDIO</div>
      <div class="doc-badge">SOURCE CODE • PART 1</div>
    </div>

    <div>
      <h2>3. Complete Source Code: index.html (Head & Styles)</h2>
      <div class="code-block">${escapedCode.substring(0, 4800)}</div>
    </div>

    <div class="doc-footer">
      <span>3sci.com • Technical Setup Manual</span>
      <span>Page 3 of 5</span>
    </div>
  </div>

  <!-- PAGE 4: FULL CODE LISTING (PART 2) -->
  <div class="page">
    <div class="doc-header">
      <div class="brand-title">3SCI INFOGRAPHICS STUDIO</div>
      <div class="doc-badge">SOURCE CODE • PART 2</div>
    </div>

    <div>
      <h2>4. Complete Source Code: index.html (Body Markup & UI)</h2>
      <div class="code-block">${escapedCode.substring(4800, 10200)}</div>
    </div>

    <div class="doc-footer">
      <span>3sci.com • Technical Setup Manual</span>
      <span>Page 4 of 5</span>
    </div>
  </div>

  <!-- PAGE 5: FULL CODE LISTING (PART 3) -->
  <div class="page">
    <div class="doc-header">
      <div class="brand-title">3SCI INFOGRAPHICS STUDIO</div>
      <div class="doc-badge">SOURCE CODE • PART 3</div>
    </div>

    <div>
      <h2>5. Complete Source Code: index.html (Scripts & Export Logic)</h2>
      <div class="code-block">${escapedCode.substring(10200)}</div>
    </div>

    <div class="doc-footer">
      <span>3sci.com • Technical Setup Manual</span>
      <span>Page 5 of 5</span>
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
  console.log(`Technical Manual PDF generated successfully: ${outputPath}`);
}

generateTechnicalManual();