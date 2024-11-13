// import { makeDonation } from "../api/API";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
// import toast from "react-hot-toast";

const DonateScreen = () => {
  const [email, setEmail] = useState<any>("");
  const [amount, setAmount] = useState<any>("");

  const [loading, setLoading] = useState<boolean>(false);
  return (
    <div>
      <div className="mt20 bg-black min-h-[300px] pb-20 text-white flex flex-col items-center">
        <div className="w-[80%]">
          <p className="mt-20 text-[40px] md:text-[70px] leading-tight text-center">
            Importance for <br className="block md:hidden" />
            STEM <br className="hidden md:block" />
            Education
          </p>

          <div className="flex justify-center w-full">
            <p className="mt-10 text-[15px] md:text-[20px] md:w-[90%] lg:w-[70%] text-center leading-tight">
              STEM Education stimulates critical thinking by engaging students
              in actively analyzing, evaluating, and applying knowledge to solve
              problems, This approach prepares students for future challenges
              where logical reasoning and problem-solving skills are Paramount.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col justify-center items-center w-full">
        <p className="text-[20px] font-serif uppercase mb-5 ">
          Your Donation means more to us!
        </p>
        <div className="w-[80%] md:w-[600px] border">
          <div className="flex flex-col p-4 mb-1">
            <label className="text-[12px] font-semibold ">Email</label>
            <input
              type="email"
              className="h-[45px] border outline-none pl-2"
              placeholder="Please Enter a valid email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col px-4 mb-2">
            <label className="text-[12px] font-semibold ">Amount</label>
            <input
              type="text"
              className="h-[45px] border outline-none pl-2"
              placeholder="Please Enter the Amount you want to give"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="ml-4 px-12 mb-5 cursor-pointer py-3 bg-black text-white mt-5"
            onClick={() => {
              setLoading(true);
              // makeDonation({})
              //   .then((res) => {
              //     console.log(res.data.data.authorization_url);
              //     if (res.status === 201) {
              //       toast.success("Awesome");
              //       window.location.assign(res.data.data.authorization_url);
              //     } else {
              //       toast.error("Error");
              //       setLoading(false);
              //     }
              //   })
              //   .finally(() => {
              //     setLoading(false);
              //   });
            }}
          >
            {loading ? (
              <div className="flex gap-2 items-center">
                <FaSpinner className="animate-spin" />
                <span>Processing</span>
              </div>
            ) : (
              "Proceed"
            )}
          </button>
        </div>
        <div className="my-10" />
      </div>
    </div>
  );
};

export default DonateScreen;
