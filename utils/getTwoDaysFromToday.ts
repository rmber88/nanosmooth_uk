export default function getTwoDaysFromToday(): string {
  const today = new Date();
  today.setDate(today.getDate() + 2); // Add 2 days to the current date

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(today);
}
