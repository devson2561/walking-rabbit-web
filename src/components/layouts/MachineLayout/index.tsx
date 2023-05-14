import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import useMachineStore from "../../../store/useMachineStore";

export default function MachineLayout() {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const isReadyPickup = useMachineStore((state) => state.isReadyPickup);
  const setPickupStatus = useMachineStore((state) => state.setPickupStatus);
  const setMachineId = useMachineStore((state) => state.setMachineId);
  const loadStocks = useMachineStore((state) => state.loadStocks);

  useEffect(() => {
    setMachineId(machineId);
    if (machineId) {
      loadStocks(machineId);
    }
  }, [machineId]);

  return (
    <div className="w-screen h-screen bg-[rgba(0,0,0,0.5)] flex flex-col items-center justify-center">
      <div className="bg-white w-full max-w-4xl flex flex-col p-4 pt-10 pb-20 rounded-sm min-w-[800px]">
        <div className="flex flex-row gap-5 mb-10">
          {/* logo */}
          <div className="flex flex-col items-center w-[150px]">
            <img src="/logo.png" alt="" className="w-20 h-20" />
            <h2 className="text-primary">WALKING RABBIT</h2>
          </div>
          {/* screen */}
          <div className="flex-1  min-w-[500px] h-[600px] border-2 border-[black] rounded-sm overflow-hidden">
            <Outlet />
          </div>
          {/* coffee box */}
          <button
            className="w-[150px] h-30 bg-black h-[200px] flex flex-col items-center justify-center"
            onClick={() => navigate(`/machines/${machineId}/stock`)}
          >
            <div className="text-white text-lg">View Stock</div>
          </button>
        </div>

        <div className="flex flex-row">
          <div className="flex-1 flex flex-col justify-between">
            <div className="w-[150px]  bg-black h-[80px] flex flex-col p-2 gap-2"></div>
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
            <div className="w-[150px] h-30 bg-black h-[200px] flex flex-col items-center justify-center gap-4">
              {isReadyPickup ? (
                <>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2367/2367626.png"
                    alt=""
                    className="w-20 h-20"
                  />

                  <button
                    className="btn btn-primary btn-xs"
                    onClick={() => {
                      setPickupStatus(false);
                      navigate(`/machines/${machineId}`);
                    }}
                  >
                    รับสินค้า
                  </button>
                </>
              ) : null}
            </div>
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
    </div>
  );
}
