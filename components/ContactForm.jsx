"use client";

import { useState, useRef, useEffect } from "react";
// import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (document.querySelector('script[src*="recaptcha/api.js"]')) return;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);
  }, []);
  //   const recaptchaRef = useRef();

  const showStatus = (msg, type = "error") => {
    setStatus({ msg, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    // const token = recaptchaRef.current.getValue();

    // if (!token) {
    //   showToast("Please verify captcha");
    //   return;
    // }

    setLoading(true);

    if (typeof window === "undefined" || !window.grecaptcha) {
      showStatus("reCAPTCHA not loaded yet, please try again");
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
      showStatus("reCAPTCHA verification failed");
      setLoading(false);
      return;
    }

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      message: e.target.message.value,
      contact_method: e.target["contact-method"]?.value || "",
      token
      //   recaptcha: token,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        showStatus("Message sent successfully! We'll get back to you shortly.", "success");
        e.target.reset();
        // recaptchaRef.current.reset();
      } else {
        showStatus("Something went wrong, please try again");
      }
    } catch (err) {
      console.error(err);
      showStatus("Error submitting form, please try again");
    }

    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" placeholder="Full Name" className="ip-form-input" required />
        <input name="email" type="email" placeholder="Email Address" className="ip-form-input" required />
        <input name="phone" placeholder="Phone Number" className="ip-form-input" />
        <textarea name="message" placeholder="Your Message" rows="5" className="ip-form-textarea" required />
        <div className="flex flex-col gap-2">
          <span className="text-sm">Best way to reach you?</span>
          <div className="flex gap-6">
          <label className="flex gap-2">
            <input type="radio" name="contact-method" value="email" />
            Email
          </label>
          <label className="flex gap-2">
            <input type="radio" name="contact-method" value="phone" />
            Phone
          </label>
          </div>
        </div>

        {/*
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          ref={recaptchaRef}
        /> */}

        <button
          type="submit"
          disabled={loading}
          className="ip-btn ip-btn-primary flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Sending...
            </>
          ) : (
            <>Send Message →</>
          )}
        </button>

        {status && (
          <div
            role={status.type === "success" ? "status" : "alert"}
            aria-live={status.type === "success" ? "polite" : "assertive"}
            className={`flex items-center gap-3 text-[15px] font-medium ${
              status.type === "success"
                ? "text-[#5c296c]/60"
                : "px-4 py-3 border border-solid border-[#B3261E] bg-[#B3261E]/10 text-[#8C1D18]"
            }`}
          >
            {status.type === "success" ? (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v6M12 16.5v.5" />
              </svg>
            )}
            <span>{status.msg}</span>
          </div>
        )}
      </form>
    </>
  );
}