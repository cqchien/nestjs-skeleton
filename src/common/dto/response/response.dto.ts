export class MetaResponseDto {
  statusCode: number;
  message?: string | null;
  error?: string | null;

  constructor(statusCode: number, message?: string, error?: string) {
    this.statusCode = statusCode;
    this.message = message ?? 'Success';
    this.error = error;
  }
}

export class ResponseDto<T> {
  response: T | null;
  meta: MetaResponseDto;

  constructor(data: T | null, meta: MetaResponseDto) {
    this.meta = meta;
    this.response = data;
  }
}
