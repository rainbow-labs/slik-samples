

export async function http<T>(
  request: RequestInfo,
  headerDict: any = {},
  content: any,
  authenticated: boolean = true
): Promise<T> {
  let server_endpoint = "http://localhost:8080"
  
  let endpoint = server_endpoint + request;
  headerDict['Content-Type'] = 'application/json';

  const response = await fetch(endpoint, {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(content),
    headers: headerDict
  });
  if (response.status === 200) {
    const body = await response.json();
    return body;
  }
  const body = await response.json();
  const message = body['message'];
  return Promise.reject(new Error(message));
}

export default {
  http: http,
};