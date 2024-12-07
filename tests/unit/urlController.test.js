const { redirectUrl } = require('../../controller/urlController');
const URL_Schema = require('../../model/URL_Schema');
const statisticsSchema = require('../../model/statistics_Schema');
const mockRes = {
  redirect: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const mockReq = (code) => ({
  params: { code },
  query: { redirect: 'true' },  // to simulate redirection
});

jest.mock('../../model/URL_Schema');
jest.mock('../../model/statistics_Schema');

describe('URL Controller Unit Tests', () => {
  it('should redirect to the original URL when valid shortCode is provided', async () => {
    const mockUrl = { original_url: 'https://www.geeksforgeeks.org/list-contains-method-in-java-with-examples/?ref=lbp', short_code: 'mylink' };
    URL_Schema.findOneAndUpdate.mockResolvedValue(mockUrl);

    const req = mockReq('mylink');
    await redirectUrl(req, mockRes);

    expect(mockRes.redirect).toHaveBeenCalledWith('https://www.geeksforgeeks.org/list-contains-method-in-java-with-examples/?ref=lbp');
  });

  it('should return 404 if URL is not found', async () => {
    URL_Schema.findOneAndUpdate.mockResolvedValue(null);

    const req = mockReq('nonexistentcode');
    await redirectUrl(req, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'URL not found' });
  });
});


// tests for edge cases

it('should return 400 if shortCode is missing', async () => {
    const req = { params: {}, query: { redirect: 'true' } };
    await redirectUrl(req, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Short code is required' });
});

it('should return 410 if the URL has expired', async () => {
const expiredUrl = { original_url: 'https://linksnap.com/some-expired-resource', expirationDate: new Date('2024-12-09') };
URL_Schema.findOneAndUpdate.mockResolvedValue(expiredUrl);

const req = mockReq('expiredCode');
await redirectUrl(req, mockRes);

expect(mockRes.status).toHaveBeenCalledWith(410);
expect(mockRes.json).toHaveBeenCalledWith({ error: 'URL has expired' });
});


// error scenario testing

it('should return 500 for unexpected errors', async () => {
    URL_Schema.findOneAndUpdate.mockRejectedValue(new Error('Database error'));
  
    const req = mockReq('notValidCode');
    await redirectUrl(req, mockRes);
  
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
});
  