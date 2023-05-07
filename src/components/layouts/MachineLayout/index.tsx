import { Outlet } from "react-router-dom";

export default function MachineLayout() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="bg-white w-full max-w-4xl flex flex-col p-4 pt-10 pb-20 rounded-sm min-w-[800px]">
        <div className="flex flex-row gap-5 mb-10">
          {/* logo */}
          <div className="flex flex-col items-center w-[150px]">
            <img src="/logo.png" alt="" className="w-20 h-20" />
            <h2 className="text-primary">WALKING RABBIT</h2>
          </div>
          {/* screen */}
          <div className="flex-1  min-w-[500px] h-[600px] border-2 border-[black] rounded-sm overflow-hidden p-2">
            <Outlet />
          </div>
          {/* coffee box */}
          <div className="w-[150px] h-30 bg-black h-[200px]"></div>
        </div>

        <div className="flex flex-row">
          <div className="flex-1 flex flex-col justify-between">
            <div className="w-[150px]  bg-black h-[80px] flex flex-col p-2 gap-2">
              <div className="flex flex-row items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[green]"></div>
                <div>หลอด</div>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[green]"></div>
                <div>ฝา</div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-[500] text-primary text-sm">
                @WalkingRabbit
              </div>
              <div className="font-[500] text-primary text-sm">
                walking-rabbit.thailand
              </div>
              <div className="font-[500] text-primary text-sm">
                WalkingRabbitBeverage
              </div>
              <div className="font-[500] text-primary text-sm">
                www.walking-rabbit.com
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-row justify-center">
            <div className="w-[150px] h-30 bg-black h-[200px]"></div>
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
    </div>
  );
}
