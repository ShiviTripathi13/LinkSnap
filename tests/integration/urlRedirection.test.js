const request = require('supertest');
const app = require('../../server'); 

describe('URL Redirection Integration Tests', () => {
  it('should redirect to the original URL when visiting a valid shortened URL', async () => {
    const response = await request(app).get('/mylink'); 
    expect(response.status).toBe(302); // 302 for redirection
    expect(response.header.location).toBe('https://www.geeksforgeeks.org/list-contains-method-in-java-with-examples/?ref=lbp'); 
  });

  it('should return 404 for an invalid short code', async () => {
    const response = await request(app).get('/invalidCode');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('URL not found');
  });
});
