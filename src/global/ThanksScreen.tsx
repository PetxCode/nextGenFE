import { verifyDonation } from "@/api/API";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";

const ThankYouScreen = () => {
  const onHandleSubmit = async (e: any) => {
    e.preventDefault();
  };

  const { search } = useLocation();
  let ref = search.split("reference=")[1];

  useEffect(() => {
    verifyDonation(ref)?.then((res) => {
      console.log(res);
      if (res.status === 200) {
        toast.success("Donation verified successfully");
      }
    });
  }, []);

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center ">
      <Toaster />
      <main className="w-[80%] md:w-[500px] border rounded-md min-h-[200px] p-4">
        <form onSubmit={onHandleSubmit}>
          <div className="text-[25px] font-semibold">Donation Success</div>
          <div className="mb-10">Donation Success</div>

          <div className="text-[14px]  mb-10">
            Thank you very much for this Donation, This giving means so much to
            us as it will help make more significant changes in this Community!
          </div>

          <Link
            to="/"
            type="submit"
            className="mt-6 rounded-md bg-black text-white w-full py-3 flex justify-center"
          >
            Go back home
          </Link>
        </form>
      </main>
    </div>
  );
};

export default ThankYouScreen;
