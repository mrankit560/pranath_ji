export function formatSpiritualDate(dateInput: string | Date, lang: "hi" | "en" = "hi"): string {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  if (lang === "en") {
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const monthsHi = [
    "जनवरी",
    "फ़रवरी",
    "मार्च",
    "अप्रैल",
    "मई",
    "जून",
    "जुलाई",
    "अगस्त",
    "सितंबर",
    "अक्टूबर",
    "नवंबर",
    "दिसंबर",
  ];

  return `${d.getDate()} ${monthsHi[d.getMonth()]} ${d.getFullYear()}`;
}
