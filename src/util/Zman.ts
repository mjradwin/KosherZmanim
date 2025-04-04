import { Temporal } from 'temporal-polyfill';

import { IntegerUtils, StringUtils } from '../polyfills/Utils';
import { UnsupportedError } from '../polyfills/errors';
import { GeoLocation } from './GeoLocation';

/**
 * A wrapper class for astronomical times / <em>zmanim</em> that is mostly intended to allow sorting collections of astronomical times.
 * It has fields for both date/time and duration based <em>zmanim</em>, name / labels as well as a longer description or explanation of a
 * <em>zman</em>.
 * <p>
 * Here is an example of various ways of sorting <em>zmanim</em>.
 * <p>First create the Calendar for the location you would like to calculate:
 *
 * <pre style="background: #FEF0C9; display: inline-block;">
 * String locationName = &quot;Lakewood, NJ&quot;;
 * double latitude = 40.0828; // Lakewood, NJ
 * double longitude = -74.2094; // Lakewood, NJ
 * double elevation = 20; // optional elevation correction in Meters
 * // the String parameter in getTimeZone() has to be a valid timezone listed in {@link java.util.TimeZone#getAvailableIDs()}
 * TimeZone timeZone = TimeZone.getTimeZone(&quot;America/New_York&quot;);
 * GeoLocation location = new GeoLocation(locationName, latitude, longitude, elevation, timeZone);
 * ComplexZmanimCalendar czc = new ComplexZmanimCalendar(location);
 * Zman sunset = new Zman(czc.getSunset(), "Sunset");
 * Zman shaah16 = new Zman(czc.getShaahZmanis16Point1Degrees(), "Shaah zmanis 16.1");
 * Zman sunrise = new Zman(czc.getSunrise(), "Sunrise");
 * Zman shaah = new Zman(czc.getShaahZmanisGra(), "Shaah zmanis GRA");
 * ArrayList&lt;Zman&gt; zl = new ArrayList&lt;Zman&gt;();
 * zl.add(sunset);
 * zl.add(shaah16);
 * zl.add(sunrise);
 * zl.add(shaah);
 * //will sort sunset, shaah 1.6, sunrise, shaah GRA
 * System.out.println(zl);
 * Collections.sort(zl, Zman.DATE_ORDER);
 * // will sort sunrise, sunset, shaah, shaah 1.6 (the last 2 are not in any specific order)
 * Collections.sort(zl, Zman.DURATION_ORDER);
 * // will sort sunrise, sunset (the first 2 are not in any specific order), shaah GRA, shaah 1.6
 * Collections.sort(zl, Zman.NAME_ORDER);
 * // will sort shaah 1.6, shaah GRA, sunrise, sunset
 * </pre>
 *
 * @author &copy; Eliyahu Hershfeld 2007-2020
 * @todo Add secondary sorting. As of now the {@code Comparator}s in this class do not sort by secondary order. This means that when sorting a
 * {@link java.util.Collection} of <em>zmanim</em> and using the {@link #DATE_ORDER} {@code Comparator} will have the duration based <em>zmanim</em>
 * at the end, but they will not be sorted by duration. This should be N/A for label based sorting.
 */
export class Zman {
  /**
   * The name / label of the <em>zman</em>.
   */
  label: string | null;

  /**
   * The {@link Date} of the <em>zman</em>
   */
  zman?: Temporal.ZonedDateTime;

  /**
   * The duration if the <em>zman</em> is  a {@link AstronomicalCalendar#getTemporalHour() temporal hour} (or the various
   * <em>shaah zmanis</em> base times such as {@link ZmanimCalendar#getShaahZmanisGra()  <em>shaah Zmanis GRA</em>} or
   * {@link ComplexZmanimCalendar#getShaahZmanis16Point1Degrees() <em>shaah Zmanis 16.1&deg;</em>}).
   */
  duration?: number;

  /**
   * A longer description or explanation of a <em>zman</em>.
   */
  description?: string;

  /**
   * The location information of the <em>zman</em>.
   */
  geoLocation?: GeoLocation;

  /**
   * The constructor setting a {@link Date} based <em>zman</em> and a label.
   * @param date the Date of the <em>zman</em>.
   * @param label the label of the  <em>zman</em> such as "<em>Sof Zman Krias Shema GRA</em>".
   * @see #Zman(Date, GeoLocation, String)
   */
  constructor(date: Temporal.ZonedDateTime, label: string | null)
  /**
   * The constructor setting a duration based <em>zman</em> such as
   * {@link AstronomicalCalendar#getTemporalHour() temporal hour} (or the various <em>shaah zmanis</em> times such as
   * {@link ZmanimCalendar#getShaahZmanisGra() <em>shaah zmanis GRA</em>} or
   * {@link ComplexZmanimCalendar#getShaahZmanis16Point1Degrees() <em>shaah Zmanis 16.1&deg;</em>}) and label.
   * @param duration a duration based <em>zman</em> such as ({@link AstronomicalCalendar#getTemporalHour()}
   * @param label the label of the  <em>zman</em> such as "<em>Shaah Zmanis GRA</em>".
   * @see #Zman(Date, String)
   */
  constructor(duration: number, label: string | null)
  constructor(date: Temporal.ZonedDateTime, geoLocation: GeoLocation, label: string | null)
  constructor(dateOrDuration: number | Temporal.ZonedDateTime, labelOrGeoLocation: string | GeoLocation | null, label?: string | null) {
    this.label = label || null;

    if (labelOrGeoLocation instanceof GeoLocation) {
      this.geoLocation = labelOrGeoLocation;
    } else {
      this.label = labelOrGeoLocation;
    }

    if (dateOrDuration instanceof Temporal.ZonedDateTime) {
      this.zman = dateOrDuration;
    } else {
      this.duration = dateOrDuration;
    }
  }

