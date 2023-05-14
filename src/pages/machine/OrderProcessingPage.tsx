import { ArrowLeft } from "iconoir-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Order } from "../../interfaces/order.interface";
import { Process } from "../../interfaces/process.interface";
import orderService from "../../services/order.service";
import useMachineStore from "../../store/useMachineStore";

export default function OrderProcessingPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const setPickupStatus = useMachineStore((state) => state.setPickupStatus);

  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const fetchOrder = async () => {
    if (!orderId) return;

    const data = await orderService.get(orderId);
    setOrder(data);

    let processes = data?.beverage?.processes ?? [];

    let t =
      processes.length > 0
        ? processes
            .filter((p) => p.duration && p.title)
            .reduce((total, current) => total + +(current.duration ?? 0), 0)
        : 30;

    setTimeLeft(t);

    let interval = setInterval(() => {
      t -= 1;
      setTimeLeft(t);
      if (t === 0) {
        clearInterval(interval);
        setIsCompleted(true);
        setPickupStatus(true);
      }
    }, 1000);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  let processes = order?.beverage?.processes;
  processes = processes
    ?.filter((p) => p.duration && p.title)
    .sort((a, b) => a.index! - b.index!);

  let activeProcess: Process | undefined;

  if (processes && processes?.length > 0) {
    const processTime =
      processes.length > 0
        ? processes
            .filter((p) => p.duration && p.title)
            .reduce((total, current) => total + +(current.duration ?? 0), 0)
        : 30;

    const time = processTime - timeLeft;

    for (const index in processes) {
      const processIndex = +index;
      const process = processes[processIndex];
      const duration = +(process.duration ?? 0);

      const prev = processes[processIndex - 1];
      const next = processes[processIndex + 1];

      const prevTotalDuration = processIndex === 0 ? 0 : prev.totalDuration;

      process.totalDuration = (prevTotalDuration ?? 0) + (duration ?? 0);

      if (next) {
        next.totalDuration = process.totalDuration + (next.duration ?? 0);
        if (time >= process.totalDuration && time < next.totalDuration) {
          activeProcess = process;
        } else if (!prev && processIndex === 0) {
          activeProcess = process;
        }
      } else {
        if (time >= process.totalDuration) {
          activeProcess = process;
        }
      }
    }
  }

  const renderContent = () => {
    if (isCompleted) {
      return (
        <>
          <h2>ทำรายการสำเร็จ กรุณารับเครื่องดื่ม</h2>
        </>
      );
    } else {
      return (
        <>
          <div className="text-base">เหลือเวลา</div>
          <div className="text-2xl my-2">{timeLeft}</div>
          {activeProcess ? (
            <div className="text-lg">{activeProcess.title}</div>
          ) : (
            <div className="text-lg">กำลังดำเนินการ...</div>
          )}
        </>
      );
    }
  };

  return (
    <div className="bg-[white] h-full flex flex-col items-center pt-5 relative">
      <h2 className="text-xl text-[black] font-[500] mb-10">สั่งเครื่องดื่ม</h2>
      {order ? (
        <>
          <div className="flex flex-col items-center gap-4 w-full">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2367/2367626.png"
              alt=""
              className="w-20 h-20 mb-4"
            />

            {renderContent()}

            <div className="w-full max-w-md flex flex-col gap-4 mb-4"></div>
          </div>
        </>
      ) : null}
    </div>
  );
}
