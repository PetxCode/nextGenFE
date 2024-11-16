import axios from "axios";

// const url: string = `http://localhost:2244`;
const url: string = `https://nextgenbe.onrender.com`;

export const createQuestion = (userID: string, data: any) => {
  try {
    return axios
      .post(`${url}/api/create-question/${userID}`, data)
      .then((res) => {
        return res.data;
      });
  } catch (error) {
    console.log(error);
  }
};

export const readAllQuestion = () => {
  try {
    return axios.get(`${url}/api/read-question/`).then((res) => {
      return res.data;
    });
  } catch (error) {
    console.log(error);
  }
};

export const moveToNextQuestion = (
  userID: string,
  questionID: string,
  data: {}
) => {
  try {
    return axios
      .patch(`${url}/api/read-next-question/${userID}/${questionID}`, data)
      .then((res) => {
        return res.data;
      });
  } catch (error) {
    console.log(error);
  }
};
