/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MoonPhaseInfo {
  name: string;
  emoji: string;
  description: string;
  percentage: number;
}

/**
 * Calculates the moon phase for a given date string.
 * Uses a reference new moon date of Jan 6, 2000.
 */
export function getMoonPhase(dateStr: string): MoonPhaseInfo | null {
  if (!dateStr) return null;
  const targetDate = new Date(dateStr);
  if (isNaN(targetDate.getTime())) return null;

  // Known new moon reference date: Jan 6, 2000
  const refDate = new Date(2000, 0, 6);
  // targetDate to local date start for reliable calculations
  const localTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  
  const diffTime = localTarget.getTime() - refDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const cycle = 29.530588853;
  let phase = (diffDays % cycle);
  if (phase < 0) phase += cycle;
  
  // Calculate percentage of illumination representation
  const percentage = Math.round((1 - Math.cos((phase / cycle) * 2 * Math.PI)) / 2 * 100);
  const stage = phase / cycle; // 0 to 1 ratio
  
  let name = "";
  let emoji = "";
  let description = "";
  
  if (stage < 0.03 || stage > 0.97) {
    name = "New Moon";
    emoji = "🌑";
    description = "A time of planting seeds, silent introspection, and potential hidden in darkness.";
  } else if (stage >= 0.03 && stage < 0.22) {
    name = "Waxing Crescent";
    emoji = "🌒";
    description = "Intention, emerging hopes, and alchemical activation of raw desires.";
  } else if (stage >= 0.22 && stage < 0.28) {
    name = "First Quarter";
    emoji = "🌓";
    description = "Decision-making, momentum, and overcoming initial boundaries or obstacles.";
  } else if (stage >= 0.28 && stage < 0.47) {
    name = "Waxing Gibbous";
    emoji = "🌔";
    description = "Refinement, patience, and aligning of spiritual paths with conscious power.";
  } else if (stage >= 0.47 && stage < 0.53) {
    name = "Full Moon";
    emoji = "🌕";
    description = "Harvesting light, peak magical manifestation, and spiritual revelation.";
  } else if (stage >= 0.53 && stage < 0.72) {
    name = "Waning Gibbous";
    emoji = "🌖";
    description = "Distribution of wisdom, letting go of non-essential burdens, and gratitude.";
  } else if (stage >= 0.72 && stage < 0.78) {
    name = "Third Quarter";
    emoji = "🌗";
    description = "Re-evaluation, clearing debts, and internal adjustment of your aetheric channels.";
  } else {
    name = "Waning Crescent";
    emoji = "🌘";
    description = "Surrender, recuperation, and the resting state of the spirit before rebirth.";
  }
  
  return { name, emoji, description, percentage };
}

/**
 * Calculates the zodiac sign for a given date string.
 */
export function getZodiacSignFromDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const day = d.getUTCDate();
  const month = d.getUTCMonth() + 1; // 1-12

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  return "";
}
