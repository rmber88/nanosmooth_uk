export default function getThirtyDaysFromToday(): Date {
  const today = new Date();
  today.setDate(today.getDate() + 28); // Add 30 days to the current date
  return today;
}
