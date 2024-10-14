import bg from "../assets/web_asset/bg.png";
// import globe from "../assets/web_asset/earth.png";
// import burret from "../assets/web_asset/burret.png";
// import test from "../assets/web_asset/testTube.png";
// import neuclus from "../assets/web_asset/neuclus.png";

const HeroScreen = () => {
  return (
    <div>
      <div
        className="relative h-[800px] text-white w-full flex flex-col justify-center items-center overflow-hidden"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute z-10">
          <h1 className="text-[180px] font-bold leading-tight">NEXTGeN</h1>
          <p className="-mt-10 text-[38px] font-semibold">
            A STEM Competition for Secondary Schools
          </p>
        </div>
        <div className="absolute w-full h-full bg-black opacity-30 inset-0" />
        {/* 
        <img
          src={globe}
          alt="globe"
          className="h-[310px] absolute top-36 left-0 "
        />

        <img
          src={burret}
          alt="globe"
          className="h-[360px] absolute -bottom-20 left-44 rotate-45 "
        />

        <img
          src={test}
          alt="globe"
          className="h-[510px] absolute top-5 right-10 "
        />

        <img
          src={neuclus}
          alt="globe"
          className="h-[360px] absolute -bottom-20 right-44"
        /> */}
      </div>
    </div>
  );
};

export default HeroScreen;
