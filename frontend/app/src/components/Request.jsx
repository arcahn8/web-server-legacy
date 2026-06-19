import axios from "axios";

const GetRequest = async (url) => {
  try {
    const Response = await axios.get(url, { withCredentials: true });
    return Response;
  } catch {
    return null;
  }
};

const GetFileRequest = async (url) => {
  try {
    const Response = await axios.get(url, {
      withCredentials: true,
      responseType: "blob",
    });
    return Response;
  } catch {
    return null;
  }
};

const PostRequest = async (data, url) => {
  try {
    const Response = await axios.post(url, data, { withCredentials: true });
    return Response;
  } catch {
    return null;
  }
};

const PutRequest = async (data, url) => {
  try {
    const Response = await axios.put(url, data, { withCredentials: true });
    return Response;
  } catch {
    return null;
  }
};

const DeleteRequest = async (url) => {
  try {
    const Response = await axios.delete(url, { withCredentials: true });
    return Response;
  } catch {
    return null;
  }
};

export { GetRequest, GetFileRequest, PostRequest, PutRequest, DeleteRequest };
