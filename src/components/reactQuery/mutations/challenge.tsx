import { api } from "../axios";
import { challengeDay, challengeQuestion, challengeReview, createChallenge } from "../constants";

const CREATE_CHALLENGE_DAY = async (value: any) => {
  const formData = new FormData();
  formData.append("icon", value?.icon);
  formData.append("day_number", value?.dayNumber);
  formData.append("name", "-");
  // formData.append("nameVi", value?.nameVi);

  // const urlFile = await api.post(mediaDownload, formData, {
  //   headers: {
  //     "content-type": "multipart/form-data",
  //   },
  // });
  return await api.post(challengeDay, formData, {
    headers: {
      "content-type": "multipart/form-data",
      // "Accept": "application/json"
    },
  });
};

const CREATE_CHALLENGE = async (value: any) => {
  return await api.post(createChallenge, value);
};



const DELETE_CHALLENGE = async (value: any) => {
  return await api.delete(createChallenge + `${value}/`);
};

const UPDATE_CHALLENGE_STATUS = async (variable: any) => {
  return await api.patch(
    challengeReview + `${variable?.id}/update_challenge_status/`,
    variable
  );
};
const UPDATE_CHALLENGE_DAY = async (variable: any) => {
  const formData = new FormData();
  if (typeof variable?.icon !== "string") {
    formData.append("icon", variable?.icon);
  }
  formData.append("day_number", variable?.dayNumber);
  formData.append("name", " ");
  return await api.patch(challengeDay + `${variable?.id}/`, formData, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
};

const UPDATE_CHALLENGE = async (value: any) => {
  return await api.put(createChallenge + `${value?.id}/`, value);
};
export {
  CREATE_CHALLENGE_DAY,
  CREATE_CHALLENGE,
  DELETE_CHALLENGE,
  UPDATE_CHALLENGE_STATUS,
  UPDATE_CHALLENGE_DAY,
  UPDATE_CHALLENGE,
};
