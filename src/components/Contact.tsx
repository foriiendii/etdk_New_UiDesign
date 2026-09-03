import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, FocusEvent } from "react";
import type { SanityContact } from "types";

const WINE = "var(--color-primary-dark, #2c1728)";
const GOLD = "var(--color-primary-light, #d4af6a)";
const BLUSH = "var(--color-secondary, #e7a9b4)";
const LAVENDER = "#cdb8dd";
const CREAM = "#f4ece9";

// Applied as an inline style rather than a utility class: the global base layer sets
// `span { @apply font-bebas; }`, and an inline font-family reliably wins over that.
const POPPINS = "'Poppins', system-ui, sans-serif";

type Props = SanityContact & {
  date: string;
  romanEdition: string;
};

// Reveals children once, the first time the element scrolls into view.
const useInView = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible] as const;
};

const Contact = ({
  date,
  romanEdition,
  address,
  phone,
  email,
  facebook,
  instagram,
}: Props) => {
  const [sectionRef, visible] = useInView<HTMLDivElement>();
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");

  // No backend mail service is wired up (yet) - this opens the visitor's own
  // mail app with the message pre-filled, the same approach as the header's
  // "Igazolások kérése" button, addressed to whatever contact email is set
  // in Sanity (falls back to the ETDK inbox if that's empty).
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = email || "etdk@kmdsz.ro";
    const subject = `Kapcsolatfelvétel – ${formName || "ETDK weboldal"}`;
    const body = `Név: ${formName}\nEmail: ${formEmail}\n\n${formMessage}`;
    window.location.href = `mailto:${target}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const inputStyle = {
    borderColor: "rgba(255,255,255,0.18)",
  };
  const focusBorder = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = GOLD;
  };
  const blurBorder = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
  };

  return (
    <div
      ref={sectionRef}
      style={{ backgroundColor: WINE }}
      className="min-h-screen-safe relative flex w-full flex-col items-center justify-center overflow-hidden px-5 pb-10 pt-20 text-center sm:px-6 sm:pt-24 lg:px-11"
    >
      <div className="relative">
        <div id="kapcsolat" className="absolute -top-[140px]" />
      </div>

      <span
        aria-hidden="true"
        className="font-bebas pointer-events-none absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[15vw] leading-none"
        style={{ color: "rgba(255,255,255,0.035)" }}
      >
        ETDK
      </span>

      {/* thin decorative line-art, desktop only */}
      <svg
        className="pointer-events-none absolute -right-5 top-6 hidden w-[380px] opacity-55 lg:block"
        viewBox="0 0 400 200"
        fill="none"
      >
        <path
          d="M0 100 C 80 50, 160 150, 240 95 S 400 40, 400 100"
          stroke={GOLD}
          strokeWidth="1"
          opacity="0.7"
        />
        <path
          d="M0 130 C 80 80, 160 180, 240 125 S 400 70, 400 130"
          stroke={BLUSH}
          strokeWidth="1"
          opacity="0.7"
        />
      </svg>
      <svg
        className="pointer-events-none absolute -left-14 bottom-6 hidden w-[420px] -scale-x-100 opacity-55 lg:block"
        viewBox="0 0 400 200"
        fill="none"
      >
        <path
          d="M0 100 C 80 50, 160 150, 240 95 S 400 40, 400 100"
          stroke={LAVENDER}
          strokeWidth="1"
          opacity="0.6"
        />
        <path
          d="M0 130 C 80 80, 160 180, 240 125 S 400 70, 400 130"
          stroke={GOLD}
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>

      <h1
        className="font-bebas relative z-10 max-w-5xl uppercase leading-[0.96] text-[#f4ece9] transition-all duration-700 ease-out"
        style={{
          fontSize: "clamp(2.9rem, 1.5rem + 6.4vw, 7rem)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          transitionDelay: "80ms",
        }}
      >
        Találkozunk
        <br />
        <span style={{ color: BLUSH }}>Kolozsváron</span>
      </h1>

      <div
        className="relative z-10 mb-8 mt-9 w-full max-w-[880px] sm:mb-10 sm:mt-12"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          transitionDelay: "200ms",
        }}
      >
        <span
          className="block normal-case tracking-normal"
          style={{
            fontFamily: POPPINS,
            fontWeight: 600,
            fontSize: "clamp(1.25rem, 2.1vw, 1.6rem)",
            letterSpacing: "-0.005em",
            color: CREAM,
          }}
        >
          Kolozsvári Magyar Diákszövetség (KMDSZ)
        </span>

        <div
          className="mb-7 mt-6 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)",
          }}
        />

        <div className="flex flex-col items-stretch sm:flex-row sm:items-start sm:justify-center">
          {[
            address && { label: "Cím", value: address },
            phone && { label: "Telefon", value: phone, href: `tel:${phone}` },
            email && { label: "E-mail", value: email, href: `mailto:${email}` },
          ]
            .filter((item): item is { label: string; value: string; href?: string } =>
              Boolean(item)
            )
            .map((item, i) => (
              <div
                key={item.label}
                className={`min-w-0 flex-1 px-0 py-4 sm:px-7 sm:py-0 ${
                  i > 0
                    ? "border-t border-[rgba(255,255,255,0.12)] sm:border-l sm:border-t-0"
                    : ""
                }`}
              >
                <span
                  className="font-open mb-2.5 block uppercase"
                  style={{
                    fontWeight: 600,
                    fontSize: "10.5px",
                    letterSpacing: "0.2em",
                    color: GOLD,
                    opacity: 0.85,
                  }}
                >
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="block break-words normal-case tracking-normal no-underline transition-colors duration-200"
                    style={{
                      fontFamily: POPPINS,
                      fontWeight: 500,
                      fontSize: "clamp(0.98rem, 1.15vw, 1.06rem)",
                      color: CREAM,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = GOLD;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = CREAM;
                    }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <span
                    className="block break-words normal-case tracking-normal"
                    style={{
                      fontFamily: POPPINS,
                      fontWeight: 400,
                      fontSize: "clamp(0.98rem, 1.15vw, 1.06rem)",
                      color: CREAM,
                    }}
                  >
                    {item.value}
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 mb-9 w-full max-w-[560px] rounded-2xl border p-6 text-left transition-all duration-700 ease-out sm:mb-11 sm:p-8"
        style={{
          borderColor: "rgba(255,255,255,0.14)",
          backgroundColor: "rgba(255,255,255,0.04)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transitionDelay: "230ms",
        }}
      >
        <span
          className="font-open mb-5 block text-center uppercase"
          style={{
            fontWeight: 600,
            fontSize: "10.5px",
            letterSpacing: "0.2em",
            color: GOLD,
            opacity: 0.85,
          }}
        >
          Írj nekünk
        </span>

        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            required
            placeholder="Neved"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            onFocus={focusBorder}
            onBlur={blurBorder}
            className="font-open w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-[#f4ece9] outline-none transition-colors placeholder:text-[rgba(244,236,233,0.4)]"
            style={inputStyle}
          />
          <input
            type="email"
            required
            placeholder="E-mail címed"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            onFocus={focusBorder}
            onBlur={blurBorder}
            className="font-open w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-[#f4ece9] outline-none transition-colors placeholder:text-[rgba(244,236,233,0.4)]"
            style={inputStyle}
          />
        </div>

        <textarea
          required
          rows={4}
          placeholder="Megjegyzésed"
          value={formMessage}
          onChange={(e) => setFormMessage(e.target.value)}
          onFocus={focusBorder}
          onBlur={blurBorder}
          className="font-open mt-4 w-full resize-none rounded-lg border bg-transparent px-4 py-3 text-sm text-[#f4ece9] outline-none transition-colors placeholder:text-[rgba(244,236,233,0.4)]"
          style={inputStyle}
        />

        <div className="mt-5 flex justify-center sm:justify-start">
          <button
            type="submit"
            className="font-bebas w-full rounded-full border py-3 text-base uppercase tracking-[0.04em] transition-colors duration-200 sm:w-auto sm:px-10"
            style={{ borderColor: GOLD, color: GOLD }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = GOLD;
              e.currentTarget.style.color = WINE;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = GOLD;
            }}
          >
            Küldés
          </button>
        </div>
        <p
          className="font-open mt-4 text-center text-[11px] leading-5 sm:text-left"
          style={{ color: "rgba(244,236,233,0.45)" }}
        >
          A Küldés gombra kattintva a saját e-mail programod nyílik meg egy
          előre kitöltött levéllel.
        </p>
      </form>

      <div
        className="relative z-10 mb-9 flex items-center gap-3.5 transition-all duration-700 ease-out sm:mb-11"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transitionDelay: "260ms",
        }}
      >
        {facebook && (
          <a
            href={facebook}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full border transition-transform duration-200 hover:-translate-y-0.5"
            style={{ borderColor: GOLD, backgroundColor: "#f6efe6" }}
          >
            <Image src="/facebook.png" height={20} width={20} alt="facebook" />
          </a>
        )}
        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full border transition-transform duration-200 hover:-translate-y-0.5"
            style={{ borderColor: GOLD, backgroundColor: "#f6efe6" }}
          >
            <Image src="/instagram.png" height={20} width={20} alt="instagram" />
          </a>
        )}
      </div>

      <div
        className="font-open relative z-10 w-auto max-w-full whitespace-normal border-t px-3 pt-5 text-center text-[11px] uppercase tracking-[0.12em] transition-all duration-700 ease-out lg:whitespace-nowrap"
        style={{
          borderColor: "rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.35)",
          opacity: visible ? 1 : 0,
          transitionDelay: "320ms",
        }}
      >
        {romanEdition}. Reál és Humántudományi ETDK — Kolozsvár • {date}
      </div>
    </div>
  );
};

export default Contact;