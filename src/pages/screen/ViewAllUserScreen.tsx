import { useUserAccount } from "@/hooks/useGallary";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import moment from "moment";
import { MdDelete } from "react-icons/md";
import { deleteUserAccount } from "@/api/API";
import { mutate } from "swr";

const ViewUsers = () => {
  const { data }: any = useUserAccount();

  const [hover, setHover] = useState<boolean>(false);
  const [view, setView] = useState<string>("");

  return (
    <div className="pt-[40px] p-4">
      <Link
        to="/"
        className="my-5 pb-[2px] border-b border-blue-950 text-blue-950 font-medium "
      >
        Go Back
      </Link>
      <div className="border rounded-md min-h-[50vh] mt-5 p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {data &&
            data?.map((el: any, i: number) => (
              <motion.div
                onHoverStart={() => {
                  setHover(true);
                  setView(`${i}`);
                }}
                onHoverEnd={() => {
                  setHover(false);
                  setView("");
                }}
                key={i}
                className="h-full w-full relative overflow-hidden rounded-md"
              >
                <div className="absolute top-0 left-0 h-full w-full flex justify-center">
                  <AnimatePresence>
                    {hover && view === `${i}` && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-black/30 h-full w-full cursor-pointer"
                      />
                    )}

                    {hover && view === `${i}` && (
                      <motion.div
                        initial={{ y: 300 }}
                        animate={{ y: 0 }}
                        exit={{ y: 120 }}
                        className="text-black bg-white h-28 w-[90%] absolute z-10 bottom-5 p-2 flex flex-col "
                      >
                        <p className="uppercase font-medium">
                          {el.firstName} {el.lastName}
                        </p>
                        <p className=" font-medium">{el.schoolName}</p>

                        <p className="text-[12px] font-medium -mt-2">
                          Created: {moment(el?.createdAt).fromNow()}
                        </p>
                        <div className="flex-1" />
                        <div className="text-[13px] font-medium">
                          <div className="flex gap-5">
                            <p>stage1: {el.stage1Score}</p>
                            <p>stage2: {el.stage2Score}</p>
                          </div>
                          <div className="flex gap-5 -mt-1">
                            <p>stage3: {el.stageScore}</p>
                            <p>stage4: {el.stage4Score}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <MdDelete
                  className="absolute top-1 right-3 text-red-500 text-[26px] mt-3 cursor-pointer hover:text-red-600 transition-all duration-300"
                  onClick={() => {
                    deleteUserAccount(el?._id)?.then((res) => {
                      mutate(`api/users/`);
                      console.log(res);
                    });
                  }}
                />

                <img
                  src={el?.image}
                  alt="Gallery"
                  className="w-full border h-[350px] rounded-md object-cover cursor-pointer"
                />
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;
