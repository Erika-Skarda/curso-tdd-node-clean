//protocols ficam todas as interfaces relacioandas a presetantion
export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest {
  body?: any
}