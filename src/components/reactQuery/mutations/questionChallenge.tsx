import { api } from "../axios";
import { challengeQuestion } from "../constants";

const CREATE_QUESTION_CHALLENGE = async (value: any) => {
    return await api.post(challengeQuestion, value);
  };

  const UPDATE_QUESTION_CHALLENGE = async (value: any) => {
    return await api.patch(challengeQuestion + `${value?.id}/`, value);
  };

  const DELETE_CHALLENGE_QUESTION = async (value: any) => {
    return await api.delete(challengeQuestion + `${value}/`);
  };

export {
    CREATE_QUESTION_CHALLENGE,
    UPDATE_QUESTION_CHALLENGE,
    DELETE_CHALLENGE_QUESTION
}