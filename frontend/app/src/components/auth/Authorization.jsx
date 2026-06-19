import { GetRequest } from "../Request";

const Authorization = async () => {
  const validate = await GetRequest("/api/auth/sign");
  if (!validate) {
    return null;
  }
  if (validate.data.Status === 0) {
    return validate.data.Message;
  }
  return null;
};

export default Authorization;
