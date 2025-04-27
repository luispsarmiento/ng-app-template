export interface HttpErrorHandler {
    type?: 'on-client' | 'on-server';
    errorMessage?: string;
}

export interface HttpResponse<T>{
    message: string;
    data: T
}

export type RequestStatus = 'init' | 'loading' | 'success' | 'failed';