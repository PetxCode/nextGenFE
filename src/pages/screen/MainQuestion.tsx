import { useContext, useEffect, useState } from "react";
import data from "./questionData/data.json";
import moment from "moment";
import { ContextProvider } from "@/global/GlobalProvider";

import {
  allAccount,
  stageFourEndPoint,
  stageOneEndPoint,
  stageThreeEndPoint,
  stageTwoEndPoint,
} from "@/api/API";
import { MyChart } from "./ChartScreen";
import { useReadAllQuestion } from "@/hooks/useGallary";
import { moveToNextQuestion } from "@/api/questionAPI";
import { mutate } from "swr";

export const MainQuestion = () => {
  const { user }: any = useContext(ContextProvider);
  const { data: allQuestionData } = useReadAllQuestion();

  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [presentStage, setPresentStage] = useState<string>("");

  const [myPick, setMyPick] = useState<any | null>(null);
  const [myPickOption, setMyPickOption] = useState<any | null>(null);
  const [timing, setTiming] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTitle, setLoadingTitle] = useState<boolean>(false);

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
    setTiming(allQuestionData?.data[0]?.specific?.timer);
    setMyPickOption(allQuestionData?.data[0]?.specific?.picked);

    if (allQuestionData?.data[0]?.specific?.title) {
      setLoadingTitle(false);
    }
  }, [allQuestionData?.data[0]?.specific?.id]);

  const myData: any = { ...data };

  let state1Data = [...allUsers];
  let state2Data = [...allUsers];
  let state3Data = [...allUsers];
  let state4Data = [...allUsers];

  // console.log(allQuestionData?.data[0]?.specific?.timer);
  // setTiming(allQuestionData?.data[0]?.specific?.timer);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.key === "r") || event.key === "F5") {
        event.preventDefault();
        alert("Refresh is disabled on this page.");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const calculatePoints = (el: any, timing: number) => {
    if (el.correct) {
      const timeRemaining = timing;

      if (timeRemaining >= 10 && timeRemaining <= 19) {
        return 6;
      } else if (timeRemaining >= 5 && timeRemaining <= 9) {
        return 3;
      } else if (timeRemaining <= 4) {
        return 1;
      } else {
        return 10;
      }
    } else {
      return 0;
    }
  };

  const moveToNext = (stage: string, question: number) => {
    setLoading(true);
    setLoadingTitle(true);
    let x =
      (question %
        allQuestionData.data[0].question[`${stage.toLowerCase()}`]?.data
          ?.length) +
      1;

    setQuestionNumber((el) => el + 1);

    setTiming(allQuestionData?.data[0]?.specific?.timer);

    moveToNextQuestion(user?._id, allQuestionData.data[0]?._id, {
      stage: stage.toLowerCase(),
      questionID: x,
    })
      ?.then(() => {
        mutate(`api/read-question/`);
      })
      .finally(() => {
        setLoading(false);
      });
    setTiming(30);
  };

  return (
    <div className="relative flex justify-center mt-10 items-center ">
      <div className="flex flex-col lg:flex-row gap-4 justify-between min-h-[80] w-[80%]">
        <div className="min-w-[200px] rounded-md gap-2 lg:h-[200px] grid grid-cols-2 lg:grid-cols-1 items-center justify-center flex-wrap  ">
          {allQuestionData?.data[0]?.specific?.stage}
          <span className="flex font-medium text-[12px] uppercase">
            {user?.status === "student"
              ? "participant"
              : user?.status === "admin"
              ? "admin"
              : "observant"}{" "}
            || {user?.lastName}
          </span>

          {Object?.keys(data)?.map((el: string, i: number) => (
            <button
              key={i}
              className={` border px-10 py-3 ${
                allQuestionData?.data[0]?.specific?.stage === el.toLowerCase()
                  ? "bg-blue-950 text-white"
                  : "bg-slate-50"
              } rounded-md my-2 `}
              onClick={() => {
                user.status === "admin" && setPresentStage(el);
                user.status === "admin" && setQuestionNumber(-1);
                user.status === "admin" &&
                  moveToNext(presentStage.toLowerCase(), questionNumber);
              }}
            >
              {el}
            </button>
          ))}
          {!user && (
            <div className="overflow-auto mt-10 min-h-[60vh]">
              <div className="mt-2">
                <p className=" ">Students Result Outcomes for </p>
                <h1 className=" mb-4 font-semibold text-[12px] flex gap-3">
                  <p className="">{myData[presentStage]?.id}</p>
                  Question
                  <span className="ml-1">
                    {myData[presentStage]?.data[questionNumber]?.id}
                  </span>
                </h1>
              </div>

              {myData[presentStage]?.id === "stage1" ? (
                <div className=" flex gap-3 flex-wrap  w-full max-h-[500px] ">
                  {allUsers?.map((el: any) => (
                    <div
                      className={`relative border rounded-md w-[150px] min-h-[60px] py-1 px-2 text-[12px] flex flex-col justify-between ${
                        el?.stage1Result[el?.stage1Result?.length - 1]?.correct
                          ? "bg-green-50"
                          : "bg-red-50"
                      }`}
                    >
                      <p className="font-medium">{el?.stage1Result[1]?.name}</p>
                      <p>
                        Points:{" "}
                        <span className="font-medium text-[14px]">
                          {
                            el?.stage1Result[el?.stage1Result?.length - 1]
                              ?.point
                          }
                        </span>
                      </p>
                      <p>
                        Picked In
                        <span className="font-medium text-[12px] ml-1">
                          {
                            el?.stage1Result[el?.stage1Result?.length - 1]
                              ?.pickedAt
                          }
                        </span>
                      </p>
                      <p>
                        Picked:
                        <span className="font-medium text-[12px] ml-1">
                          {
                            el?.stage1Result[el?.stage1Result?.length - 1]
                              ?.option
                          }
                        </span>
                      </p>
                      <p>
                        Option:
                        <span className="font-medium text-[12px] ml-1">
                          {
                            el?.stage1Result[el?.stage1Result?.length - 1]
                              ?.optionPicked
                          }
                        </span>
                      </p>

                      <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full border overflow-hidden">
                        <img
                          alt="image"
                          src={el?.avatar}
                          className="h-full w-full ?-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : myData[presentStage]?.id === "stage2" ? (
                <div className=" flex gap-3 flex-wrap  w-full max-h-[500px] ">
                  {allUsers?.map((el: any) => (
                    <div
                      className={`relative border rounded-md w-[150px] min-h-[60px] py-1 px-2 text-[12px] flex flex-col justify-between ${
                        el?.stage2Result[el?.stage2Result?.length - 1]?.correct
                          ? "bg-green-50"
                          : "bg-red-50"
                      }`}
                    >
                      <p className="font-medium">{el?.stage2Result[1]?.name}</p>
                      <p>
                        Points:{" "}
                        <span className="font-medium text-[14px]">
                          {
                            el?.stage2Result[el?.stage2Result?.length - 1]
                              ?.point
                          }
                        </span>
                      </p>
                      <p>
                        Picked In
                        <span className="font-medium text-[12px] ml-1">
                          {
                            el?.stage2Result[el?.stage2Result?.length - 1]
                              ?.pickedAt
                          }
                        </span>
                      </p>
                      <p>
                        Picked:
                        <span className="font-medium text-[12px] ml-1">
                          {
                            el?.stage2Result[el?.stage2Result?.length - 1]
                              ?.option
                          }
                        </span>
                      </p>
                      <p>
                        Option:
                        <span className="font-medium text-[12px] ml-1">
                          {
                            el?.stage2Result[el?.stage2Result?.length - 1]
                              ?.optionPicked
                          }
                        </span>
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
              ) : myData[presentStage]?.id === "stage3" ? (
                <div className=" flex gap-3 flex-wrap  w-full max-h-[500px] ">
                  {allUsers?.map((el: any) => (
                    <div
                      className={`relative border rounded-md w-[150px] min-h-[60px] py-1 px-2 text-[12px] flex flex-col justify-between ${
                        el?.stage3Result[el?.stage3Result?.length - 1]?.correct
                          ? "bg-green-50"
                          : "bg-red-50"
                      }`}
                    >
                      <p className="font-medium">{el?.stage3Result[1]?.name}</p>
                      <p>
                        Points:{" "}
                        <span className="font-medium text-[14px]">
                          {
                            el?.stage3Result[el?.stage3Result?.length - 1]
                              ?.point
                          }
                        </span>
                      </p>
                      <p>
                        Picked In
                        <span className="font-medium text-[12px] ml-1">
                          {
                            el?.stage3Result[el?.stage3Result?.length - 1]
                              ?.pickedAt
                          }
                        </span>
                      </p>
                      <p>
                        Picked:
                        <span className="font-medium text-[12px] ml-1">
                          {
                            el?.stage3Result[el?.stage3Result?.length - 1]
                              ?.option
                          }
                        </span>
                      </p>

                      <p>
                        Option:
                        <span className="font-medium text-[12px] ml-1">
                          {
                            el?.stage3Result[el?.stage3Result?.length - 1]
                              ?.optionPicked
                          }
                        </span>
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
              ) : myData[presentStage]?.id === "stage4" ? (
                <div className=" flex gap-3 flex-wrap  w-full max-h-[500px] ">
                  {allUsers?.map((el: any) => (
                    <div
                      className={`relative border rounded-md w-[150px] min-h-[60px] py-1 px-2 text-[12px] flex flex-col justify-between ${
                        el?.stage4Result[el?.stage4Result?.length - 1]?.correct
                          ? "bg-green-50"
                          : "bg-red-50"
                      }`}
                    >
                      <p className="font-medium">{el?.stage4Result[1]?.name}</p>
                      <p>
                        Points:{" "}
                        <span className="font-medium text-[14px]">
                          {
                            el?.stage4Result[el?.stage4Result?.length - 1]
                              ?.point
                          }
                        </span>
                      </p>
                      <p>
                        Picked In
                        <span className="font-medium text-[12px] ml-1">
                          {
                            el?.stage4Result[el?.stage4Result?.length - 1]
                              ?.pickedAt
                          }
                        </span>
                      </p>
                      <p>
                        Picked:
                        <span className="font-medium text-[12px] ml-1">
                          {
                            el?.stage4Result[el?.stage4Result?.length - 1]
                              ?.option
                          }
                        </span>
                      </p>

                      <p>
                        Option:
                        <span className="font-medium text-[12px] ml-1">
                          {
                            el?.stage4Result[el?.stage4Result?.length - 1]
                              ?.optionPicked
                          }
                        </span>
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
              ) : null}
            </div>
          )}
          {user?.status === "admin" && (
            <button
              className={` border px-10 py-3 ${
                presentStage === "" ? "bg-blue-950 text-white" : "bg-slate-50"
              } rounded-md my-2 `}
              onClick={() => {
                setPresentStage("");
              }}
            >
              Break
            </button>
          )}
        </div>
        {user && presentStage && (
          <div className="flex-1  rounded-md grid grid-cols-1 md:grid-cols-5 gap-3 ">
            <div className="col-span-1 md:col-span-3 border p-4">
              {user?.status === "admin" && (
                <h1
                  className="text-center my-4 mb-10 font-semibold text-[20px] px-10 py-3 border rounded-md bg-neutral-900 text-white cursor-pointer"
                  onClick={() => {
                    moveToNext(presentStage, questionNumber);
                  }}
                >
                  {loading ? "Loading..." : "Next Question"}
                </h1>
              )}
              <p className="text-center">{myData[presentStage]?.id}</p>
              <h1 className="text-center mb-4 font-semibold text-[20px]">
                Question : {allQuestionData?.data[0]?.specific?.id}
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
                {loadingTitle
                  ? "Loading..."
                  : allQuestionData?.data[0]?.specific?.title}
              </p>
              <hr className="mb-5 mt-5" />
              {timing === 0 ? (
                <div className="flex justify-center items-center h-[50px] w-full bg-slate-100 border rounded-md shadow-inner text-red-500 text-[20px]">
                  Time's Up!!!
                </div>
              ) : (
                <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                  {allQuestionData?.data[0]?.specific?.options?.map(
                    (el: any, i: number) => (
                      <div
                        key={i}
                        className={`cursor-pointer transition-all duration-300 border p-3 rounded-md flex-1 min-h-[100px]
                    ${
                      myPickOption === el.id
                        ? "bg-blue-950 hover:bg-blue-900 text-white font-semibold"
                        : "bg-slate-50 hover:bg-slate-100"
                    }
                    `}
                        onClick={() => {
                          if (user.status === "student") {
                            setMyPickOption(el.id);
                            setMyPick({
                              ...el,
                              createdAt: moment(new Date().getTime()).format(
                                "LTS"
                              ),

                              pickAt: `${30 - timing} secs`,
                              point: calculatePoints(el, timing),
                            });

                            myData[presentStage]?.id === "stage1"
                              ? stageOneEndPoint(user?._id, {
                                  questionID:
                                    myData[presentStage]?.data[questionNumber]
                                      .id,
                                  correct: el.correct,
                                  optionPicked: el.id,
                                  option: el.option,
                                  name: `${user?.firstName} ${user?.lastName}`,
                                  school: user?.schoolName,
                                  stage: myData[presentStage]?.id,
                                  time: moment(new Date().getTime()).format(
                                    "LTS"
                                  ),
                                  pickedAt: `${30 - timing} secs`,
                                  point: calculatePoints(el, timing),
                                })
                              : myData[presentStage]?.id === "stage2"
                              ? stageTwoEndPoint(user?._id, {
                                  questionID:
                                    myData[presentStage]?.data[questionNumber]
                                      .id,
                                  correct: el.correct,
                                  optionPicked: el.id,
                                  option: el.option,
                                  name: `${user?.firstName} ${user?.lastName}`,
                                  school: user?.schoolName,
                                  stage: myData[presentStage]?.id,
                                  time: moment(new Date().getTime()).format(
                                    "LTS"
                                  ),
                                  pickedAt: `${20 - timing} secs`,
                                  point: calculatePoints(el, timing),
                                })?.then(() => {})
                              : myData[presentStage]?.id === "stage3"
                              ? stageThreeEndPoint(user?._id, {
                                  questionID:
                                    myData[presentStage]?.data[questionNumber]
                                      .id,
                                  correct: el.correct,
                                  option: el.option,
                                  optionPicked: el.id,
                                  name: `${user?.firstName} ${user?.lastName}`,
                                  school: user?.schoolName,
                                  stage: myData[presentStage]?.id,
                                  time: moment(new Date().getTime()).format(
                                    "LTS"
                                  ),
                                  pickedAt: `${20 - timing} secs`,
                                  point: calculatePoints(el, timing),
                                })?.then(() => {})
                              : myData[presentStage]?.id === "stage4"
                              ? stageFourEndPoint(user?._id, {
                                  questionID:
                                    myData[presentStage]?.data[questionNumber]
                                      .id,
                                  correct: el.correct,
                                  optionPicked: el.id,
                                  option: el.option,
                                  name: `${user?.firstName} ${user?.lastName}`,
                                  school: user?.schoolName,
                                  stage: myData[presentStage]?.id,
                                  time: moment(new Date().getTime()).format(
                                    "LTS"
                                  ),
                                  pickedAt: `${20 - timing} secs`,
                                  point: calculatePoints(el, timing),
                                })
                              : null;
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

            <div className="hidden md:flex md:col-span-2 border rounded-md p-4 h-full flex-col ">
              {user?.status === "student" && (
                <div>
                  <div>
                    <p>Showing your Option!</p>
                  </div>
                  <div className="my-5 flex gap-2 flex-wrap max-w-[450px] max-h-[500px] ">
                    <div
                      className={`border  rounded-md w-full min-h-[120px] py-2 px-4 text-[14px] flex flex-col justify-between ${
                        myPick?.correct ? "bg-blue-50" : "bg-blue-50"
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
                      {/* <p>
                        Point: <strong>{myPick?.point}</strong>
                      </p> */}
                      <p>
                        School: <strong>{user?.schoolName}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {user?.status === "admin" && (
                <div>
                  <div>
                    <p>Students Result Outcomes for</p>
                    <p className="">{myData[presentStage]?.id}</p>
                    <h1 className=" mb-4 font-semibold text-[12px]">
                      Question
                      <span className="ml-1">
                        {myData[presentStage]?.data[questionNumber]?.id}
                      </span>
                    </h1>
                  </div>

                  {myData[presentStage]?.id === "stage1" ? (
                    <div className=" flex gap-3 flex-wrap  w-full max-h-[600px] overflow-auto">
                      {allUsers?.map((el: any) => (
                        <div
                          className={`relative border rounded-md w-[150px] min-h-[60px] py-1 px-2 text-[12px] flex flex-col justify-between ${
                            el?.stage1Result[el?.stage1Result?.length - 1]
                              ?.correct
                              ? "bg-green-50"
                              : "bg-red-50"
                          }`}
                        >
                          <p className="font-medium">
                            {el?.stage1Result[1]?.name}
                          </p>
                          <p>
                            Points:{" "}
                            <span className="font-medium text-[14px]">
                              {
                                el?.stage1Result[el?.stage1Result?.length - 1]
                                  ?.point
                              }
                            </span>
                          </p>
                          <p>
                            Picked In
                            <span className="font-medium text-[12px] ml-1">
                              {
                                el?.stage1Result[el?.stage1Result?.length - 1]
                                  ?.pickedAt
                              }
                            </span>
                          </p>
                          <p>
                            Picked:
                            <span className="font-medium text-[12px] ml-1">
                              {
                                el?.stage1Result[el?.stage1Result?.length - 1]
                                  ?.option
                              }
                            </span>
                          </p>
                          <p>
                            Option:
                            <span className="font-medium text-[12px] ml-1">
                              {
                                el?.stage1Result[el?.stage1Result?.length - 1]
                                  ?.optionPicked
                              }
                            </span>
                          </p>

                          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full border overflow-hidden">
                            <img
                              alt="image"
                              src={el?.avatar}
                              className="h-full bg-white w-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : myData[presentStage]?.id === "stage2" ? (
                    <div className=" flex gap-3 flex-wrap  w-full max-h-[600px] overflow-auto">
                      {allUsers?.map((el: any) => (
                        <div
                          className={`relative border rounded-md w-[150px] min-h-[60px] py-1 px-2 text-[12px] flex flex-col justify-between ${
                            el?.stage2Result[el?.stage2Result?.length - 1]
                              ?.correct
                              ? "bg-green-50"
                              : "bg-red-50"
                          }`}
                        >
                          <p className="font-medium">
                            {el?.stage2Result[1]?.name}
                          </p>
                          <p>
                            Points:{" "}
                            <span className="font-medium text-[14px]">
                              {
                                el?.stage2Result[el?.stage2Result?.length - 1]
                                  ?.point
                              }
                            </span>
                          </p>
                          <p>
                            Picked In
                            <span className="font-medium text-[12px] ml-1">
                              {
                                el?.stage2Result[el?.stage2Result?.length - 1]
                                  ?.pickedAt
                              }
                            </span>
                          </p>
                          <p>
                            Picked:
                            <span className="font-medium text-[12px] ml-1">
                              {
                                el?.stage2Result[el?.stage2Result?.length - 1]
                                  ?.option
                              }
                            </span>
                          </p>
                          <p>
                            Option:
                            <span className="font-medium text-[12px] ml-1">
                              {
                                el?.stage2Result[el?.stage2Result?.length - 1]
                                  ?.optionPicked
                              }
                            </span>
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
                  ) : myData[presentStage]?.id === "stage3" ? (
                    <div className=" flex gap-3 flex-wrap  w-full max-h-[600px] overflow-auto ">
                      {allUsers?.map((el: any) => (
                        <div
                          className={`relative border rounded-md w-[150px] min-h-[60px] py-1 px-2 text-[12px] flex flex-col justify-between ${
                            el?.stage3Result[el?.stage3Result?.length - 1]
                              ?.correct
                              ? "bg-green-50"
                              : "bg-red-50"
                          }`}
                        >
                          <p className="font-medium">
                            {el?.stage3Result[1]?.name}
                          </p>
                          <p>
                            Points:{" "}
                            <span className="font-medium text-[14px]">
                              {
                                el?.stage3Result[el?.stage3Result?.length - 1]
                                  ?.point
                              }
                            </span>
                          </p>
                          <p>
                            Picked In
                            <span className="font-medium text-[12px] ml-1">
                              {
                                el?.stage3Result[el?.stage3Result?.length - 1]
                                  ?.pickedAt
                              }
                            </span>
                          </p>
                          <p>
                            Picked:
                            <span className="font-medium text-[12px] ml-1">
                              {
                                el?.stage3Result[el?.stage3Result?.length - 1]
                                  ?.option
                              }
                            </span>
                          </p>

                          <p>
                            Option:
                            <span className="font-medium text-[12px] ml-1">
                              {
                                el?.stage3Result[el?.stage3Result?.length - 1]
                                  ?.optionPicked
                              }
                            </span>
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
                  ) : myData[presentStage]?.id === "stage4" ? (
                    <div className=" flex gap-3 flex-wrap  w-full max-h-[600px] overflow-auto ">
                      {allUsers?.map((el: any) => (
                        <div
                          className={`relative border rounded-md w-[150px] min-h-[60px] py-1 px-2 text-[12px] flex flex-col justify-between ${
                            el?.stage4Result[el?.stage4Result?.length - 1]
                              ?.correct
                              ? "bg-green-50"
                              : "bg-red-50"
                          }`}
                        >
                          <p className="font-medium">
                            {el?.stage4Result[1]?.name}
                          </p>
                          <p>
                            Points:{" "}
                            <span className="font-medium text-[14px]">
                              {
                                el?.stage4Result[el?.stage4Result?.length - 1]
                                  ?.point
                              }
                            </span>
                          </p>
                          <p>
                            Picked In
                            <span className="font-medium text-[12px] ml-1">
                              {
                                el?.stage4Result[el?.stage4Result?.length - 1]
                                  ?.pickedAt
                              }
                            </span>
                          </p>
                          <p>
                            Picked:
                            <span className="font-medium text-[12px] ml-1">
                              {
                                el?.stage4Result[el?.stage4Result?.length - 1]
                                  ?.option
                              }
                            </span>
                          </p>

                          <p>
                            Option:
                            <span className="font-medium text-[12px] ml-1">
                              {
                                el?.stage4Result[el?.stage4Result?.length - 1]
                                  ?.optionPicked
                              }
                            </span>
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
                  ) : null}
                </div>
              )}
              <div className="flex-1" />
            </div>
          </div>
        )}
        {user && presentStage === "" && (
          <div className="flex-1 h-[80vh] p-2 border overflow-auto">
            <div className="uppercase text-[12px]">
              This is for Break Sessions
            </div>
            <div className="uppercase mt-16 italic font-semibold text-[20px]">
              Students present Performance
            </div>

            <div
              className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-2 gap-2
            "
            >
              {allUsers?.map((el: any) => (
                <div className=" ">
                  {el.status !== "admin" && (
                    <div className="border h-[120px] p-2 flex gap-2">
                      <div className="w-12 border h-12 rounded-full overflow-hidden">
                        <img
                          src={el?.avatar}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[12px] h-full flex flex-col">
                        <p>{el?.lastName}</p>
                        <p>Total Points</p>

                        <div className="flex gap-2">
                          <p>stage 1: {el?.stage1Score}</p>
                          <p>stage 2: {el?.stage2Score}</p>
                        </div>

                        <div className="flex gap-2">
                          <p>stage 3: {el?.stage3Score}</p>
                          <p>stage 4: {el?.stage4Score}</p>
                        </div>

                        <div className="flex-1" />
                        <p>
                          Total Score:{" "}
                          <span>
                            {el?.stage1Score +
                              el?.stage2Score +
                              el?.stage3Score +
                              el?.stage4Score}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {!user && presentStage === "" ? (
          <div className="flex-1 h-[80vh] p-2 border overflow-auto">
            <div className="uppercase text-[12px]">
              This is for Break Sessions
            </div>
            <div className="uppercase mt-16 italic font-semibold text-[20px]">
              Students present Performance
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-2 gap-2 ">
              {allUsers?.map((el: any) => (
                <div>
                  {el.status !== "admin" && (
                    <div className="border  h-[120px] p-2 flex gap-2">
                      <div className="w-12 border h-12 rounded-full overflow-hidden">
                        <img
                          src={el?.avatar}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[12px] h-full flex flex-col">
                        <p>{el?.lastName}</p>
                        <p>Total Points</p>

                        <div className="flex gap-2">
                          <p>stage 1: {el?.stage1Score}</p>
                          <p>stage 2: {el?.stage2Score}</p>
                        </div>

                        <div className="flex gap-2">
                          <p>stage 3: {el?.stage3Score}</p>
                          <p>stage 4: {el?.stage4Score}</p>
                        </div>

                        <div className="flex-1" />
                        <p>
                          Total Score:{" "}
                          <span>
                            {el?.stage1Score +
                              el?.stage2Score +
                              el?.stage3Score +
                              el?.stage4Score}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {!user && (
              <div className="w-full flex flex-col">
                {myData[presentStage]?.id === "stage1" ? (
                  <div>
                    <div className="min-h-[600px] flex gap-2  w-full bg-slate-50 p-2 border ">
                      <MyChart
                        data={allUsers}
                        title="Stage One"
                        stage="stage1Score"
                      />
                    </div>

                    <div className="mt-10">
                      <div className="relative flex flex-wrap gap-2">
                        {state1Data
                          .sort((a: any, b: any) => {
                            return a.stage1Score - b.stage1Score;
                          })
                          ?.map((props: any) => (
                            <div
                              key={props?._id}
                              className="p-2 border w-[180px] min-h-[100px]"
                            >
                              <div className="flex gap-2">
                                <img
                                  src={props?.avatar}
                                  className="w-14 h-14 border-black border rounded-full object-cover"
                                />

                                <div className="text-[12px]">
                                  <p>School: {props?.schoolName}</p>
                                  <p>Points: {props?.stage1Score}</p>
                                </div>
                              </div>
                              <p className="mt-3 text-[14px]">
                                Name:{" "}
                                <span className="font-semibold">
                                  {props?.firstName}
                                </span>
                              </p>
                            </div>
                          ))}
                      </div>

                      {/* */}
                    </div>
                  </div>
                ) : myData[presentStage]?.id === "stage2" ? (
                  <div>
                    <div className="min-h-[600px] flex gap-2  w-full bg-slate-50 p-2 border ">
                      <MyChart
                        data={allUsers}
                        title="Stage One"
                        stage="stage1Score"
                        stage2="stage2Score"
                      />
                      {/* {allUsers?.map((props: any) => (
                    <div className="h-full flex flex-col justify-end items-center  w-16 duration-300 transition-all overflow-hidden">
                      <div
                        className={` w-2 bg-blue-950 mb-2`}
                        style={{
                          height: `${(props?.stage2Score / 200) * 450}px`,
                        }}
                      />
                      <div className="w-10 h-10 rounded-full bg-blue-950 overflow-hidden">
                        <img
                          src={props?.avatar}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))} */}
                    </div>

                    <div className="mt-10">
                      <div className="relative flex flex-wrap gap-2">
                        {state2Data
                          .sort((a: any, b: any) => {
                            return a.stage2Score - b.stage2Score;
                          })
                          ?.map((props: any) => {
                            return (
                              <div
                                key={props?._id}
                                className="p-2 border w-[180px] min-h-[100px]"
                              >
                                <div className="flex gap-2">
                                  <img
                                    src={props?.avatar}
                                    className="w-14 h-14 border-black border rounded-full object-cover"
                                  />

                                  <div className="text-[12px]">
                                    <p>School: {props?.schoolName}</p>
                                    <p>Points: {props?.stage2Score}</p>
                                  </div>
                                </div>
                                <p className="mt-3 text-[14px]">
                                  Name:{" "}
                                  <span className="font-semibold">
                                    {props?.firstName}
                                  </span>
                                </p>
                              </div>
                            );
                          })}
                      </div>

                      {/* */}
                    </div>
                  </div>
                ) : myData[presentStage]?.id === "stage3" ? (
                  <div>
                    <div className="min-h-[600px] flex gap-2  w-full bg-slate-50 p-2 border ">
                      <MyChart
                        data={allUsers}
                        title="Stage Three"
                        stage="stage1Score"
                        stage2="stage2Score"
                        stage3="stage3Score"
                      />
                      {/* {allUsers?.map((props: any) => (
                    <div className="h-full flex flex-col justify-end items-center  w-16 duration-300 transition-all overflow-hidden">
                      <div
                        className={` w-2 bg-blue-950 mb-2`}
                        style={{
                          height: `${(props?.stage3Score / 200) * 450}px`,
                        }}
                      />
                      <div className="w-10 h-10 rounded-full bg-blue-950 overflow-hidden">
                        <img
                          src={props?.avatar}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))} */}
                    </div>

                    <div className="mt-10">
                      <div className="relative flex flex-wrap gap-2">
                        {state3Data
                          .sort((a: any, b: any) => {
                            return a.stage3Score - b.stage3Score;
                          })
                          ?.map((props: any) => (
                            <div
                              key={props?._id}
                              className="p-2 border w-[180px] min-h-[100px]"
                            >
                              <div className="flex gap-2">
                                <img
                                  src={props?.avatar}
                                  className="w-14 h-14 border-black border rounded-full object-cover"
                                />

                                <div className="text-[12px]">
                                  <p>School: {props?.schoolName}</p>
                                  <p>Points: {props?.stage3Score}</p>
                                </div>
                              </div>
                              <p className="mt-3 text-[14px]">
                                Name:{" "}
                                <span className="font-semibold">
                                  {props?.firstName}
                                </span>
                              </p>
                            </div>
                          ))}
                      </div>

                      {/* */}
                    </div>
                  </div>
                ) : myData[presentStage]?.id === "stage4" ? (
                  <div>
                    <div className="min-h-[600px] flex gap-2  w-full bg-slate-50 p-2 border ">
                      <MyChart
                        data={allUsers}
                        title="Stage Four"
                        stage="stage1Score"
                        stage2="stage2Score"
                        stage3="stage3Score"
                        stage4="stage4Score"
                      />
                    </div>

                    <div className="mt-10">
                      <div className="relative flex flex-wrap gap-2">
                        {state4Data
                          .sort((a: any, b: any) => {
                            return a.stage4Score - b.stage4Score;
                          })
                          ?.map((props: any) => (
                            <div
                              key={props?._id}
                              className="p-2 border w-[180px] min-h-[100px]"
                            >
                              <div className="flex gap-2">
                                <img
                                  src={props?.avatar}
                                  className="w-14 h-14 border-black border rounded-full object-cover"
                                />

                                <div className="text-[12px]">
                                  <p>School: {props?.schoolName}</p>
                                  <p>Points: {props?.stage4Score}</p>
                                </div>
                              </div>
                              <p className="mt-3 text-[14px]">
                                Name:{" "}
                                <span className="font-semibold">
                                  {props?.firstName}
                                </span>
                              </p>
                            </div>
                          ))}
                      </div>

                      {/* */}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// setLoading(true);
// setLoadingTitle(true);
// let x =
//   (questionNumber %
//     allQuestionData.data[0].question[`${presentStage.toLowerCase()}`]?.data
//       ?.length) +
//   1;

// setQuestionNumber((el) => el + 1);

// setTiming(allQuestionData?.data[0]?.specific?.timer);

// moveToNextQuestion(user?._id, allQuestionData.data[0]?._id, {
//   stage: presentStage.toLowerCase(),
//   questionID: x,
// })
//   ?.then(() => {
//     mutate(`api/read-question/`);
//   })
//   .finally(() => {
//     setLoading(false);
//   });
// setTiming(30);
