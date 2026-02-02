"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Drawer } from "vaul";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

interface MobileSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  title?: string;
  triggerClassName?: string;
}

export function MobileSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  title = "Select an option",
  triggerClassName,
}: MobileSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label ?? placeholder;

  const handleSelect = (newValue: string) => {
    onValueChange(newValue);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile: Bottom Sheet Drawer */}
      <div className="block md:hidden">
        <Drawer.Root open={open} onOpenChange={setOpen}>
          <Drawer.Trigger asChild>
            <button
              type="button"
              style={{
                display: "flex",
                width: "fit-content",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                borderRadius: "6px",
                border: "1px solid var(--color-primary)",
                padding: "8px 12px",
                fontSize: "14px",
                color: "var(--color-primary)",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              className={triggerClassName}
            >
              <span>{displayValue}</span>
              <ChevronDown style={{ width: "16px", height: "16px", opacity: 0.5 }} />
            </button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
              }}
            />
            <Drawer.Content
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                height: "50vh",
                maxHeight: "50vh",
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem",
                borderTop: "1px solid var(--color-border-gold)",
                backgroundColor: "var(--color-bg-dark)",
              }}
            >
              {/* Drag handle */}
              <div
                style={{
                  margin: "12px auto",
                  height: "6px",
                  width: "48px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(212, 168, 83, 0.5)",
                  flexShrink: 0,
                }}
              />
              {/* Title */}
              <div style={{ padding: "16px", paddingTop: "0", textAlign: "center" }}>
                <Drawer.Title
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  {title}
                </Drawer.Title>
              </div>
              {/* Options */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  padding: "0 16px 32px 16px",
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "16px",
                      borderRadius: "8px",
                      textAlign: "left",
                      fontSize: "16px",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor:
                        value === option.value ? "var(--color-primary)" : "transparent",
                      color: value === option.value ? "var(--color-bg-dark)" : "white",
                      fontWeight: value === option.value ? 600 : 400,
                    }}
                  >
                    <span>{option.label}</span>
                    {value === option.value && <Check className="size-5" />}
                  </button>
                ))}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>

      {/* Desktop: Regular Select Dropdown */}
      <div className="hidden md:block">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger
            style={{
              width: "80px",
              border: "1px solid var(--color-primary)",
              color: "var(--color-primary)",
              backgroundColor: "transparent",
            }}
            className={triggerClassName}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent
            style={{
              backgroundColor: "var(--color-bg-dark)",
              border: "1px solid var(--color-primary)",
            }}
          >
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                style={{ color: "white" }}
                className="focus:bg-accent focus:text-surface"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
