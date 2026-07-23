const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set ultra-wide high-resolution viewport
  await page.setViewport({
    width: 1600,
    height: 1200,
    deviceScaleFactor: 2
  });
  
  // Point to your resume.html file
  const filePath = `file://${path.resolve(__dirname, 'resume.html')}`;
  
  // Navigate to the file and wait until all assets load
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  
  // Force screen media type to preserve background, glassmorphism & layout
  await page.emulateMediaType('screen');

  // Calculate exact total document height to guarantee a 100% PERFECT 1-PAGE PDF!
  const contentHeight = await page.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    return main.getBoundingClientRect().height + 60;
  });

  // Export 1-Page PDF
  await page.pdf({
    path: 'Hossam_Omar_CV.pdf',
    width: '1400px',
    height: `${Math.ceil(contentHeight)}px`,
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  await browser.close();
  console.log(`Success! 1-Page Hossam_Omar_CV.pdf was created cleanly (${Math.ceil(contentHeight)}px height).`);
})();