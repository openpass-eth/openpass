/**
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Error thrown when a resource is not found (404)
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found', response?: any) {
    super(message, 404, response);
    this.name = 'NotFoundError';
  }
}

/**
 * Error thrown when the server returns a 5xx error
 */
export class ServerError extends ApiError {
  constructor(message: string = 'Internal server error', statusCode: number = 500, response?: any) {
    super(message, statusCode, response);
    this.name = 'ServerError';
  }
}

/**
 * Error thrown when a network request fails
 */
export class NetworkError extends ApiError {
  constructor(message: string = 'Network request failed', originalError?: Error) {
    super(message, undefined, originalError);
    this.name = 'NetworkError';
  }
}
