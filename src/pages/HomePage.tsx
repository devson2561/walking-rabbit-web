import "mapbox-gl/dist/mapbox-gl.css";

import { Cancel } from "iconoir-react";
import { useEffect, useState } from "react";
import Map, { GeolocateControl, Marker } from "react-map-gl";
import { Link } from "react-router-dom";

import MachineCard from "../components/home/MachineCard";
import { Machine } from "../interfaces/macine.interface";
import machineService from "../services/machine.service";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZGV2c29uMjU2MSIsImEiOiJjbGhjOWtjdnMwdTVqM3JwY2U4aGp4ODh4In0.0SJusQqlWyCm7NLeeT6YxA";
const imgUrl =
  "https://positioningmag.com/wp-content/uploads/2021/12/TAO-BIN-01.jpg";

export default function HomePage() {
  const [viewport, setViewport] = useState({
    longitude: 100.523186,
    latitude: 13.736717,
    zoom: 12,
  });
  const [machines, setMachines] = useState<Machine[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [activeMachine, setActiveMachine] = useState<Machine | undefined>(
    undefined
  );

  const fetchMachines = async () => {
    const data = await machineService.list();
    setMachines(data);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setViewport({
        ...viewport,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        zoom: 12,
      });
    });
    fetchMachines();
  }, []);

  return (
    <div className="bg-white w-screen h-screen">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
        <div className="absolute right-0 top-0 bottom-0 bg-white w-[20vw] max-w-md flex flex-col gap-2 p-2 overflow-y-auto">
          {machines.map((machine: Machine, i: number) => (
            <MachineCard key={`machine-card-${i}`} machine={machine} />
          ))}
        </div>
        {machines.map((machine: Machine, i: number) => (
          <Marker
            key={`machine-${i}`}
            longitude={machine.location.coordinates[1]}
            latitude={machine.location.coordinates[0]}
            anchor="bottom"
            onClick={() => {
              setActiveMachine(machine);
              setShowPopup(true);
            }}
          >
            <img src="logo.png" alt="" className="w-16" />
          </Marker>
        ))}
        {showPopup && activeMachine && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.8)] flex flex-col justify-center items-center">
            <div className="bg-white border flex flex-col items-center px-2 py-4 gap-2 max-w-sm w-full">
              <div className="flex flex-row justify-end w-full mb-2">
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setActiveMachine(undefined);
                  }}
                >
                  <Cancel className="text-lg text-black" />
                </button>
              </div>
              <img
                src={imgUrl}
                alt=""
                className="w-[150px] h-[150px] object-contain"
              />
              <h2 className="text-lg font-[500] text-black  mb-2">
                {activeMachine.title}
              </h2>
              <Link to={`/machines/${activeMachine.id}`}>
                <button className="btn btn-primary btn-sm">
                  Go to machine
                </button>
              </Link>
            </div>
          </div>
        )}
      </Map>
    </div>
  );
}
