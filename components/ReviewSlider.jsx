'use client'
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const reviews = [
  {
    rating: 5,
    text: 'Working for a busy radiation oncology department, it became quite difficult to manage the workload when a staff member decided to move onto a new venture. We needed help with the spikes we had in planning but really didn\'t need someone full time.',
    name: 'Richard K, CMD (Auburn, WA)',
  },
  {
    rating: 4,
    text: 'Nathan is an honest and dependable Dosimetrist. He filled in for our Varian platform clinic when we were overwhelmed by the high volume of patients. Nathan is pleasant to work with and easily accommodated the way our clinic provides dosimetry to our community.',
    name: 'Monique W, CMD (Tacoma, WA)',
  },
  {
    rating: 5,
    text: 'Nathan is very professional and a proficient medical dosimetrist. Nathan is very easy to work with. I would definitely use his expertise again! Thank you Nathan!',
    name: 'Janine M, RTT, Lead Therapist (Spokane, WA)',
  },
  {
    rating: 5,
    text: 'Working for a busy radiation oncology department, it became quite difficult to manage the workload when a staff member decided to move onto a new venture. We needed help with the spikes we had in planning but really didn\'t need someone full time.',
    name: 'Richard K, CMD (Auburn, WA)',
  },
  {
    rating: 4,
    text: 'Nathan is an honest and dependable Dosimetrist. He filled in for our Varian platform clinic when we were overwhelmed by the high volume of patients. Nathan is pleasant to work with and easily accommodated the way our clinic provides dosimetry to our community.',
    name: 'Monique W, CMD (Tacoma, WA)',
  },
  {
    rating: 5,
    text: 'Nathan is very professional and a proficient medical dosimetrist. Nathan is very easy to work with. I would definitely use his expertise again! Thank you Nathan!',
    name: 'Janine M, RTT, Lead Therapist (Spokane, WA)',
  },
]

function getInitial(name) {
  const match = (name || '').match(/[a-z]/i)
  return match ? match[0].toUpperCase() : ''
}

function ReviewCard({ review }) {
  const { isActive } = useSwiperSlide()

  return (
    <div className="review-main h-full p-6 transition-all duration-300 flex flex-col gap-10">
      <div className="flex flex-col">
        <div className="self-end">
          <div
            className="review-avatar w-[96px] h-[96px] rounded-full flex items-center justify-center select-none"
            aria-hidden="true"
          >
            <span className="text-[40px] font-semibold leading-none">{getInitial(review.name)}</span>
          </div>
        </div>
        <div className="flex gap-2 text-lg">
          {Array.from({ length: review.rating }).map((_, i) => (
            <span key={i}>
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20.1" viewBox="0 0 21 20.1">
                <path id="Icon_awesome-star" data-name="Icon awesome-star" d="M10.815.7,8.252,5.9l-5.735.836a1.257,1.257,0,0,0-.695,2.143l4.149,4.043L4.99,18.629a1.255,1.255,0,0,0,1.821,1.323l5.13-2.7,5.13,2.7a1.256,1.256,0,0,0,1.821-1.323l-.981-5.711,4.149-4.043a1.257,1.257,0,0,0-.695-2.143L15.631,5.9,13.068.7a1.257,1.257,0,0,0-2.253,0Z" transform="translate(-1.441 0.001)" fill="#fff" />
              </svg>
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-gray-600 text-sm lg:text-[22px] leading-relaxed">{review.text}</p>
      </div>
      <div>
        <p className="mt-4 text-lg font-semibold text-gray-600">{review.name}</p>
      </div>
    </div>
  )
}

export default function ReviewSlider({ data }) {
  if (!data) return null

  return (
    <div className="w-full py-12 md:py-24 lg:py-32 px-4 md:px-12 lg:px-16 flex flex-col gap-[47px] review-slider">
      <div className="flex flex-col justify-center items-center gap-5">
        <div className="flex flex-col justify-center items-center">
          <p className="bg-[#434961] text-[18px] md:text-[22px] text-white p-0.75 text-center w-[180px] md:w-[201px]">{data.heading}</p>
        </div>
        <div>
          <h2 className="text-[#003777] text-3xl md:text-5xl text-center leading-tight md:leading-13 font-semibold">{data.sub_heading}</h2>
        </div>
      </div>
      <div className="overflow-hidden">
        <Swiper
          modules={[Navigation]}
          navigation={true}
          loop={true}
          spaceBetween={30}
          slidesPerGroup={1}
          centeredSlides={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 1 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3 },
            1440: { slidesPerView: 3 },
          }}
          className="w-full review-slider"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index} className="!h-auto">
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
