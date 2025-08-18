import { useMe } from "../hooks/auth/useMe";
import Consumption from "../components/home/Consumption";
import Goal from "../components/home/Goal";
import Grape from "../components/home/Grape";
import Header from "../components/home/Header";
import NavLayout from "../components/layouts/NavLayout";

export default function HomePage() {
  const { user } = useMe();

  return (
    <NavLayout>
      <div className="bg-bg-blue flex flex-col gap-8 pb-5">
        <div>
          <Header name={user?.name || ""}/>
          <Grape goal={"영국 가즈아"} date={20} usedBudget={1000} goalBudget={200000}/>
          <Goal goal={"영국 가즈아"} startDate={"25.08.01"} endDate={"25.08.31"} goalBudget={200000}/>
        </div>
        <Consumption/>
      </div>
    </NavLayout>
  );
}
