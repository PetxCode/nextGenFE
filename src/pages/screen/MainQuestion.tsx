import { useContext, useEffect, useState } from "react";
import data from "./questionData/data.json";
import moment from "moment";
import useSocket from "@/hooks/useSocket";
import { ContextProvider } from "@/global/GlobalProvider";
import { Link } from "react-router-dom";
import { allAccount, stageOneEndPoint } from "@/api/API";

export const MainQuestion = () => {
  const { user }: any = useContext(ContextProvider);
  const socket = useSocket();
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [presentStage, setPresentStage] = useState<string>("");
  const [presentStageData, setPresentStageData] = useState<string>("");

  const [myPick, setMyPick] = useState<any | null>(null);
  const [myPickOption, setMyPickOption] = useState<any | null>(null);
  const [chartArray, setChartArray] = useState<[] | null>([]);
  const [viewChartArray, setViewChartArray] = useState<[] | null>([]);
  const [timing, setTiming] = useState<number>(20);

  const [allUsers, setAllUsers] = useState<Array<{}>>([]);

  useEffect(() => {
    allAccount()?.then((res) => {
      setAllUsers(res);
    });
    const timerId = setTimeout(() => {
      if (timing > 0) {
        setTiming(timing - 1);
      }
    }, 1000);
    return () => clearTimeout(timerId);
  }, [timing]);

  useEffect(() => {
    socket?.emit("questionNumber", questionNumber);
    socket?.on("questionNumber", ({ question, reset }) => {
      setQuestionNumber(question);
      setMyPickOption(reset);
    });

    socket?.emit("test", null);
    socket?.on("test", (res) => {
      // setMyPick(res);
    });

    socket?.emit("presentStage", presentStage);
    socket?.on("presentStage", (read) => {
      setPresentStage(read);
    });

    socket?.emit("chart", chartArray);
    socket?.on("chart", (read) => {
      setViewChartArray(read);
    });
  }, [
    socket,
    presentStage,
    questionNumber,
    myPick,
    // myPickOption,
    // chartArray,
    // viewChartArray,
  ]);

  const myData: any = { ...data };

  // console.log("reading Option: ", myPickOption);

  return (
    <div className="relative flex justify-center mt-10 items-center ">
      {myPickOption && "Greated"}
      <div className="flex flex-col lg:flex-row gap-4 justify-between min-h-[80] w-[80%]">
        <div className="min-w-[200px] rounded-md gap-2 lg:h-[200px] grid grid-cols-2 lg:grid-cols-1 items-center justify-center flex-wrap">
          {Object.keys(data).map((el: string, i: number) => (
            <button
              key={i}
              className={` border px-10 py-3 ${
                presentStage === el ? "bg-blue-950 text-white" : "bg-slate-50"
              } rounded-md my-2 `}
              onClick={() => {
                user.status === "admin" && setPresentStage(el);
                user.status === "admin" &&
                  setPresentStageData(
                    el === "stage1"
                      ? "stage1Result"
                      : el === "stage2"
                      ? "stage2Result"
                      : el === "stage3"
                      ? "stage3Result"
                      : el === "stage4"
                      ? "stage4Result"
                      : ""
                  );
              }}
            >
              {el}
            </button>
          ))}
        </div>

        <div className="flex-1  rounded-md  grid grid-cols-1 md:grid-cols-3 gap-3 ">
          <div className="col-span-1 md:col-span-2 border p-4">
            {user?.status === "admin" && (
              <h1
                className="text-center my-4 mb-10 font-semibold text-[20px] px-10 py-3 border rounded-md bg-neutral-900 text-white cursor-pointer"
                onClick={() => {
                  setQuestionNumber((el) => el + 1);
                  setTiming(20);
                }}
              >
                Next Question
              </h1>
            )}
            <p className="text-center">{myData[presentStage]?.id}</p>
            <h1 className="text-center mb-4 font-semibold text-[20px]">
              Question : {myData[presentStage]?.data[questionNumber]?.id}
            </h1>

            <div className="flex justify-center">
              <div
                className={`text-[25px] h-[100px] w-[150px] backdrop*: rounded-md  top-[-60px] bg-slate-100 flex justify-center items-center shadow-inner border mb-10 ${
                  timing < 6 ? "text-red-500 font-bold" : "text-black "
                } `}
              >
                {timing}
              </div>
            </div>
            <p className="text-[25px] mt-2">
              {myData[presentStage]?.data[questionNumber]?.title}
            </p>
            <hr className="mb-5 mt-5" />
            {timing === 0 ? (
              <div className="flex justify-center items-center h-[50px] w-full bg-slate-100 border rounded-md shadow-inner text-red-500 text-[20px]">
                Time's Up!!!
              </div>
            ) : (
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {myData[presentStage]?.data[questionNumber]?.options.map(
                  (el: any, i: number) => (
                    <div
                      key={i}
                      className={`cursor-pointer transition-all duration-300 border p-3 rounded-md flex-1 min-h-[100px]
                    ${
                      myPick?.id === el.id
                        ? "bg-blue-950 hover:bg-blue-900 text-white font-semibold"
                        : "bg-slate-50 hover:bg-slate-100"
                    }
                    `}
                      onClick={() => {
                        if (user.status === "student") {
                          setMyPick({
                            ...el,
                            createdAt: moment(new Date().getTime()).format(
                              "LTS"
                            ),

                            pickAt: `${20 - timing} secs`,
                            point: el.correct
                              ? 20 - timing <= 8
                                ? 10
                                : 20 - timing >= 9 && 20 - timing <= 12
                                ? 6
                                : 20 - timing >= 13 && 20 - timing <= 15
                                ? 3
                                : 1
                              : 0,
                          });

                          stageOneEndPoint(user?._id, {
                            questionID:
                              myData[presentStage]?.data[questionNumber].id,
                            correct: el.correct,
                            option: el.option,
                            name: `${user?.firstName} ${user?.lastName}`,
                            school: user?.schoolName,
                            stage: myData[presentStage]?.id,
                            time: moment(new Date().getTime()).format("LTS"),
                            pickedAt: `${20 - timing} secs`,
                            point: el.correct
                              ? 20 - timing <= 8
                                ? 10
                                : 20 - timing >= 9 && 20 - timing <= 12
                                ? 6
                                : 20 - timing >= 13 && 20 - timing <= 15
                                ? 3
                                : 1
                              : 0,
                          })?.then((res) => {
                            console.log("result: ", res);
                          });

                          console.log(myPick);
                          let x: any = [
                            ...chartArray!,
                            {
                              ...el,
                              name: `${user?.firstName} ${user?.lastName}`,
                              createdAt: moment(new Date().getTime()).format(
                                "LTS"
                              ),
                              pickAt: `${20 - timing} secs`,
                              point: el.correct
                                ? 20 - timing <= 8
                                  ? 10
                                  : 20 - timing >= 9 && 20 - timing <= 12
                                  ? 6
                                  : 20 - timing >= 13 && 20 - timing <= 15
                                  ? 3
                                  : 1
                                : 0,
                            },
                          ];
                          setChartArray(x!);
                        }
                      }}
                    >
                      <div className="flex flex-col items-center p-2">
                        <p className="mb-3 font-semibold text-[20px]">
                          {el?.id}.
                        </p>{" "}
                        <span className="capitalize font-medium text-[20px] break-words">
                          {el?.option}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="hidden md:flex md:col-span-1 border rounded-md p-4 h-full flex-col ">
            Showing your score!
            <div className="my-5  flex gap-2 flex-wrap max-w-[450px] max-h-[500px] ">
              <div
                className={`border  rounded-md w-full min-h-[120px] py-2 px-4 text-[12px] flex flex-col justify-between ${
                  myPick?.correct ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <p>
                  Name:{" "}
                  <strong>
                    {user?.firstName} {user?.lastName}
                  </strong>
                </p>
                <p>
                  stage: <strong>{myData[presentStage]?.id}</strong>
                </p>
                <p>
                  Option Picked: <strong>{myPick?.id}</strong>
                </p>
                <p>
                  pickAt: <strong>{myPick?.pickAt}</strong>
                </p>
                <p>
                  Time: <strong>{myPick?.createdAt}</strong>
                </p>
                <p>
                  Point: <strong>{myPick?.point}</strong>
                </p>
                <p>
                  School: <strong>{user?.schoolName}</strong>
                </p>
              </div>
            </div>
            data:
            <div className=" flex gap-3 flex-wrap  w-full max-h-[500px] ">
              {allUsers?.map((el: any) => (
                <div
                  className={`relative border rounded-md w-[110px] min-h-[60px] py-1 px-2 text-[12px] flex flex-col justify-between ${
                    el?.stage1Result[el?.stage1Result?.length - 1]?.correct
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  <p className="font-medium">{el?.stage1Result[1]?.name}</p>
                  <p>
                    Points:{" "}
                    {el?.stage1Result[el?.stage1Result?.length - 1]?.point}
                  </p>
                  <p>
                    {" "}
                    {el?.stage1Result[el?.stage1Result?.length - 1]?.pickedAt}
                  </p>
                  <p>
                    {el?.stage1Result[el?.stage1Result?.length - 1]?.option}
                  </p>

                  <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full border overflow-hidden">
                    <img
                      alt="image"
                      src={el?.avatar}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1" />
            <div className="flex flex-wrap gap-2 justify-end">
              <Link
                to="/"
                className="bg-blue-950 text-white px-10 py-2 transition-all duration-300 hover:bg-blue-900 cursor-pointer "
              >
                Home
              </Link>
              <Link
                to="/chart"
                className="bg-neutral-950 text-white px-10 py-2 transition-all duration-300 hover:bg-neutral-900 cursor-pointer "
              >
                Chart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
