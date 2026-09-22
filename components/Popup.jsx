"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
// import { usePreloader } from './PreloaderContext'

const POPUP_SEEN_KEY = "popupSeen";

export default function Popup() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const timerTriggeredRef = useRef(false);
    // const { alreadyShown } = usePreloader();

    useEffect(() => {
        let alreadySeen = false;
        try {
            alreadySeen = sessionStorage.getItem(POPUP_SEEN_KEY) === "true";
        } catch (e) {
            // Private mode / storage blocked: fall through and show the popup.
        }

        // Don't interrupt someone who deep-linked straight to a section
        // (e.g. "/#get-in-touch" from an inner page) — they came here to act.
        const arrivedViaHash = window.location.hash.length > 1;

        if (alreadySeen || arrivedViaHash || pathname === "/contact") return;

        timerTriggeredRef.current = false;
        let rafId = null;

        const timer = window.setTimeout(() => {
            timerTriggeredRef.current = true;
            setIsOpen(true);
        }, 3000);

        const onScroll = () => {
            if (timerTriggeredRef.current || rafId != null) return;
            rafId = window.requestAnimationFrame(() => {
                rafId = null;
                if (timerTriggeredRef.current) return;
                if (window.scrollY > 1024) {
                    window.clearTimeout(timer);
                    timerTriggeredRef.current = true;
                    setIsOpen(true);
                }
            });
        };

        const scrollOpts = { passive: true };
        window.addEventListener("scroll", onScroll, scrollOpts);

        return () => {
            window.clearTimeout(timer);
            if (rafId != null) window.cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", onScroll, scrollOpts);
        };
    }, [pathname]);

    const closePopup = () => {
        try {
            sessionStorage.setItem(POPUP_SEEN_KEY, "true");
        } catch (e) {
            // Storage blocked: the popup simply shows again next visit.
        }
        setIsOpen(false);
        document.body.style.overflow = "auto"; // enable scroll
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen z-100 flex flex-col justify-center items-center">
            <div className="absolute h-full w-full bg-black/85 z-0" onClick={closePopup}></div>
            <div className="popup__content relative w-full lg:w-275 z-50 flex flex-col lg:flex-row items-center justify-center bg-white rounded-3xl overflow-hidden">
                <button className="absolute top-2.5 right-5 font-bold text-[20px] cursor-pointer border-none bg-transparent! text-black! z-10" onClick={closePopup}>
                    ✕
                </button>
                <div className="w-full h-50 lg:h-full p-5 relative flex flex-col justify-start items-end">
                    <img
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        src="/assets/about-bg.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="w-full p-10 flex flex-col gap-10">
                    <h3 className="text-[#003777] text-[22px] md:text-[37px] font-extrabold uppercase tracking-wide leading-[1.1] transition-colors duration-500">
                        We would love to hear from you!
                    </h3>
                    <p className="text-[#434961] text-[16px] md:text-[17px] leading-[26px] md:leading-[28px]">
                        We are so confident that you will appreciate and value our services, that we will create radiation plans for FREE for the first month from the date of the signed contract (maximum 2 plans per week for the first month).  In essence, it’s a “try before you buy” structure with no strings attached!
                    </p>
                    <div className="flex flex-col lg:flex-row gap-2 justify-center items-center">
                        <a href="/contact" className="ip-btn ip-btn-primary gap-[3px]! ">Get In Touch <span>→</span></a>
                        <button className="ip-btn ip-btn-primary" onClick={closePopup}>
                            Not! Just Yet.
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}