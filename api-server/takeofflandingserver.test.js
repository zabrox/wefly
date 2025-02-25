const request = require('supertest');
const { app } = require('./server');
const Firestore = require('@google-cloud/firestore');
const { Takeoff } = require('./entity/takeoff');
const { Landing } = require('./entity/landing');

jest.mock('@google-cloud/firestore', () => {
    return function () {
        return {
            collection: jest.fn(() => ({
                get: jest.fn().mockResolvedValue({
                    docs: [
                        {
                            get: jest.fn((field) => {
                                if (field === 'name') return 'Takeoff 1';
                                if (field === 'organization') return 'Organization 1';
                                if (field === 'longitude') return 111.111;
                                if (field === 'latitude') return 11.111;
                                if (field === 'altitude') return 1111;
                                if (field === 'direction') return '南';
                                return undefined;
                            })
                        },
                        {
                            get: jest.fn((field) => {
                                if (field === 'name') return 'Takeoff 2';
                                if (field === 'organization') return 'Organization 2';
                                if (field === 'longitude') return 222.222;
                                if (field === 'latitude') return 22.222;
                                if (field === 'altitude') return 2222;
                                if (field === 'direction') return '北';
                                return undefined;
                            })
                        },
                        {
                            get: jest.fn((field) => {
                                if (field === 'name') return 'Takeoff 3';
                                if (field === 'organization') return 'Organization 3';
                                if (field === 'longitude') return 333.333;
                                if (field === 'latitude') return 33.333;
                                if (field === 'altitude') return 3333;
                                if (field === 'direction') return '東';
                                return undefined;
                            })
                        }
                    ]
                })
            }))
        };
    };
});

describe('GET /api/takeoff_landing', () => {
    it('should respond with status code 200 and return takeoffs and landings', async () => {
        const response = await request(app)
            .get('/api/takeoff_landing')
            .expect(200);

        expect(response.body.takeoffs).toEqual([
            new Takeoff('Takeoff 1', 'Organization 1', 111.111, 11.111, 1111, '南'),
            new Takeoff('Takeoff 2', 'Organization 2', 222.222, 22.222, 2222, '北'),
            new Takeoff('Takeoff 3', 'Organization 3', 333.333, 33.333, 3333, '東')
        ]);
        expect(response.body.landings).toEqual([
            new Landing('Takeoff 1', 'Organization 1', 111.111, 11.111, 1111),
            new Landing('Takeoff 2', 'Organization 2', 222.222, 22.222, 2222),
            new Landing('Takeoff 3', 'Organization 3', 333.333, 33.333, 3333)
        ]);
    });
});
