import { useParams } from "react-router-dom";
import ECourierOrderPlace from "./ECourier/ECourierOrderPlace";
import RedXOrderPlace from "./Redx/RedXOrderPlace";

const Courier = () => {
  const { courier_service } = useParams();
  if (courier_service === "COURIER_TYPE_ECOURIER")
    return <ECourierOrderPlace />;
  if (courier_service === "COURIER_TYPE_REDX") return <RedXOrderPlace />;
};

export default Courier;
