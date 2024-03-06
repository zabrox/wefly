const {Storage} = require('@google-cloud/storage');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const util = require('util');
const pipeline = util.promisify(require('stream').pipeline);

const storage = new Storage();
const bucketName = 'wefly-lake';
const prefix = 'paths/';
const targetDate = '20240224';

async function compressAndUploadFiles() {
    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles({prefix});

    for (let file of files) {
        if (file.name.includes(targetDate)) {
            const destination = `${file.name}.gz`;
            console.log(`Processing: ${file.name}`);

            // Download the file into a buffer
            const [contents] = await file.download();

            // Compress the contents
            const compressed = zlib.gzipSync(contents);

            // Upload the compressed file
            const blob = bucket.file(destination);
            blob.save(compressed);

            console.log(`Uploaded compressed file to: ${destination}`);
        }
    }
}

compressAndUploadFiles().catch(console.error);
