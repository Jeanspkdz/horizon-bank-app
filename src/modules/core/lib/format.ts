export function formatMoney(
  money: number,
  currency: string,
  locale: string = "en-US"
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });

  return formatter.format(money);
}

export function formatDate(date: string, locale: string = "en-US"){

  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    hour12: true,
    minute: "2-digit"
  })

  return formatter.format(new Date(date))
}