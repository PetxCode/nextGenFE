import { FC, useEffect, useState } from "react";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
} from "framer-motion";
import useMeasure from "react-use-measure";
import lodash from "lodash";
import { useUserAccount } from "@/hooks/useGallary";

const SchoolLogos = () => {
  const { data }: any = useUserAccount();

  const [ref, { width }] = useMeasure();
  let xMovement = useMotionValue(0);

  const SLOW: number = 160;
  const FAST: number = 80;

  const [duration, setDuration] = useState<number>(FAST);

  const [finished, setFinished] = useState<boolean>(false);
  const [render, setRender] = useState<boolean>(false);

  const schools = lodash.countBy(data, "schoolName");

  useEffect(() => {
    let control;
    let finalPosition = -width / 2;

    if (finished) {
      control = animate(xMovement, [xMovement.get(), finalPosition], {
        ease: "linear",
        duration: duration * (1 - xMovement.get() / finalPosition),
        onComplete: () => {
          setRender(!render);
          setFinished(false);
        },
      });
    } else {
      control = animate(xMovement, [0, finalPosition], {
        ease: "linear",
        duration: duration,
        repeat: Infinity,
        repeatDelay: 0,
        repeatType: "loop",
      });
    }

    return () => control?.stop();
  }, [xMovement, width, duration, render]);

  return (
    <div className="overflow-hidden my-10">
      <motion.div
        onHoverStart={() => {
          setDuration(SLOW);
          setFinished(true);
        }}
        onHoverEnd={() => {
          setDuration(FAST);
          setFinished(true);
        }}
        ref={ref}
        style={{ x: xMovement }}
        className="flex w-max gap-4"
      >
        {[
          ...Object.keys(schools),
          ...Object.keys(schools),
          ...Object.keys(schools),
        ].map((el: any, i: number) => (
          <Card key={i} el={el} />
        ))}
      </motion.div>
    </div>
  );
};

export default SchoolLogos;

interface iProps {
  el: string;
}
const Card: FC<iProps> = ({ el }) => {
  const [hover, setHover] = useState<boolean>(false);
  return (
    <motion.div
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="border overflow-hidden rounded-md w-[200px] h-[150px] cursor-pointer relative"
    >
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute h-full w-full flex justify-center items-center "
          >
            <div className="absolute insert-0 h-full w-full bg-black opacity-15 top-0 left-0 z-20" />
          </motion.div>
        )}
      </AnimatePresence>

      <p className=" text-center w-full h-full flex items-center justify-center text-[15px] font-semibold uppercase px-4">
        {el}
      </p>
    </motion.div>
  );
};
