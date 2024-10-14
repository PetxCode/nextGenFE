import dd from "../../assets/pics/setNext.jpg";

const Chart = () => {
  const img = [
    {
      id: 1,
      img1: <img src={dd} alt="" />,
      title: "h",
    },
    {
      id: 2,
      title: "h",
      img1: <img src={dd} alt="" />,
    },
    {
      id: 3,
      title: "h",
      img1: "",
    },
    {
      id: 4,
      title: "h",
      img1: "",
    },
    {
      id: 5,
      title: "h",
      img1: "",
    },
  ];

  return (
    <div>
      <div className="w-full h-screen flex justify-center items-center flex-col bg-slate-300">
        <div className="w-[100%] h-[30vh]  flex justify-start pl-4 items-end gap-4">
          {Array.from({ length: 20 }, () => (
            <div className="w-[30px] h-[60%] bg-green-200 mb-2"></div>
          ))}
        </div>
        <div className="w-[100%] h-[5vh]  flex justify-start pl-4  gap-4 ">
          {Array.from({ length: 20 }, () => (
            <div className=" ">
              <img src={dd} alt="" className="rounded-full w-[30px] h-[30px]" />
            </div>
          ))}
        </div>
        <div className="w-full h-[7vh]  flex gap-4 pl-4">
          {Array.from({ length: 20 }, () => (
            <div>hh</div>
          ))}
        </div>
        {/* <div className="w-[100%] h-[15vh] bg-green-200 flex justify-start items-center pl-4 gap-4">
          {img.map((el) => (
            <div className="w-[20px] h-[50px]">{el.img1}</div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default Chart;
