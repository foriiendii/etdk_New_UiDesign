import PageShell from "../../components/UtilityComponents/PageShell";
import { getThemeColors } from "../../../utils/getThemeColors";

const WINE = "var(--color-primary-dark, #2c1728)";
const GOLD = "var(--color-primary-light, #d4af6a)";

const FIELDS = [
  { id: "email", label: "E-mail cím", type: "email", autoComplete: "email" },
  { id: "szekcio", label: "Szekció", type: "text" },
  { id: "ev", label: "Év, amikor részt vettél", type: "text" },
] as const;

const inputClass =
  "font-open w-full rounded-xl border bg-white/70 px-4 py-3.5 text-[15.5px] outline-none transition-colors duration-200 focus:border-[var(--color-primary-light,#d4af6a)]";

const IgazolasKeres = () => {
  return (
    <PageShell
      eyebrow="Kapcsolat"
      title="Igazolás kérése"
    >
      <div className="max-w-[620px]">
        {/* NOTE: this form has no submit handler yet — the fields are collected
            but nothing is sent anywhere. See the accompanying note in the UI. */}
        <div className="flex flex-col gap-5">
          {FIELDS.map((field) => (
            <div key={field.id} className="flex flex-col gap-2">
              <label
                htmlFor={field.id}
                className="font-open text-[11px] uppercase tracking-[0.16em]"
                style={{ color: GOLD }}
              >
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                autoComplete={"autoComplete" in field ? field.autoComplete : undefined}
                className={inputClass}
                style={{ borderColor: "rgba(44,23,40,0.16)", color: WINE }}
              />
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="uzenet"
              className="font-open text-[11px] uppercase tracking-[0.16em]"
              style={{ color: GOLD }}
            >
              Üzenet
            </label>
            <textarea
              id="uzenet"
              name="uzenet"
              rows={6}
              className={`${inputClass} resize-y`}
              style={{ borderColor: "rgba(44,23,40,0.16)", color: WINE }}
            />
          </div>
        </div>

        <div
          className="mt-7 rounded-xl border px-4 py-3.5"
          style={{ borderColor: "rgba(44,23,40,0.16)", backgroundColor: "rgba(44,23,40,0.04)" }}
        >
          <p className="font-open text-[14px] leading-relaxed" style={{ color: "#6b5a63" }}>
            Az űrlap beküldése jelenleg nem működik. Amíg elkészül, igazolást a{" "}
            <a
              href="mailto:etdk@kmdsz.ro"
              className="font-semibold underline"
              style={{ color: WINE }}
            >
              etdk@kmdsz.ro
            </a>{" "}
            címen tudsz kérni.
          </p>
        </div>
      </div>
    </PageShell>
  );
};

// Only here to supply the Sanity theme colours, so this page renders in the
// same palette as every other one instead of falling back to the defaults.
export async function getServerSideProps({ preview = false }) {
  return {
    props: {
      themeColors: await getThemeColors(preview),
      preview,
    },
  };
}

export default IgazolasKeres;
