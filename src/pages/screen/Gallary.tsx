import { useGallary } from "@/hooks/useGallary";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import moment from "moment";

const Gallary = () => {
  const { data }: any = useGallary();

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
                        className="text-black bg-white h-20 w-[90%] absolute z-10 bottom-5 p-2 "
                      >
                        <p className="uppercase font-medium">{el.title}</p>
                        <p className="text-[12px] font-medium">
                          Created: {moment(el?.createdAt).fromNow()}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

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

export default Gallary;
