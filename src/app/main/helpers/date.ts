
export function convertJsonDateToString(jsonDate: string): string {
    // Extract the timestamp from the JSON date
    const timestampMatch = jsonDate.match(/\d+/);
    if (!timestampMatch) {
      throw new Error("Invalid JSON date format");
    }
  
    const timestamp = parseInt(timestampMatch[0], 10);
  
    // Convert the timestamp to a Date object
    const dateObject = new Date(timestamp);
  
    // Format the Date object as a string with "MM/DD/YYYY" pattern
    const formattedDateString = dateObject.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  
    return formattedDateString;
  }