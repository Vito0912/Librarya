export interface ResponseData {
    data?: any;
    statusCode: number;
    error?: string;
    headers?: { [key: string]: string };
    cookies?: { [key: string]: string };
    redirectUrl?: string;
};

export type RequiredResponseData = Required<Pick<ResponseData, 'statusCode'>> & (
  { data: any; error?: never } | { error: string; data?: never }
);
