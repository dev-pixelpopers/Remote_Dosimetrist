'use client'
import { useEffect, useState } from 'react'
import FaqAccordionList from './FaqAccordionList'

export default function GetInTouch({ data, faqLimit, faqViewAllHref }) {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (document.querySelector('script[src*="recaptcha/api.js"]')) return;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (!data) return null

  const showToast = (msg) => {
    setToast(msg)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setToast(null)
    setLoading(true);

    if (typeof window === "undefined" || !window.grecaptcha) {
      showToast("reCAPTCHA not loaded yet, please try again");
      setLoading(false);
      return;
    }

    let token;
    try {
      token = await new Promise((resolve, reject) => {
        window.grecaptcha.ready(async () => {
          try {
            const t = await window.grecaptcha.execute(
              process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
              { action: "contact" }
            );
            resolve(t);
          } catch (err) {
            reject(err);
          }
        });
      });
    } catch (err) {
      console.error("reCAPTCHA error:", err);
      showToast("reCAPTCHA verification failed");
      setLoading(false);
      return;
    }

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      message: e.target.message.value,
      token: token
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const dataResp = await res.json()

      if (dataResp.success) {
        e.target.reset()
        setSent(true)
      } else {
        showToast('Something went wrong, please try again')
      }
    } catch (err) {
      console.error(err)
      showToast('Error submitting form, please try again')
    }

    setLoading(false)
  }

  return (
    <div className="bg-[#003777]/9 px-6 md:px-16 lg:px-28 py-12 md:py-20 w-full home-form relative" id="get-in-touch">
      <div className="flex flex-col lg:flex-row justify-between gap-12 md:gap-16">
        <form onSubmit={handleSubmit} className="w-full flex flex-col lg:gap-4 gap-10 items-start">
          <div className="flex flex-col lg:gap-2 gap-6">
            <p className="text-[18px] md:text-[22px] text-white px-5 py-1 bg-[#003777] w-fit">{data.sub_heading}</p>
            <div>
              <h3 className="text-[32px] md:text-[48px] text-black font-medium leading-tight tracking-0">{data.heading_1}</h3>
              <h3 className="text-[38px] md:text-[58px] text-black font-medium leading-tight tracking-0">{data.heading_2}</h3>
            </div>
          </div>

          {sent ? (
            <div
              role="status"
              aria-live="polite"
              className="w-full flex flex-col items-start gap-4 text-[#5c296c]/60"
            >
              <span className="w-14 h-14 rounded-full border border-solid border-current flex items-center justify-center">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <h4 className="text-[26px] md:text-[32px] font-semibold leading-tight">
                Message sent
              </h4>
              <p className="text-[16px] md:text-[18px]">
                Thanks for reaching out — we&apos;ve received your message and a member of our team
                will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="ip-btn ip-btn-outline-blue w-fit mt-2"
              >
                Send another message <span>→</span>
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col w-full gap-5">
                <input type="text" name="name" placeholder="Name" autoComplete="off" className="bg-transparent border-[#8EA7C4] px-6 py-5 text-[16px] text-[#5C296C] font-semibold border border-solid" required />
                <input type="text" name="phone" placeholder="Phone" autoComplete="off" className="bg-transparent border-[#8EA7C4] px-6 py-5 text-[16px] text-[#5C296C] font-semibold border border-solid" />
                <input type="email" name="email" placeholder="Email" autoComplete="off" className="bg-transparent border-[#8EA7C4] px-6 py-5 text-[16px] text-[#5C296C] font-semibold border border-solid" required />
                <textarea name="message" rows="4" placeholder="Message" autoComplete="off" className="bg-transparent min-h-[100px] xl:min-h-[188px] border-[#8EA7C4] text-[#5C296C] px-6 py-5 text-[16px] font-semibold border border-solid" required></textarea>
              </div>
              <div>
                <button type='submit' disabled={loading} className="ip-btn ip-btn-primary w-fit mt-3">
                  {loading ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Submit
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>

              {toast && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="w-full flex items-center gap-3 px-4 py-3 border border-solid border-[#B3261E] bg-[#B3261E]/10 text-[#8C1D18] text-[15px] font-medium"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v6M12 16.5v.5" />
                  </svg>
                  <span>{toast}</span>
                </div>
              )}
            </>
          )}
        </form>
        <div className="w-full flex flex-col gap-8">
          <div>
            <img loading='lazy' src={data.image?.url} alt={data.image?.alt ?? data.sub_heading} className="w-full" />
          </div>
          <FaqAccordionList
            faqs={faqLimit ? data.faqs?.slice(0, faqLimit) : data.faqs}
            viewAllHref={faqLimit && faqViewAllHref ? faqViewAllHref : undefined}
          />
        </div>
      </div>
    </div>
  )
}
