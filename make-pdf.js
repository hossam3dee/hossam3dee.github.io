const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set high-resolution desktop viewport so Tailwind desktop grid (lg: 1024px+) triggers cleanly
  await page.setViewport({
    width: 1440,
    height: 1080,
    deviceScaleFactor: 2
  });
  
  // Point to your resume.html file
  const filePath = `file://${path.resolve(__dirname, 'resume.html')}`;
  
  // Navigate to the file and wait until all assets (images, fonts) load
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  
  // Force screen media type to preserve full desktop colors, glassmorphism & layout
  await page.emulateMediaType('screen');

  // Export exact 1:1 wide desktop PDF replica
  await page.pdf({
    path: 'Hossam_Omar_CV.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  await browser.close();
  console.log('Success! Hossam_Omar_CV.pdf was created.');
})();