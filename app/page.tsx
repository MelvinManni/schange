import SearchCombobox from "@/components/common/search-combobox";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-100px)] flex-col items-center p-12 sm:p-24  bg-[url(/images/bg_cover.png)] bg-no-repeat bg-center">
      <div className="flex w-full justify-center">
        <div className="max-w-[800px] text-center">
          <h4 className="font-body text-xl">
            Your Passport to Global Finances - Stay Ahead with Real-Time Exchange Rates and Expert Insights. Unravel the Currency Maze, Make Informed Decisions.
          </h4>
          <h1 className="text-4xl font-bold font-lato">Navigating the World of Currency, One Rate at a Time.</h1>
        </div>
      </div>

      <div className=" w-full flex-col flex justify-center items-center mt-20 md:mt-40">
        <SearchCombobox />
      </div>
    </main>
  );
}
