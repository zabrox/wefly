const { Storage } = require('@google-cloud/storage');

class GcsUploader {
    #bucketName;
    #filePath;

    constructor(bucketName, filePath) {
        this.#bucketName = bucketName;
        this.#filePath = filePath;
    }

    async upload(data) {
        const storage = new Storage();
        const bucket = storage.bucket(this.#bucketName);
        const file = bucket.file(this.#filePath);

        await file.save(data, {
            resumable: false,
            validation: false,
        });

        console.log(`File saved to ${this.#bucketName}/${this.#filePath}`);
    }
}

module.exports = { GcsUploader };
