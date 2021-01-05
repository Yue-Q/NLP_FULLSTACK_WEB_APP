export const APIRequest = (param) => {
    return fetch(param.url,
      {
      method: param.method || "POST",
      body: JSON.stringify(param.body) || null,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token':param.token || null,
      },
    })
  }
  