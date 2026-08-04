import { Outlet, UNSAFE_useScrollRestoration } from "react-router-dom";
import Navbar from "../component/Navbar";
import TopNavbar from "../component/TopNavbar";
import { Heart } from "lucide-react";
import Footer from "../component/Footer";
import ScrollRestoration from "../component/ScrollRestoration";
import { useRef } from "react";

const MainLayout = () => {
    const scrollRef = useRef(null);
    return (
        <div className="bg-[#F2F4F7] min-h-screen ">
            <div className="flex min-h-screen w-full flex-col">
                <div className="fixed w-full z-10">
                    <TopNavbar />
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto pb-0 py-14 ">
                    <ScrollRestoration scrollContainerRef={scrollRef}></ScrollRestoration>
                    <Outlet />
                    <button className="fixed md:bottom-6 bottom-20 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-300/50 transition hover:bg-red-700">
                        <Heart className="h-6 w-6 fill-white" />
                    </button>
                </div>

                <Navbar />
                <Footer></Footer>
                <UNSAFE_useScrollRestoration></UNSAFE_useScrollRestoration>
            </div>
        </div>
    );
};

export default MainLayout;