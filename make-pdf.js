const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set ultra-wide high-resolution viewport (1600px width)
  await page.setViewport({
    width: 1600,
    height: 1200,
    deviceScaleFactor: 2
  });
  
  // Point to your resume.html file
  const filePath = `file://${path.resolve(__dirname, 'resume.html')}`;
  
  // Navigate to the file and wait until all assets load
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  
  // Force screen media type to preserve full background, glassmorphism & layout
  await page.emulateMediaType('screen');

  // Export ultra-wide custom PDF (1400px x 1050px wide layout)
  await page.pdf({
    path: 'Hossam_Omar_CV.pdf',
    width: '1400px',
    height: '1050px',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  await browser.close();
  console.log('Success! Ultra-wide Hossam_Omar_CV.pdf was created.');
})();