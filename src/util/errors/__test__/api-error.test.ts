import ApiError from '../api-error';

describe('ApiError', () => {
  it('should format error with mandatory fields', () => {
    const error = ApiError.format({ code: 404, message: 'User not found' });
    expect(error).toEqual({
      message: 'User not found',
      error: 'Not Found',
      code: 404,
    });
  });
});
