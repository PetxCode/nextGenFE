import { useGallary } from "@/hooks/useGallary";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import moment from "moment";
import { MdArrowForward, MdPerson } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { uploadMultiple, uploadSingle } from "@/api/API";
import { mutate } from "swr";

const UploadGallary = () => {
  const { data }: any = useGallary();

  const [hover, setHover] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [single, setSingle] = useState<boolean>(false);
  const [view, setView] = useState<string>("");

  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [imageArr, setImageArr] = useState<any>([]);

  const handleImage = (e: any) => {
    setImage(e.target.files[0]);
  };

  const uploadSingleUpload = (e: any) => {
    e.preventDefault();

    console.log(image);

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("avatar", image);
    uploadSingle(formData)
      ?.then((res) => {
        console.log(res);
        if (res.status === 201) {
          alert("Image uploaded successfully");
          mutate(`api/view-gallary/`);
        }
      })
      .finally(() => {
        setLoading(false);
        setImage("");
        setTitle("");
      });
  };

  const handleImageMultiple = (e: any) => {
    setImageArr(e.target.files);
  };

  const uploadMultipleUpload = (e: any) => {
    e.preventDefault();
    console.log(imageArr);
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    let imageData: any = [];

    for (let i of imageArr) {
      imageData.push(i);
      formData.append("avatar", i);
    }

    uploadMultiple(formData)
      ?.then((res) => {
        console.log(res);
        if (res.status === 201) {
          alert("Image uploaded successfully");
          mutate(`api/view-gallary/`);
        }
      })
      .finally(() => {
        setLoading(false);
        // setImage("");
        // setTitle("");
      });

    setLoading(false);
  };

  return (
    <div className="pt-[40px] p-4">
      <Link
        to="/"
        className="my-5 pb-[2px] border-b border-blue-950 text-blue-950 font-medium "
      >
        Go Back
      </Link>

      <div className="border p-4 mt-5 flex flex-col gap-3">
        <div className="flex gap-10">
          <div
            className={` ${
              !single && "border-b-2 border-blue-950"
            } pb-[5px]  text-blue-950 cursor-pointer`}
            onClick={() => {
              setSingle(false);
            }}
          >
            upload single
          </div>
          <div
            className={` ${
              single && "border-b-2 border-blue-950"
            } pb-[5px] text-blue-950 cursor-pointer`}
            onClick={() => {
              setSingle(true);
            }}
          >
            upload multiples
          </div>
        </div>
        <div className="mt-10" />
        {!single ? (
          <form
            onSubmit={uploadSingleUpload}
            className="col-span-1 md:col-span-2 min-h-[300px] "
          >
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <input
                className="h-[45px] py-3 md:py-0  md:min-h-[50px] lg:min-h-[70px]  pl-2 border border-black text-black outline-none"
                placeholder="title single image"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="flex mb-10 bg-white">
                <div className="flex items-center border justify-center h-[55px] w-[225px] text-[20px] hover:bg-black hover:text-white transition-all duration-300 cursor-pointer ">
                  <div className="h-full border-r flex justify-center items-center">
                    <MdPerson className="mr-5" />
                  </div>
                  <label
                    htmlFor="avatar"
                    className="uppercase font-semibold ml-5 text-[14px]"
                  >
                    Upload Image
                  </label>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImage}
                  />
                </div>
              </div>
            </div>

            <div className="mt-2" />
            <p className="font-light tracking-wider text-[12px]">
              By signing up, you agree to be responsible for your account, use
              the website lawfully, allow us to modify or remove your content,
              acknowledge that we may suspend or terminate your account for
              violations, and that we are not liable for any damages or losses
              from your use of the website.
            </p>

            <div className="flex">
              <div className="flex items-center mt-10 border justify-center h-[55px] w- pr-4 text-[20px] hover:bg-black hover:text-white transition-all duration-300 cursor-pointer">
                <div className="h-full border-r flex justify-center items-center">
                  {loading ? (
                    <FaSpinner className="animate-spin mx-4" />
                  ) : (
                    <MdArrowForward className="mx-4" />
                  )}
                </div>
                <button
                  className="uppercase font-semibold ml-5"
                  // onClick={createUser}
                  type="submit"
                >
                  {loading ? (
                    <div className="text-[15px]">Processing</div>
                  ) : (
                    "Upload single image"
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form
            onSubmit={uploadMultipleUpload}
            className="col-span-1 md:col-span-2 min-h-[300px] "
          >
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <input
                className="h-[45px] py-3 md:py-0  md:min-h-[50px] lg:min-h-[70px]  pl-2 border border-black text-black outline-none"
                placeholder="title multiple image"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="flex mb-10 bg-white">
                <div className="flex items-center border justify-center h-[55px] w-[225px] text-[20px] hover:bg-black hover:text-white transition-all duration-300 cursor-pointer ">
                  <div className="h-full border-r flex justify-center items-center">
                    <MdPerson className="mr-5" />
                  </div>
                  <label
                    htmlFor="avatar"
                    className="uppercase font-semibold ml-5 text-[14px]"
                  >
                    Upload Images
                  </label>
                  <input
                    id="avatar"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageMultiple}
                  />
                </div>
                {/* {myImage && (
                <div className="h-[55px] w-[55px] border-y border-r">
                  <img src={myImage} className="h-full object-cover" />
                </div>
              )} */}
              </div>
            </div>

            <div className="mt-2" />
            <p className="font-light tracking-wider text-[12px]">
              By signing up, you agree to be responsible for your account, use
              the website lawfully, allow us to modify or remove your content,
              acknowledge that we may suspend or terminate your account for
              violations, and that we are not liable for any damages or losses
              from your use of the website.
            </p>

            <div className="flex">
              <div className="flex items-center mt-10 border justify-center h-[55px] w- pr-4 text-[20px] hover:bg-black hover:text-white transition-all duration-300 cursor-pointer">
                <div className="h-full border-r flex justify-center items-center">
                  {loading ? (
                    <FaSpinner className="animate-spin mr-4" />
                  ) : (
                    <MdArrowForward className="mx-4" />
                  )}
                </div>
                <button
                  className="uppercase font-semibold ml-5"
                  // onClick={createUser}
                  type="submit"
                >
                  {loading ? (
                    <div className="text-[15px]">Processing</div>
                  ) : (
                    "Upload Multiple image"
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

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
                        <p className="uppercase font-medium">Title</p>
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

export default UploadGallary;
