'use client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import GetInTouch from './GetInTouch'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

const ReviewSlider = dynamic(() => import('./ReviewSlider'), {
  ssr: false,
  loading: () => <div className="min-h-[280px] w-full" aria-hidden />,
})

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function HomeClient({ bannerData }) {
  // const API = process.env.NEXT_PUBLIC_API_URL
  // const [bannerData, setBannerData] = useState(null)
  const [mobile, setMobile] = useState(false);
  const videoRef = useRef(null)
  const [showBannerVideo, setShowBannerVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const [hoverData, setHoverData] = useState({
    heading: 'Head & Neck',
    para: 'Head and neck cancers have often been associated with very difficult and time-consuming radiation',
    button_title: 'Discover More',
    button_url: '/contact',
  })

  const handleHover = (e) => {
    const { heading, para, button_title, button_url } = e.target.dataset
    setHoverData({ heading, para, button_title, button_url })
  }

  useEffect(() => {
    setMobile(window.innerWidth <= 768)
  }, [])

  useEffect(() => {
    const loadVideo = () => setShowBannerVideo(true);

    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadVideo);
    } else {
      setTimeout(loadVideo, 2000);
    }
  }, []);


  useGSAP(() => {
    if (!bannerData) return
    if (screen.width > 1024) {
      gsap.set('.s-3-div-1, .s-3-div-3', { width: 620, height: 566 })
      gsap.set('.s-4-bg-image', { scale: 1.05 })
      gsap.set('.s-3-div-2', { width: 620 })
      let fcH1_Y = 200
      if (window.innerWidth < 1500) {
        fcH1_Y = 70
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.first-container',
          start: 'top+=100 top',
          end: '+=400',
          scrub: 1,
        },
      })
      tl.to(videoRef.current, { opacity: 0.5, ease: 'power4.inOut' })
        .to('.fCH1', { y: fcH1_Y, ease: 'power1.inOut' }, '<')
        .to('.second-c-div', { y: 0, ease: 'power4.inOut' }, '<')
        .to('.s-3-video', { y: -200, ease: 'power1.inOut' }, '<')

      const s_3_divs_padding = [{ left: '278px' }, { right: '278px' }]
      if (screen.width < 1600) {
        s_3_divs_padding.left = '20px'
        s_3_divs_padding.right = '20px'
      }

      const tls3 = gsap.timeline({
        scrollTrigger: {
          trigger: '.section-3',
          start: 'top 70%',
          end: '+=500',
          scrub: 1,
        },
      })
      tls3
        .to('.s-3-video', { width: '100%', left: '0%', height: '100%', top: '0%', y: 0, ease: 'power4.inOut' })
        .to('.s-3-video-overlay', { opacity: 0.8 }, '<')
        .to('.s-3-divs', { paddingBottom: '66px', paddingLeft: s_3_divs_padding.left, paddingRight: s_3_divs_padding.right }, '<')
        .to('.s-3-div-1, .s-3-div-3', { width: '393px', height: '394px' }, '>')
        .to('.s-3-content', { y: 0 }, '<')
        .to('.s-3-div-2', { y: 0, width: '532px', height: '532px' }, '<')
        .to('.s-3-video', { y: 0 }, '>')

      const tls5 = gsap.timeline({
        scrollTrigger: {
          trigger: '.section-5',
          start: 'top 80%',
          end: '+=500',
          scrub: 1,
        },
      })
      tls5
        .to('.s-5-c-1', { y: 0, opacity: 1, duration: 1 })
        .to('.s-5-h2, .s-5-p, .s-5-button', { y: 0, opacity: 1, duration: 1 }, '<')

      let area_main_y = 300,
        area_main_scale = 1.8
      if (window.innerWidth <= 1500) {
        area_main_y = 250
        area_main_scale = 1.2
      }
      const tls4 = gsap.timeline({
        scrollTrigger: {
          trigger: '.section-4',
          start: 'top top',
          end: '+=500',
          scrub: 1,
        },
      })
      tls4
        .to('.area-main', { scale: area_main_scale, rotate: 180, duration: 1 })
        .to('.s-4-heading-2', { opacity: 0, duration: 2 }, '<')
        .to('.s-4-heading-1', { opacity: 1, duration: 2 }, '<')
        .to('.area-main', { y: area_main_y, duration: 2 }, '<')
        .to('.s-4-bg-color', { height: '20%', duration: 2 }, '<')
        .to('.s-4-bg-image', { scale: 1.8, rotate: -180, duration: 2 }, '<')
        .to('.content-main', { scale: 1, rotate: 180, duration: 2 }, '<')
        .to('.content-main', { opacity: 1, duration: 2 }, '>')
    }
  }, { dependencies: [bannerData] })

  return (
    <section>
      {/* ── Hero ── */}
      <div className="first-container bg-main-video relative">
        <div className="relative w-full h-full flex justify-center items-end pb-10 lg:pb-[50px] 3xl:pb-[179px]">
          <Image
            src="/assets/banner-video-poster.webp"
            alt="Banner Video Poster"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            fetchPriority='high'
          />
          {showBannerVideo && !mobile &&
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-1000"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={{
                opacity: videoReady ? 1 : 0,
              }}
              onCanPlay={() => setVideoReady(true)}
            >
              <source
                src={bannerData?.acf?.banner_fields?.background_video?.url}
                type="video/mp4"
              />
            </video>}

          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1]">
            <Image
              src="/assets/fade-overlay-new.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              loading="lazy"
            />
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none" className='w-full h-full'>
              <defs>
                <radialGradient id="fade" cx="50%" cy="50%" r="70%">
                  <stop offset="25%" stop-color="#ffffff" stop-opacity="0" />
                  <stop offset="55%" stop-color="#ffffff" stop-opacity="0.5" />
                  <stop offset="90%" stop-color="#ffffff" stop-opacity="0.95" />
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="1" />
                </radialGradient>
              </defs>
              <rect width="1920" height="1080" fill="url(#fade)" />
            </svg> */}
          </div>
          <div className="hidden absolute lg:top-[200px] 2xl:top-[275px] lg:left-[10px] 4xl:top-[380px] 4xl:left-[210px] 2xl:left-[120px] lg:flex lg:flex-row-reverse lg:gap-[38px] z-10">
            {bannerData?.acf?.banner_fields?.hotspot_image_2?.url && (
              <img loading="lazy" decoding="async" src={bannerData.acf.banner_fields.hotspot_image_2.url} alt={bannerData.acf.banner_fields.hotspot_image_2.alt ?? bannerData?.acf?.banner_fields?.banner_heading} />
            )}
            <p className="text-[16px] lg:text-[20px] text-[#434961] leading-[24px] w-[280px] content-end text-end mb-[-37px] relative z-10">
              {bannerData?.acf?.banner_fields?.hotspot_text_2}
            </p>
          </div>
          <div className="hidden absolute 4xl:top-[150px] 4xl:right-[16.3%] lg:top-[100px] lg:right-[10.3%] lg:flex lg:gap-[9px] z-10">
            {bannerData?.acf?.banner_fields?.hotspot_image_1?.url && (
              <img loading="lazy"
                decoding="async" src={bannerData.acf.banner_fields.hotspot_image_1.url} alt={bannerData?.acf?.banner_fields?.banner_heading ?? bannerData?.acf?.banner_fields?.banner_heading} />
            )}
            <p className="text-[20px] text-[#434961] leading-[24px] w-[200px] content-end mb-[-25px] relative z-10">
              {bannerData?.acf?.banner_fields?.hotspot_text_1}
            </p>
          </div>
          <div className="px-4 sm:px-0 z-10 relative">
            <h1 className="fCH1 text-[22px] sm:text-[28px] lg:text-[60px] lg:leading-12 text-center leading-7 sm:leading-8 xl:text-[100px] text-[#003777] xl:leading-24 -tracking-[2.5px] font-extrabold">
              {bannerData?.acf?.banner_fields?.banner_heading}
            </h1>
            <div className="second-c-div flex lg:px-10 lg:hidden justify-center flex-col items-center gap-[10px] pt-[20px]">
              <p className="w-full px-5 text-center text-[16px] lg:text-[22px] lg:leading-8 leading-5 tracking-[-0.65px]">
                {bannerData?.acf?.section_1_fields?.description}
              </p>
              <a href={bannerData?.acf?.section_1_fields?.button?.url} className="ip-btn ip-btn-primary w-fit mt-3">
                {bannerData?.acf?.section_1_fields?.button?.title} <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tagline ── */}
      <div className="hidden lg:flex w-full justify-center items-center">
        <div className="second-c-div flex justify-center flex-col items-center gap-[36px] py-[36px] top-25">
          <p className="w-full px-2 lg:px-0 text-[16px] leading-5 lg:w-[695px] text-center lg:text-[22px] lg:leading-9.25 tracking-[-0.65px]">
            {bannerData?.acf?.section_1_fields?.description}
          </p>
          <a href="/contact" className="ip-btn ip-btn-primary w-fit mt-3">
            {bannerData?.acf?.section_1_fields?.button?.title} <span>→</span>
          </a>
        </div>
      </div>

      {/* ── Section 3 (Desktop Scroll Animation) ── */}
      {!mobile &&
        <div className="min-h-[150dvh] hidden lg:block relative">
          <div className="section-3 w-full min-h-dvh overflow-hidden sticky top-0">
            <video
              className="s-3-video absolute inset-0 h-full w-full object-cover origin-center"
              poster="/assets/3rd-sec-video-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              style={{ width: '35%', left: '32.5%', height: '65%', top: '37%' }}
            >
              {bannerData?.acf?.section_2_fields?.background_video?.url && (
                <source src={bannerData.acf.section_2_fields.background_video.url} type="video/mp4" />
              )}
            </video>
            <div className="s-3-video-overlay absolute inset-0 h-full w-full object-cover bg-[#0A388D] opacity-0 z-2 mix-blend-screen"></div>
            <div className="pt-[93px] z-5 relative">
              <div className="s-3-content flex justify-center flex-col items-center relative z-10 gap-[38px] translate-y-[400px]">
                <h2 className="text-[70px] font-extrabold text-white">
                  {bannerData?.acf?.section_2_fields?.heading}
                </h2>
                <p className="w-[532px] text-[26px] text-center text-white">
                  {bannerData?.acf?.section_2_fields?.description}
                </p>
              </div>
              <div className="pt-[61px] flex flex-row items-center 2xl:justify-center gap-[23px] s-3-divs">
                <div className="s-3-div-1 relative group overflow-hidden w-[620px] h-[566px]">
                  <img loading='lazy' src={bannerData?.acf?.section_2_fields?.left_box?.background_image?.url} alt="3D Planning" className="h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center">
                    <h3 className="text-3xl font-bold text-white">{bannerData?.acf?.section_2_fields?.left_box?.heading}</h3>
                  </div>
                </div>
                <div className="s-3-div-2 relative group overflow-hidden translate-y-[800px] w-[620px]">
                  <img loading='lazy' src={bannerData?.acf?.section_2_fields?.middle_box?.background_image?.url} alt="VMAT" className="h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-blue-900/75 flex flex-col items-center justify-center px-6 text-center gap-[36px]">
                    <h3 className="text-4xl font-extrabold text-white">{bannerData?.acf?.section_2_fields?.middle_box?.heading}</h3>
                    <p className="text-blue-100 text-[22px] w-[432px] 2xl:w-[350px]">{bannerData?.acf?.section_2_fields?.middle_box?.description}</p>
                    <a href={bannerData?.acf?.section_2_fields?.middle_box?.button?.url} className="ip-btn ip-btn-primary w-fit mt-3">
                      {bannerData?.acf?.section_2_fields?.middle_box?.button?.title} <span>→</span>
                    </a>
                  </div>
                </div>
                <div className="s-3-div-3 relative group overflow-hidden w-[620px] h-[566px]">
                  <img loading='lazy' src={bannerData?.acf?.section_2_fields?.right_box?.background_image?.url} alt="IMRT" className="h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center">
                    <h3 className="text-3xl font-bold text-white">{bannerData?.acf?.section_2_fields?.right_box?.heading}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {mobile &&
        < div className="w-full flex flex-col justify-center items-center lg:hidden gap-10 py-10">
          <div className="w-full flex flex-col justify-center items-center lg:px-30 gap-5">
            <h2 className="text-[28px] lg:text-[40px] font-extrabold text-center text-[#003777]">{bannerData?.acf?.section_2_fields?.heading}</h2>
            <p className="w-full text-[16px] lg:text-[22px] px-8 text-center text-black">
              {bannerData?.acf?.section_2_fields?.description}
            </p>
          </div>
          <div className="w-full flex flex-col lg:flex-row lg:gap-2 justify-center items-center px-5 gap-10">
            <div className="w-full relative group overflow-hidden rounded-2xl">
              <img loading='lazy' src={bannerData?.acf?.section_2_fields?.left_box?.background_image?.url} alt="3D Planning" className="h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">{bannerData?.acf?.section_2_fields?.left_box?.heading}</h3>
              </div>
            </div>
            <div className="w-full relative group overflow-hidden rounded-2xl">
              <img loading='lazy' src={bannerData?.acf?.section_2_fields?.middle_box?.background_image?.url} alt="VMAT" className="h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-blue-900/75 flex flex-col items-center justify-center px-6 text-center gap-[36px]">
                <h3 className="text-4xl font-extrabold text-white uppercase">{bannerData?.acf?.section_2_fields?.middle_box?.heading}</h3>
                <p className="text-blue-100 text-[16px] w-10/12 text-center">{bannerData?.acf?.section_2_fields?.middle_box?.description}</p>
                <a href={bannerData?.acf?.section_2_fields?.middle_box?.button?.url} className="ip-btn ip-btn-primary w-fit mt-3">
                  {bannerData?.acf?.section_2_fields?.middle_box?.button?.title} <span>→</span>
                </a>
              </div>
            </div>
            <div className="w-full relative group overflow-hidden rounded-2xl">
              <img loading='lazy' src={bannerData?.acf?.section_2_fields?.right_box?.background_image?.url} alt="IMRT" className="h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">{bannerData?.acf?.section_2_fields?.right_box?.heading}</h3>
              </div>
            </div>
          </div>
        </div>
      }

      {/* ── Section 4 (Wheel — Desktop) ── */}
      <div className="min-h-[200dvh] hidden lg:block">
        <div className="section-4 w-full min-h-dvh flex justify-center items-center sticky top-0">
          <div className="w-full h-full">
            <div
              className="s-4-bg-color w-full h-full flex justify-center absolute left-0 top-0 items-center"
              style={{ backgroundColor: bannerData?.acf?.section_3_fields?.background_color }}
            >
              <h2 className="s-4-heading-1 text-[38px] w-[500px] top-[44%] left-[45.3%] text-white font-extrabold text-center -tracking-[0.95px] opacity-0">
                {bannerData?.acf?.section_3_fields?.heading}
              </h2>
              {/* <p className="w-full text-[16px] lg:text-[22px] px-8 text-center text-black">
                {bannerData?.acf?.section_2_fields?.description}
              </p> */}
            </div>
            <div className="s-4-bg-image-c w-full h-full flex justify-center absolute left-0 top-0">
              <img loading='lazy' src={bannerData?.acf?.section_3_fields?.background_image?.url} alt="" className="s-4-bg-image scale-105" />
            </div>
            <div className="flex flex-row justify-center">
              <h2 className="s-4-heading-2 text-[38px] w-[180px] absolute top-[44%] left-[45.3%] text-white font-extrabold text-center -tracking-[0.95px]">
                {bannerData?.acf?.section_3_fields?.heading}
              </h2>
              <div className="area-main">
                <div className="content-main z-5 opacity-0">
                  <div className="innter-content">
                    <h2 className="text-[#003777] s-4-heading-change text-[24px] text-center font-extrabold">{hoverData.heading}</h2>
                    <p className="text-[#003777] s-4-para-change text-center !text-[18px]">{hoverData.para}</p>
                    <div className="m-auto flex justify-center">
                      <a href={hoverData.button_url} className="flex flex-col justify-center items-center w-[223px] h-[54px] rounded-full bg-[#003777]! text-white! hover:bg-white! hover:text-[#003777]! border border-[#003777] transition-all! duration-500!">
                        {hoverData.button_title}
                      </a>
                    </div>
                  </div>
                </div>
                {bannerData?.acf?.section_3_fields?.areas_of_focus_wheel?.map((area, index) => (
                  <div className={`image-0${index + 1}`} key={index}>
                    <img
                      src={area.image.url}
                      alt={area.heading}
                      onMouseEnter={handleHover}
                      data-heading={area.heading}
                      data-para={area.description}
                      data-button_title={area.button.title}
                      data-button_url={area.button.url}
                      style={{ width: '250px', height: '150px' }}
                      loading='lazy'
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 5 ── */}
      <div className="section-5 w-full lg:min-h-dvh lg:mt-[400px] 3xl:mt-[500px] relative flex flex-col lg:flex-row justify-start items-center lg:justify-between lg:items-stretch gap-[38px] px-5 4xl:px-[140px]">
        <div className="flex flex-col justify-center lg:gap-[38px] gap-[55px] w-full lg:w-1/2">
          <div
            className="s-5-c-1 flex flex-col justify-between gap-[32px] p-10 lg:opacity-0 lg:translate-y-[500px]"
            style={{ background: 'linear-gradient(45deg, #003777, #0E3CF6)', borderRadius: '32px' }}
          >
            <h2 className="text-[20px] lg:text-[48px] text-white -tracking-[1.2px] lg:leading-[52px] font-bold lg:w-[500px]">
              {bannerData?.acf?.section_4_fields?.left_top_box?.heading}
            </h2>
            <p className="text-[16px] lg:text-[26px] text-white -tracking-[0.65px] lg:leading-[37px] 4xl:w-[694px]">
              {bannerData?.acf?.section_4_fields?.left_top_box?.description}
            </p>
            <a href={bannerData?.acf?.section_4_fields?.left_top_box?.button?.url} className="ip-btn ip-btn-outline w-fit">
              {bannerData?.acf?.section_4_fields?.left_top_box?.button?.title} <span>→</span>
            </a>
          </div>
          <div>
            <img loading='lazy' src={bannerData?.acf?.section_4_fields?.left_bottom_box?.background_image?.url} className="w-full" alt="" />
          </div>
        </div>
        <div
          className="flex flex-col justify-center lg:justify-start p-10 gap-[32px] rounded-[32px] bg-no-repeat bg-cover bg-bottom w-full lg:w-1/2 relative"
        >
          <img src={bannerData?.acf?.section_4_fields?.right_box?.background_image?.url} alt={bannerData?.acf?.section_4_fields?.right_box?.heading} className='absolute top-0 left-0 object-cover w-full h-full' loading='lazy' />
          <h2 className="relative s-5-h2 text-[28px] lg:text-[48px] text-white -tracking-[1.2px] lg:leading-[52px] font-bold lg:w-[500px] lg:opacity-0 lg:translate-y-[500px]">
            {bannerData?.acf?.section_4_fields?.right_box?.heading}
          </h2>
          <p className="relative s-5-p text-[16px] lg:text-[26px] text-white -tracking-[0.65px] lg:leading-[37px] 4xl:w-[694px] lg:opacity-0 lg:translate-y-[500px]">
            {bannerData?.acf?.section_4_fields?.right_box?.description}
          </p>
          <a href={bannerData?.acf?.section_4_fields?.right_box?.button?.url} className="ip-btn ip-btn-outline w-fit">
            {bannerData?.acf?.section_4_fields?.right_box?.button?.title} <span>→</span>
          </a>
        </div>
      </div>

      {/* ── Reviews & Contact ── */}
      <div
        className="review-section w-full relative"
      >
        <img loading='lazy' src="/assets/18773521_6022556_Artboard-new.webp" className='w-full h-full object-cover top-0 left-0 absolute' alt='Reviews Background' />
        <ReviewSlider data={bannerData?.acf?.section_5_fields} />
        <GetInTouch
          data={bannerData?.acf?.section_6_fields}
          faqLimit={3}
          faqViewAllHref="/faq/"
        />
      </div>
    </section >
  )
}
