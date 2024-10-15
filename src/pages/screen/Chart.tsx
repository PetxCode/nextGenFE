import dd from "../../assets/pics/setNext.jpg";

const Chart = () => {
  return (
    <div>
      <div className="w-full h-screen flex flex-col p">
        <div className="w-[100%] h-[500px] flex justify-start pl-4 items-end gap-4">
          {Array.from({ length: 20 }, () => (
            <div className="w-[30px] h-[60%] bg-green-200 mb-2"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chart;
