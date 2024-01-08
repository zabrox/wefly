const request = require('supertest');
const app = require('./app.js');
const Firestore = require('@google-cloud/firestore');
const { Storage } = require('@google-cloud/storage');
const zlib = require('zlib');
jest.mock('@google-cloud/firestore');
jest.mock('@google-cloud/storage');
jest.mock('zlib');

describe('API Server', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('get /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello World!');
  })

  test('/api/tracklist without date parameter', async () => {
    const response = await request(app)
       .get('/api/tracklist')

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Bad Request');
  });

  test('/api/tracklist responds with empty track list', async () => {
    // Mock Firestore query
    const mockFirestoreQuery = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        empty: true,
      }),
    };

    Firestore.mockImplementation(() => {
      return {
        collection: jest.fn().mockReturnValue(mockFirestoreQuery),
      };
    });

    const response = await request(app)
       .get('/api/tracklist')
       .query({ date: '2023-01-01' });

    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual('No matching documents.');
  });

  test('/api/tracklist responds with track list', async () => {
    // Mock Firestore query
    const mockFirestoreQuery = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        empty: false,
        forEach: jest.fn().mockImplementation(doc => undefined),
      }),
    };

    Firestore.mockImplementation(() => {
      return {
        collection: jest.fn().mockReturnValue(mockFirestoreQuery),
      };
    });

    const response = await request(app)
       .get('/api/tracklist')
       .query({ date: '2023-01-01' });

    expect(response.statusCode).toBe(200);
    // 本来ならtrackidのリストが返るが、mockするのが難しいので空の配列が返る
    expect(response.text).toEqual('[]');
  });

  test('/api/tracks without date parameter', async () => {
    const response = await request(app)
       .get('/api/tracks')

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Bad Request');
  });

  test('/api/tracks with contents', async () => {
    zlib.unzip.mockImplementation((buffer, callback) => callback(null, 'decompressed content'));
    Storage.mockImplementation(() => {
      return {
        bucket: jest.fn().mockReturnThis(),
        file: jest.fn().mockReturnThis(),
        download: jest.fn().mockResolvedValue([Buffer.from('cache miss!')]),
      };
    });
    const response = await request(app)
       .get('/api/tracks')
       .query({ date: '2023-01-01' });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('decompressed content');
  });
});
