import httpStatusCodes from 'http-status-codes';

export interface ApiErrorRequest {
  message: string;
  code: number;
  codeAsString?: string;
  description?: string;
  documentation?: string;
}

export interface ApiErrorResponse
  extends Omit<ApiErrorRequest, 'codeAsString'> {
  error: string;
}

export default class ApiError {
  public static format(error: ApiErrorRequest): ApiErrorResponse {
    return {
      ...{
        message: error.message,
        code: error.code,
        error: error.codeAsString
          ? error.codeAsString
          : httpStatusCodes.getStatusText(error.code),
      },
      ...(error.documentation && { documentation: error.documentation }),
      ...(error.description && { description: error.description }),
    };
  }
}
