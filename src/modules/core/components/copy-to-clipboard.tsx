"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import {
  CopyToClipboard as CopyToClipboardWrapper,
  Props,
} from "react-copy-to-clipboard";
import { Button } from "@/modules/core/components/ui/button";

export const CopyToClipboardButton = ({ onCopy, text }: Props) => {
  const [hasCopied, setHasCopied] = useState(false);

  return (
    <CopyToClipboardWrapper
      text={text}
      onCopy={(text: string, result: boolean) => {
        if (result) {
          setHasCopied(true);
        }
        onCopy?.(text, result);

        setTimeout(() => {
          setHasCopied(false);
        }, 1500);
      }}
    >
        <Button 
        variant={"ghost"} 
        className="cursor-pointer hover:bg-gray-300/40 relative w-10 h-10 p-0"
      >
        <Copy 
          width={20} 
          height={20} 
          className={`
            absolute transition-transform duration-300
            ${!hasCopied 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-0"
            }
          `} 
        />
        
        <Check 
          width={20} 
          height={20} 
          className={`
            absolute transition-transform duration-300
            ${hasCopied 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-50"
            }
          `} 
        />
      </Button>
    </CopyToClipboardWrapper>
  );
};
