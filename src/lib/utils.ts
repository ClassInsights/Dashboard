declare global {
  interface String {
    includesIgnoreCase(searchString: string): boolean;
  }
  interface Array<T> {
    shuffle(): this;
  }
  interface Date {
    formatToDay(): string;
  }
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

String.prototype.includesIgnoreCase = function (searchString: string) {
  return this.toLowerCase().includes(searchString.toLowerCase());
};

Array.prototype.shuffle = function () {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }

  return this;
};

Date.prototype.formatToDay = function () {
  return this.toLocaleDateString("de-AT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
