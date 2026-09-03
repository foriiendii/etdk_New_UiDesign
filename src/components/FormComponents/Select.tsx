import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Fragment, useEffect, useState } from "react";
import type { SelectOption } from "types";

export default function Select({
  options,
  onChange,
  value,
  disabled,
  placeholder,
  setAdditional,
  bg = "",
  text = "",
  error = false,
}: {
  options: SelectOption[] | undefined;
  onChange: (value: string | number) => void;
  value: SelectOption | null;
  setAdditional?: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  bg?: string;
  text?: string;
  error?: boolean;
}) {
  const [query, setQuery] = useState("");
  const filteredOptions =
    query === "" || !options
      ? options
      : options.filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase());
        });

  useEffect(() => {
    if (!value) {
      setQuery("");
    }
  }, [value]);

  return (
    <Combobox
      value={value}
      onChange={(e) => {
        if (e) {
          onChange(e.value);
          if (setAdditional) {
            setAdditional(undefined);
          }
        }
      }}
      disabled={disabled}
    >
      {({ open }) => (
        <>
          <div className="relative flex flex-col">
            <span className="mb-1 block pl-1 font-open text-[11px] font-bold uppercase tracking-[0.12em] text-[#a58d90]">
              {placeholder}
            </span>
            <div
              className={classNames(
                "relative flex h-12 w-full cursor-default items-center rounded-xl border bg-white pl-4 pr-10 text-left font-open text-base font-medium text-[#2c1728] outline-none transition-colors focus-within:border-[#d4af6a] focus-within:ring-2 focus-within:ring-[#d4af6a]/20",
                error ? "border-red-500 ring ring-red-200" : "border-[#2c1728]/15",
                disabled ? "opacity-60" : ""
              )}
            >
              <Combobox.Input
                autoComplete="off"
                onChange={(event) => setQuery(event.target.value)}
                title={query || value?.name || placeholder || ""}
                className="block w-full truncate bg-transparent font-open text-base font-medium text-[#2c1728] outline-none placeholder:text-[#a58d90]"
                placeholder={placeholder || ""}
                displayValue={(option: SelectOption | undefined) =>
                  option?.name || ""
                }
              />
              {!disabled && (
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDownIcon
                    className="h-4 w-4 text-[#d4af6a]"
                    aria-hidden="true"
                    onClick={() => setQuery("")}
                  />
                </Combobox.Button>
              )}
            </div>
            {filteredOptions && !!filteredOptions.length && (
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-[#2c1728]/10 bg-white py-1 font-open text-sm shadow-[0_16px_38px_rgba(44,23,40,0.16)] focus:outline-none">
                  {filteredOptions.map((option) => (
                    <Combobox.Option
                      key={option.value}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-[#f5f1ed] text-[#2c1728]" : "text-[#2c1728]",
                          "relative cursor-pointer select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={option}
                    >
                      {({ selected }) => (
                        <>
                          <div className="flex items-center">
                            <div
                              title={option.name}
                              className="ml-1 block truncate font-open text-sm font-normal tracking-tight ui-selected:font-semibold"
                            >
                              {option.name}
                            </div>
                          </div>

                          {selected ? (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#d4af6a]">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Transition>
            )}
          </div>
        </>
      )}
    </Combobox>
  );
}
