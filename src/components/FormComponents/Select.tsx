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
            <span className="pl-3">{placeholder}</span>
            <div
              className={classNames(
                error ? "ring ring-red-700" : "",
                `relative h-11 w-full cursor-default rounded-xl py-2 pl-3 pr-10 text-left text-lg shadow-sm focus:border-primaryDark focus:outline-none focus:ring-1 focus:ring-primaryDark sm:text-sm ${bg}`
              )}
            >
              <Combobox.Input
                autoComplete="off"
                onChange={(event) => setQuery(event.target.value)}
                title={query || value?.name || placeholder || ""}
                className={`${text} ${bg} sm:text-md block truncate text-lg font-semibold tracking-tight focus:outline-none placeholder:${text} placeholder:opacity-80`}
                placeholder={placeholder || ""}
                displayValue={(option: SelectOption | undefined) =>
                  option?.name || ""
                }
              />
              {!disabled && (
                <Combobox.Button className="absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronDownIcon
                    className={`h-5 w-5 ${text}`}
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
                <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border border-black bg-white py-1 text-base shadow-lg ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredOptions.map((option) => (
                    <Combobox.Option
                      key={option.value}
                      className={({ active }) =>
                        classNames(
                          active ? `${bg} ${text}` : "text-gray-900",
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
                              className="sm:text-md ml-1 block truncate text-lg font-normal tracking-tight ui-selected:font-semibold"
                            >
                              {option.name}
                            </div>
                          </div>

                          {selected ? (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primaryDark ui-active:text-white">
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
