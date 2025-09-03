declare global {
  interface String {
    includesIgnoreCase(searchString: string): boolean;
    formatAsMac(): string;
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

String.prototype.formatAsMac = function () {
  return this.match(/.{1,2}/g)?.join(":") ?? "???";
};

/**
 * Converts a simple wildcard pattern to a regular expression.
 * Supports * and ? as wildcard characters.
 * @param pattern The wildcard pattern to convert.
 * @returns The regular expression.
 */
export const patternToRegex = (pattern: string) => {
  const escaped = pattern.replace(/[-\/\\^$+.()|[\]{}]/g, "\\$&");
  const regexString = "^" + escaped.replace(/\*/g, ".*").replace(/\?/g, ".") + "$";
  return new RegExp(regexString, "i");
};
