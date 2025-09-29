const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  return headers;
};

const buildOptions = (payload, method, isFile) => {
  const options = {
    method,
    headers: isFile ? {} : getHeaders(),
  };
  if (method === "POST" || method === "PUT" || method === "DELETE") {
    options["body"] = isFile ? payload : JSON.stringify(payload);
  }
  return options;
};

const request = async (endpoint, payload, method, isFile) => {
  const options = buildOptions(payload, method, isFile);
  const response = await fetch(endpoint, options);
  if (response.ok) {
    try {
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  } else {
    throw response.status;
  }
};

export const post = async (endpoint, payload, isFile = false) =>
  request(endpoint, payload, "POST", isFile);

export const get = async (endpoint, payload, isFile = false) =>
  request(endpoint, payload, "GET", isFile);

export const put = async (endpoint, payload, isFile = false) =>
  request(endpoint, payload, "PUT", isFile);

export const remove = async (endpoint, payload, isFile = false) =>
  request(endpoint, payload, "DELETE", isFile);
