import Image from "next/image";
import styles from "./page.module.css";
import ViewerModels from "./components/ViewerModels";

export default function Home() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div style={{ position: 'absolute', zIndex: 99, height: 200, width: 100, left: 50, backgroundColor: "rgb(200,150,150)", top: 20 }} />

      <div style={{ position: 'absolute', zIndex: 99, height: 200, width: 100, right: 50, backgroundColor: "rgb(200,150,150)", top: 20 }} />

      <ViewerModels />

    </div>
  );
}
