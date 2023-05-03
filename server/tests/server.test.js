const request = require('supertest');
const app = require('../server');

describe('Server', () => {
  // Test the index route
  describe('GET /', () => {
    it('should return a welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.text).toEqual('Welcome to Park Safari!');
    });
  });

  // Test the parks route
  describe('GET /parks', () => {
    it('should return an array of parks sorted by park name by default', async () => {
      const res = await request(app).get('/parks');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      // Make sure the parks are sorted by park name
      for (let i = 1; i < res.body.length; i++) {
        expect(res.body[i].park_name.localeCompare(res.body[i - 1].park_name)).toBeGreaterThanOrEqual(0);
      }
    });

    it('should return an array of parks sorted by acres if sort parameter is acres', async () => {
      const res = await request(app).get('/parks?sort=acres');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      // Make sure the parks are sorted by acres
      for (let i = 1; i < res.body.length; i++) {
        expect(res.body[i].acres).toBeLessThanOrEqual(res.body[i - 1].acres);
      }
    });

    it('should return an array of parks sorted by species count if sort parameter is species_count', async () => {
      const res = await request(app).get('/parks?sort=species_count');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      // Make sure the parks are sorted by species count
      for (let i = 1; i < res.body.length; i++) {
        expect(res.body[i].species_count).toBeLessThanOrEqual(res.body[i - 1].species_count);
      }
    });
  });

  // Test the search route
  describe('GET /search', () => {
    // Test searching by park name
    it('should return an array of parks that match the search term, sorted by park name by default', async () => {
      const searchTerm = 'Grand Canyon';
      const res = await request(app).get(`/search?searchTerm=${searchTerm}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      // Make sure the parks match the search term and are sorted by park name
      for (let i = 1; i < res.body.length; i++) {
        expect(res.body[i].park_name.toLowerCase()).toContain(searchTerm.toLowerCase());
        expect(res.body[i].park_name).toBeGreaterThan(res.body[i - 1].park_name);
      }
    });

    it('should return an array of parks in the specified state, sorted by park name by default', async () => {
      const state = 'CA';
      const res = await request(app).get(`/search?searchBy=state&searchTerm=${state}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      // Make sure the parks are in the specified state and are sorted by park name
      for (let i = 1; i < res.body.length; i++) {
        expect(res.body[i].state).toContain(state);
        expect(res.body[i].park_name.localeCompare(res.body[i - 1].park_name)).toBeGreaterThanOrEqual(0);
      }
    });

    it('should return an array of parks with the specified species, sorted by park name by default', async () => {
      const species = 'bird';
      const res = await request(app).get(`/search?searchBy=species&searchTerm=${species}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      // Make sure the parks are sorted by park name
      for (let i = 1; i < res.body.length; i++) {
        expect(res.body[i].park_name.localeCompare(res.body[i - 1].park_name)).toBeGreaterThanOrEqual(0);
      }
    });

    // Test searching by park name and sort by acres
    it('should return an array of parks that match the search term, sorted by park name by default', async () => {
      const searchTerm = 'Grand Canyon';
      const res = await request(app).get(`/search?searchTerm=${searchTerm}&sort=acres`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      // Make sure the parks match the search term and are sorted by acres
      for (let i = 1; i < res.body.length; i++) {
        expect(res.body[i].park_name.toLowerCase()).toContain(searchTerm.toLowerCase());
        expect(res.body[i].area).toBeLessThanOrEqual(res.body[i - 1].area);
      }
    });

    // Test searching by park name and sort by species count
    it('should return an array of parks that match the search term, sorted by park name by default', async () => {
      const searchTerm = 'Grand Canyon';
      const res = await request(app).get(`/search?searchTerm=${searchTerm}&sort=species_count`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      // Make sure the parks match the search term and are sorted by species count
      for (let i = 1; i < res.body.length; i++) {
        expect(res.body[i].park_name.toLowerCase()).toContain(searchTerm.toLowerCase());
        expect(res.body[i].species_count).toBeLessThanOrEqual(res.body[i - 1].species_count);
      }
    });
  });

  // Test the trails route
  describe('GET /trails', () => {
    it('should return an array of trails for the specified park code', async () => {
      const parkCode = 'ARCH';
      const res = await request(app).get(`/trails?park=${parkCode}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      // Make sure the trails all have the specified park code
      for (let i = 0; i < res.body.length; i++) {
        expect(res.body[i].park_code).toEqual(parkCode);
      }
    });

    it('should return an empty array if no trails are found for the specified park code', async () => {
      const parkCode = 'NONEXISTENT';
      const res = await request(app).get(`/trails?park=${parkCode}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toEqual(0);
    });
  });

  // Test the species route
  describe('GET /species', () => {
    it('should return an array of species for the specified park', async () => {
      const parkName = 'Arches National Park';
      const res = await request(app).get(`/species?park=${parkName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      // Make sure all species are from the specified park
      for (let i = 0; i < res.body.length; i++) {
        expect(res.body[i].park_name).toEqual(parkName);
      }
    });

    it('should return an empty array if no species are found for the specified park', async () => {
      const parkName = 'NONEXISTENT';
      const res = await request(app).get(`/species?park=${parkName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toEqual(0);
    });
  });

  // Test the airbnb route
  describe('GET /airbnb', () => {
    it('should return information for the specified airbnb', async () => {
      const airbnbId = 42738724;
      const res = await request(app).get(`/airbnb?id=${airbnbId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', airbnbId);
      expect(res.body).toHaveProperty('name');
    });

    it('should return an empty object if the specified airbnb does not exist', async () => {
      const airbnbId = -1;
      const res = await request(app).get(`/airbnb?id=${airbnbId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({});
    });
  });

  // Test the airbnbs route
  describe('GET /airbnbs', () => {
    it('should return an array of 50 airbnbs near the specified park', async () => {
      const parkCode = 'ARCH';
      const res = await request(app).get(`/airbnbs?park=${parkCode}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toEqual(50);
      // Make sure all airbnbs has id and name
      for (let i = 0; i < res.body.length; i++) {
        expect(res.body[i]).toHaveProperty('id');
        expect(res.body[i]).toHaveProperty('name');
      }
    });
  });

  // Test the random route
  describe('GET /random', () => {
    it('should return information for a random park', async () => {
      const res = await request(app).get('/random');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('park_code');
      expect(res.body).toHaveProperty('park_name');
    });
  });

  // Test the recommended-airbnbs route
  describe('GET /recommended-airbnbs', () => {
    test('should return an array of recommended airbnbs for the given species', async () => {
      const res = await request(app).get('/recommended-airbnbs?species=Grizzly Bear');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      // Make sure all airbnbs has name, park_name, price, and distance_to_park
      for (let i = 0; i < res.body.length; i++) {
        expect(res.body[i]).toHaveProperty('name');
        expect(res.body[i]).toHaveProperty('park_name');
        expect(res.body[i]).toHaveProperty('price');
        expect(res.body[i]).toHaveProperty('distance_to_park');
      }
    });

    test('should return an array of recommended airbnbs for the given species and state', async () => {
      const res = await request(app).get('/recommended-airbnbs?species=Grizzly Bear&state=CA');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      // Make sure all airbnbs has name, park_name, price, and distance_to_park
      for (let i = 0; i < res.body.length; i++) {
        expect(res.body[i]).toHaveProperty('name');
        expect(res.body[i]).toHaveProperty('park_name');
        expect(res.body[i]).toHaveProperty('price');
        expect(res.body[i]).toHaveProperty('distance_to_park');
      }
    });

    test('should return an empty array when no airbnbs are found', async () => {
      const res = await request(app).get('/recommended-airbnbs?species=invalidspecies');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  // Test the most-biodiverse-airbnbs route
  describe('GET /most-biodiverse-airbnbs', () => {
    test('should return an array of most biodiverse airbnbs for the given state and neighbourhood', async () => {
      const res = await request(app).get('/most-biodiverse-airbnbs?state=CA&neighbourhood=Hollywood');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      // Make sure all airbnbs has name, price, and reviews_per_month
      for (let i = 0; i < res.body.length; i++) {
        expect(res.body[i]).toHaveProperty('name');
        expect(res.body[i]).toHaveProperty('price');
        expect(res.body[i]).toHaveProperty('reviews_per_month');
      }
    });

    test('should return an empty array when no airbnbs are found', async () => {
      const res = await request(app).get('/most-biodiverse-airbnbs?state=invalidstate');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  // Test the popular-species route
  describe('GET /popular-species', () => {
    test('should return an array of popular species', async () => {
      const res = await request(app).get('/popular-species');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      // Make sure all species has scientific_name, park_name, and ranking
      for (let i = 0; i < res.body.length; i++) {
        expect(res.body[i]).toHaveProperty('scientific_name');
        expect(res.body[i]).toHaveProperty('park_name');
        expect(res.body[i]).toHaveProperty('ranking');
      }
    });
  });

  // Test the species-for-photographers route
  describe('GET /species-for-photographers', () => {
    it('should return a list of 10 species for photographers by default', async () => {
      const res = await request(app).get('/species-for-photographers');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(10);
      // Make sure all species has species_id, common_names, and occurrence_count
      for (let i = 0; i < res.body.length; i++) {
        expect(res.body[i]).toHaveProperty('species_id');
        expect(res.body[i]).toHaveProperty('common_names');
        expect(res.body[i]).toHaveProperty('occurrence_count');
      }
    });

    it('should return a list of 2 species for photographers', async () => {
      const res = await request(app).get('/species-for-photographers?num=2');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      // Make sure all species has species_id, common_names, and occurrence_count
      for (let i = 0; i < res.body.length; i++) {
        expect(res.body[i]).toHaveProperty('species_id');
        expect(res.body[i]).toHaveProperty('common_names');
        expect(res.body[i]).toHaveProperty('occurrence_count');
      }
    });
  });
});
