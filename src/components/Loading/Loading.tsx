export const Loading = ({ active = true }: { active: boolean }) => {
  return (
    <div>
      <div className="flex justify-center items-center rounded-full bg-[#ff4400] w-24 h-24 m-10">
        <div
          className={`w-24 h-24 rounded-full bg-[#ff440068] animate-ping ${active ? "" : "hidden"}`}
        ></div>
      </div>
      <img
        className="w-16 h-16 mx-auto my-4 absolute transform -translate-y-34 translate-x-14"
        src="/reddit-positive.png"
        alt="reddit smiling robot"
      />
    </div>
  );
};