  /**
   * A {@link Comparator} that will compare and sort <em>zmanim</em> by date/time order. Compares its two arguments by the zman's date/time
   * order. Returns a negative integer, zero, or a positive integer as the first argument is less than, equal to, or greater
   * than the second.
   * Please note that this class will handle cases where either the {@code Zman} is a null or {@link #getZman()} returns a null.
   */
  static compareDateOrder(zman1: Zman, zman2: Zman): number {
    const firstMillis = zman1.zman?.epochMilliseconds || 0;
    const secondMillis = zman2.zman?.epochMilliseconds || 0;

    return IntegerUtils.compare(firstMillis, secondMillis);
  }

  /**
   * A {@link Comparator} that will compare and sort zmanim by zmanim label order. Compares its two arguments by the zmanim label
   * name order. Returns a negative integer, zero, or a positive integer as the first argument is less than, equal to, or greater
   * than the second.
   * Please note that this class will sort cases where either the {@code Zman} is a null or {@link #label} returns a null
   * as empty {@code String}s.
   */
  static compareNameOrder(zman1: Zman, zman2: Zman): number {
    return StringUtils.compareTo(zman1.label || '', zman2.label || '');
  }

  /**
   * A {@link Comparator} that will compare and sort duration based <em>zmanim</em>  such as
   * {@link AstronomicalCalendar#getTemporalHour() temporal hour} (or the various <em>shaah zmanis</em> times
   * such as <em>{@link ZmanimCalendar#getShaahZmanisGra() shaah zmanis GRA}</em> or
   * {@link ComplexZmanimCalendar#getShaahZmanis16Point1Degrees() <em>shaah zmanis 16.1&deg;</em>}). Returns a negative
   * integer, zero, or a positive integer as the first argument is less than, equal to, or greater than the second.
   * Please note that this class will sort cases where {@code Zman} is a null.
   */
  static compareDurationOrder(zman1: Zman, zman2: Zman): number {
    return IntegerUtils.compare(zman1.duration || 0, zman2.duration || 0);
  }

  /**
   * A method that returns an XML formatted <code>String</code> representing the serialized <code>Object</code>. Very
   * similar to the toString method but the return value is in an xml format. The format currently used (subject to
   * change) is:
   *
   * <pre>
   * &lt;Zman&gt;
   *  &lt;Label&gt;Sof Zman Krias Shema GRA&lt;/Label&gt;
   *  &lt;Zman&gt;1969-02-08T09:37:56.820&lt;/Zman&gt;
   *  &lt;TimeZone&gt;
   *    &lt;TimezoneName&gt;America/Montreal&lt;/TimezoneName&gt;
   *    &lt;TimeZoneDisplayName&gt;Eastern Standard Time&lt;/TimeZoneDisplayName&gt;
   *    &lt;TimezoneGMTOffset&gt;-5&lt;/TimezoneGMTOffset&gt;
   *    &lt;TimezoneDSTOffset&gt;1&lt;/TimezoneDSTOffset&gt;
   *  &lt;/TimeZone&gt;
   *  &lt;Duration&gt;0&lt;/Duration&gt;
   *  &lt;Description&gt;Sof Zman Krias Shema GRA is 3 sha'os zmaniyos calculated from sunrise to sunset.&lt;/Description&gt;
   * &lt;/Zman&gt;
   * </pre>
   * @return The XML formatted <code>String</code>.
   * @deprecated
   */
  // eslint-disable-next-line class-methods-use-this
  public toXML(): void {
    throw new UnsupportedError('This method is deprecated');
  }

  toString(): string {
    return (`\nLabel:\t${this.label}`)
      .concat(`\nZman:\t${this.zman}`)
      .concat(`\nnGeoLocation:\t${this.geoLocation?.toString().replace(/\n/g, '\n\t')}`)
      .concat(`\nDuration:\t${this.duration}`)
      .concat(`\nDescription:\t${this.description}`);
  }
}

export type ZmanWithZmanDate = Zman & { zman: Temporal.ZonedDateTime };
export type ZmanWithDuration = Zman & { duration: number };
