const { Storage } = require('@google-cloud/storage');
const lakeBucketName = 'wefly-lake';

const getPilotIcon = async (req, res) => {
    const pilotname = req.query.pilotname;
    if (!pilotname) {
        return res.status(400).send('pilotname is required');
    }

    const fileName = `pilot_icons/${pilotname}.jpg`;
    const storage = new Storage();
    const bucket = storage.bucket(lakeBucketName);
    const file = bucket.file(fileName);

    try {
        // GCSからファイルの存在を確認
        const [exists] = await file.exists();
        if (!exists) {
            return res.status(404).send('Icon not found');
        }

        // ファイルの読み込みとクライアントへのストリーム送信
        res.setHeader('Content-Type', 'image/jpeg');
        const stream = file.createReadStream();
        stream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving the icon');
    }
}

const registerPilotIconEndpoint = (app) => {
    app.get('/api/track/piloticon', async (req, res) => {
        getPilotIcon(req, res);
    });
};

module.exports = { registerPilotIconEndpoint };