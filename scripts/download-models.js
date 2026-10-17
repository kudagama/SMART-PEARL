const fs = require('fs');
const path = require('path');
const https = require('https');

const modelsDir = path.join(__dirname, '..', 'public', 'models');

if (!fs.existsSync(modelsDir)){
    fs.mkdirSync(modelsDir, { recursive: true });
}

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';

const files = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_expression_model-weights_manifest.json',
  'face_expression_model-shard1'
];

function downloadFile(filename) {
  const fileUrl = baseUrl + filename;
  const destPath = path.join(modelsDir, filename);

  return new Promise((resolve, reject) => {
    https.get(fileUrl, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(destPath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('Downloaded ' + filename);
          resolve();
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Redirect
        https.get(response.headers.location, (res2) => {
          const file = fs.createWriteStream(destPath);
          res2.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log('Downloaded (redirect) ' + filename);
            resolve();
          });
        });
      } else {
        console.error('Failed to download ' + filename + ' - Status code: ' + response.statusCode);
        reject(new Error('Status code: ' + response.statusCode));
      }
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      console.error('Error downloading ' + filename + ': ' + err.message);
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading face-api models...');
  for (const file of files) {
    await downloadFile(file);
  }
  console.log('All models downloaded successfully!');
}

main().catch(console.error);
