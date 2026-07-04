import "./App.css";
import Routing from "./Routing/routing";
import { useHeartbeat } from "./useHeartbeat";

export default function App() {
  useHeartbeat();

  return (
    <>
      <Routing />
    </>
  );
}