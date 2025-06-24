"use client";
import { useRef } from "react";
import styles from "./code_input.module.css";

type CodeInputProps = {
  code: string[];
  setCode: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function CodeInput({ code, setCode }: CodeInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < code.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center sm:justify-between gap-2 sm:gap-3 flex-wrap sm:flex-nowrap mb-6">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {inputsRef.current[index] = el}}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-3xl border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 ${styles.number_input}`}
        />
      ))}
    </div>
  );
}
