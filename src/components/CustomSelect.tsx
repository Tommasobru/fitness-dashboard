"use client";

import { useState, useRef, useEffect } from "react";

interface CustomSelectOption {
  value: number | string;
  label: string;
}

interface CustomSelectProps {
  value: number | string;
  onChange: (value: number | string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Seleziona...",
  disabled = false,
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Trova l'opzione selezionata
  const selectedOption = options.find((opt) => opt.value === value);

  // Chiudi dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Gestione keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          handleSelect(options[focusedIndex].value);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;

      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        break;

      case "Home":
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(0);
        }
        break;

      case "End":
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(options.length - 1);
        }
        break;

      default:
        break;
    }
  };

  // Scroll automatico all'opzione focalizzata
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && dropdownRef.current) {
      const focusedElement = dropdownRef.current.children[
        focusedIndex
      ] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [focusedIndex, isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        // Quando apriamo, focalizziamo l'opzione selezionata
        const selectedIndex = options.findIndex((opt) => opt.value === value);
        setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      } else {
        setFocusedIndex(-1);
      }
    }
  };

  const handleSelect = (optionValue: number | string) => {
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="custom-select-label"
        className={`
          w-full px-4 py-2
          bg-[var(--input-bg)]
          border border-[var(--input-border)]
          rounded-lg
          text-sm text-[var(--input-text)] font-medium
          focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
          transition-all
          duration-[var(--transition-base)]
          flex items-center justify-between gap-2
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-[var(--border-hover)]"}
          ${isOpen ? "ring-2 ring-[var(--primary)]" : ""}
        `}
      >
        <span className="truncate">
          {selectedOption?.label || placeholder}
        </span>

        {/* Chevron icon */}
        <svg
          className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-[var(--transition-base)] flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          role="listbox"
          aria-labelledby="custom-select-label"
          className={`
            absolute z-50 w-full mt-2
            bg-[var(--dropdown-bg)]
            border border-[var(--border)]
            rounded-lg
            overflow-hidden
            animate-in fade-in slide-in-from-top-2
            duration-[var(--transition-base)]
          `}
          style={{
            boxShadow: "var(--dropdown-shadow)",
          }}
        >
          <div className="max-h-60 overflow-y-auto">
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isFocused = index === focusedIndex;

              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`
                    px-4 py-2.5 cursor-pointer
                    text-sm text-[var(--text-primary)]
                    transition-colors duration-[var(--transition-fast)]
                    ${
                      isSelected
                        ? "bg-[var(--active-bg)] font-semibold text-[var(--primary)]"
                        : isFocused
                        ? "bg-[var(--hover-bg)]"
                        : "hover:bg-[var(--hover-bg)]"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-[var(--primary)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
