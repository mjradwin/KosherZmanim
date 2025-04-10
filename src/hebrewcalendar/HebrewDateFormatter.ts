import { Temporal } from 'temporal-polyfill';

import { Daf } from './Daf';
import { JewishDate } from './JewishDate';
import { JewishCalendar, Parsha } from './JewishCalendar';
import { IllegalArgumentException } from '../polyfills/errors';

/**
 * The HebrewDateFormatter class formats a {@link JewishDate}.
 *
 * The class formats Jewish dates, numbers, Daf Yomi</em> (<em>Bavli and Yerushalmi), the Omer</em>,
 * <em>Parshas Hashavua</em>, (including special <em>parshiyos</em> of <em>Shekalim</em>, <em>Zachor</em>, <em>Parah</em>,
 * and <em>Hachodesh</em>), Yomim Tovim and the Molad (experimental) in Hebrew or Latin chars, and has various settings.
 * Sample full date output includes (using various options):
 * <ul>
 * <li>21 Shevat, 5729</li>
 * <li>&#x5DB;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5DB;&#x5D8;</li>
 * <li>&#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5D4;&#x5F3;&#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8;</li>
 * <li>&#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5F4;&#x05E4; or
 * &#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5F4;&#x05E3;</li>
 * <li>&#x05DB;&#x05F3; &#x05E9;&#x05D1;&#x05D8; &#x05D5;&#x05F3; &#x05D0;&#x05DC;&#x05E4;&#x05D9;&#x05DD;</li>
 * </ul>
 *
 * @see JewishDate
 * @see JewishCalendar
 *
 * @author &copy; Eliyahu Hershfeld 2011 - 2015
 */
export class HebrewDateFormatter {
  /**
   * See {@link #isHebrewFormat()} and {@link #setHebrewFormat(boolean)}.
   */
  private hebrewFormat: boolean = false;

  /**
   * See {@link #isUseLongHebrewYears()} and {@link #setUseLongHebrewYears(boolean)}.
   */
  private useLonghebrewYears: boolean = false;

  /**
   * See {@link #isUseGershGershayim()} and {@link #setUseGershGershayim(boolean)}.
   */

  private useGershGershayim: boolean = true;
  /**
   * See {@link #isLongWeekFormat()} and {@link #setLongWeekFormat(boolean)}.
   */

  private longWeekFormat: boolean = true;
  /**
   * See {@link #isUseFinalFormLetters()} and {@link #setUseFinalFormLetters(boolean)}.
   */

  private useFinalFormLetters: boolean = false;

  /**
   * The internal DateFormat.&nbsp; See {@link #isLongWeekFormat()} and {@link #setLongWeekFormat(boolean)}.
   */
  private weekFormat: Intl.DateTimeFormatOptions | null = { weekday: 'long' };

  /**
   * List of transliterated parshiyos using the default <em>Ashkenazi</em> pronounciation.&nbsp; The formatParsha method uses this
   * for transliterated <em>parsha</em> formatting.&nbsp; This list can be overridden (for <em>Sephardi</em> English transliteration for
   * example) by setting the {@link #setTransliteratedParshiosList(EnumMap)}.&nbsp; The list includes double and special
   * <em>parshiyos</em> is set as "<em>Bereshis, Noach, Lech Lecha, Vayera, Chayei Sara, Toldos, Vayetzei, Vayishlach, Vayeshev, Miketz,
   * Vayigash, Vayechi, Shemos, Vaera, Bo, Beshalach, Yisro, Mishpatim, Terumah, Tetzaveh, Ki Sisa, Vayakhel, Pekudei,
   * Vayikra, Tzav, Shmini, Tazria, Metzora, Achrei Mos, Kedoshim, Emor, Behar, Bechukosai, Bamidbar, Nasso, Beha'aloscha,
   * Sh'lach, Korach, Chukas, Balak, Pinchas, Matos, Masei, Devarim, Vaeschanan, Eikev, Re'eh, Shoftim, Ki Seitzei, Ki Savo,
   * Nitzavim, Vayeilech, Ha'Azinu, Vezos Habracha, Vayakhel Pekudei, Tazria Metzora, Achrei Mos Kedoshim, Behar Bechukosai,
   * Chukas Balak, Matos Masei, Nitzavim Vayeilech, Shekalim, Zachor, Parah, Hachodesh,Shuva, Shira, Hagadol, Chazon, Nachamu</em>".
   *
   * @see #formatParsha(JewishCalendar)
   */
  private transliteratedParshaMap: Record<Parsha, string> = {
    [Parsha.NONE]: '',
    [Parsha.BERESHIS]: 'Bereshis',
    [Parsha.NOACH]: 'Noach',
    [Parsha.LECH_LECHA]: 'Lech Lecha',
    [Parsha.VAYERA]: 'Vayera',
    [Parsha.CHAYEI_SARA]: 'Chayei Sara',
    [Parsha.TOLDOS]: 'Toldos',
    [Parsha.VAYETZEI]: 'Vayetzei',
    [Parsha.VAYISHLACH]: 'Vayishlach',
    [Parsha.VAYESHEV]: 'Vayeshev',
    [Parsha.MIKETZ]: 'Miketz',
    [Parsha.VAYIGASH]: 'Vayigash',
    [Parsha.VAYECHI]: 'Vayechi',
    [Parsha.SHEMOS]: 'Shemos',
    [Parsha.VAERA]: 'Vaera',
    [Parsha.BO]: 'Bo',
    [Parsha.BESHALACH]: 'Beshalach',
    [Parsha.YISRO]: 'Yisro',
    [Parsha.MISHPATIM]: 'Mishpatim',
    [Parsha.TERUMAH]: 'Terumah',
    [Parsha.TETZAVEH]: 'Tetzaveh',
    [Parsha.KI_SISA]: 'Ki Sisa',
    [Parsha.VAYAKHEL]: 'Vayakhel',
    [Parsha.PEKUDEI]: 'Pekudei',
    [Parsha.VAYIKRA]: 'Vayikra',
    [Parsha.TZAV]: 'Tzav',
    [Parsha.SHMINI]: 'Shmini',
    [Parsha.TAZRIA]: 'Tazria',
    [Parsha.METZORA]: 'Metzora',
    [Parsha.ACHREI_MOS]: 'Achrei Mos',
    [Parsha.KEDOSHIM]: 'Kedoshim',
    [Parsha.EMOR]: 'Emor',
    [Parsha.BEHAR]: 'Behar',
    [Parsha.BECHUKOSAI]: 'Bechukosai',
    [Parsha.BAMIDBAR]: 'Bamidbar',
    [Parsha.NASSO]: 'Nasso',
    [Parsha.BEHAALOSCHA]: 'Beha\'aloscha',
    [Parsha.SHLACH]: 'Sh\'lach',
    [Parsha.KORACH]: 'Korach',
    [Parsha.CHUKAS]: 'Chukas',
    [Parsha.BALAK]: 'Balak',
    [Parsha.PINCHAS]: 'Pinchas',
    [Parsha.MATOS]: 'Matos',
    [Parsha.MASEI]: 'Masei',
    [Parsha.DEVARIM]: 'Devarim',
    [Parsha.VAESCHANAN]: 'Vaeschanan',
    [Parsha.EIKEV]: 'Eikev',
    [Parsha.REEH]: 'Re\'eh',
    [Parsha.SHOFTIM]: 'Shoftim',
    [Parsha.KI_SEITZEI]: 'Ki Seitzei',
    [Parsha.KI_SAVO]: 'Ki Savo',
    [Parsha.NITZAVIM]: 'Nitzavim',
    [Parsha.VAYEILECH]: 'Vayeilech',
    [Parsha.HAAZINU]: 'Ha\'Azinu',
    [Parsha.VZOS_HABERACHA]: 'Vezos Habracha',
    [Parsha.VAYAKHEL_PEKUDEI]: 'Vayakhel Pekudei',
    [Parsha.TAZRIA_METZORA]: 'Tazria Metzora',
    [Parsha.ACHREI_MOS_KEDOSHIM]: 'Achrei Mos Kedoshim',
    [Parsha.BEHAR_BECHUKOSAI]: 'Behar Bechukosai',
    [Parsha.CHUKAS_BALAK]: 'Chukas Balak',
    [Parsha.MATOS_MASEI]: 'Matos Masei',
    [Parsha.NITZAVIM_VAYEILECH]: 'Nitzavim Vayeilech',
    [Parsha.SHKALIM]: 'Shekalim',
    [Parsha.ZACHOR]: 'Zachor',
    [Parsha.PARA]: 'Parah',
    [Parsha.HACHODESH]: 'Hachodesh',
    [Parsha.SHUVA]: 'Shuva',
    [Parsha.SHIRA]: 'Shira',
    [Parsha.HAGADOL]: 'Hagadol',
    [Parsha.CHAZON]: 'Chazon',
    [Parsha.NACHAMU]: 'Nachamu',
  };

  /**
   * Unicode {@link Record} of Hebrew <em>parshiyos</em>.&nbsp; The list includes double and special <em>parshiyos</em> and
   * contains <code>"&#x05D1;&#x05E8;&#x05D0;&#x05E9;&#x05D9;&#x05EA;, &#x05E0;&#x05D7;, &#x05DC;&#x05DA; &#x05DC;&#x05DA;,
   *  &#x05D5;&#x05D9;&#x05E8;&#x05D0;, &#x05D7;&#x05D9;&#x05D9; &#x05E9;&#x05E8;&#x05D4;,
   *  &#x05EA;&#x05D5;&#x05DC;&#x05D3;&#x05D5;&#x05EA;, &#x05D5;&#x05D9;&#x05E6;&#x05D0;, &#x05D5;&#x05D9;&#x05E9;&#x05DC;&#x05D7;,
   *  &#x05D5;&#x05D9;&#x05E9;&#x05D1;, &#x05DE;&#x05E7;&#x05E5;, &#x05D5;&#x05D9;&#x05D2;&#x05E9;, &#x05D5;&#x05D9;&#x05D7;&#x05D9;,
   *  &#x05E9;&#x05DE;&#x05D5;&#x05EA;, &#x05D5;&#x05D0;&#x05E8;&#x05D0;, &#x05D1;&#x05D0;, &#x05D1;&#x05E9;&#x05DC;&#x05D7;,
   *  &#x05D9;&#x05EA;&#x05E8;&#x05D5;, &#x05DE;&#x05E9;&#x05E4;&#x05D8;&#x05D9;&#x05DD;, &#x05EA;&#x05E8;&#x05D5;&#x05DE;&#x05D4;,
   *  &#x05EA;&#x05E6;&#x05D5;&#x05D4;, &#x05DB;&#x05D9; &#x05EA;&#x05E9;&#x05D0;, &#x05D5;&#x05D9;&#x05E7;&#x05D4;&#x05DC;,
   *  &#x05E4;&#x05E7;&#x05D5;&#x05D3;&#x05D9;, &#x05D5;&#x05D9;&#x05E7;&#x05E8;&#x05D0;, &#x05E6;&#x05D5;,
   *  &#x05E9;&#x05DE;&#x05D9;&#x05E0;&#x05D9;, &#x05EA;&#x05D6;&#x05E8;&#x05D9;&#x05E2;, &#x05DE;&#x05E6;&#x05E8;&#x05E2;,
   *  &#x05D0;&#x05D7;&#x05E8;&#x05D9; &#x05DE;&#x05D5;&#x05EA;, &#x05E7;&#x05D3;&#x05D5;&#x05E9;&#x05D9;&#x05DD;,
   *  &#x05D0;&#x05DE;&#x05D5;&#x05E8;, &#x05D1;&#x05D4;&#x05E8;, &#x05D1;&#x05D7;&#x05E7;&#x05EA;&#x05D9;,
   *  &#x05D1;&#x05DE;&#x05D3;&#x05D1;&#x05E8;, &#x05E0;&#x05E9;&#x05D0;, &#x05D1;&#x05D4;&#x05E2;&#x05DC;&#x05EA;&#x05DA;,
   *  &#x05E9;&#x05DC;&#x05D7; &#x05DC;&#x05DA;, &#x05E7;&#x05E8;&#x05D7;, &#x05D7;&#x05D5;&#x05E7;&#x05EA;, &#x05D1;&#x05DC;&#x05E7;,
   *  &#x05E4;&#x05D9;&#x05E0;&#x05D7;&#x05E1;, &#x05DE;&#x05D8;&#x05D5;&#x05EA;, &#x05DE;&#x05E1;&#x05E2;&#x05D9;,
   *  &#x05D3;&#x05D1;&#x05E8;&#x05D9;&#x05DD;, &#x05D5;&#x05D0;&#x05EA;&#x05D7;&#x05E0;&#x05DF;, &#x05E2;&#x05E7;&#x05D1;,
   *  &#x05E8;&#x05D0;&#x05D4;, &#x05E9;&#x05D5;&#x05E4;&#x05D8;&#x05D9;&#x05DD;, &#x05DB;&#x05D9; &#x05EA;&#x05E6;&#x05D0;,
   *  &#x05DB;&#x05D9; &#x05EA;&#x05D1;&#x05D5;&#x05D0;, &#5D9;&#x05E6;&#x05D1;&#x05D9;&#x05DD;, &#x05D5;&#x05D9;&#x05DC;&#x05DA;,
   *  &#x05D4;&#x05D0;&#x05D6;&#x05D9;&#x05E0;&#x05D5;, &#x05D5;&#x05D6;&#x05D0;&#x05EA; &#x05D4;&#x05D1;&#x05E8;&#x05DB;&#x05D4;,
   *  &#x05D5;&#x05D9;&#x05E7;&#x05D4;&#x05DC; &#x05E4;&#x05E7;&#x05D5;&#x05D3;&#x05D9;, &#x05EA;&#x05D6;&#x05E8;&#x05D9;&#x05E2;
   *  &#x05DE;&#x05E6;&#x05E8;&#x05E2;, &#x05D0;&#x05D7;&#x05E8;&#x05D9; &#x05DE;&#x05D5;&#x05EA;
   *  &#x05E7;&#x05D3;&#x05D5;&#x05E9;&#x05D9;&#x05DD;, &#x05D1;&#x05D4;&#x05E8; &#x05D1;&#x05D7;&#x05E7;&#x05EA;&#x05D9;,
   *  &#x05D7;&#x05D5;&#x05E7;&#x05EA; &#x05D1;&#x05DC;&#x05E7;, &#x05DE;&#x05D8;&#x05D5;&#x05EA; &#x05DE;&#x05E1;&#x05E2;&#x05D9;,
   *  &#x05E0;&#x05E6;&#x05D1;&#x05D9;&#x05DD; &#x05D5;&#x05D9;&#x05DC;&#x05DA;, &#x05E9;&#x05E7;&#x05DC;&#x05D9;&#x05DD;,
   *  &#x05D6;&#x05DB;&#x05D5;&#x05E8;, &#x05E4;&#x05E8;&#x05D4;, &#x05D4;&#x05D7;&#x05D3;&#x05E9;,
   *  &#x05E9;&#x05D5;&#x05D1;&#x05D4;,&#x05E9;&#x05D9;&#x05E8;&#x05D4;,&#x05D4;&#x05D2;&#x05D3;&#x05D5;&#x05DC;,
   *  &#x05D7;&#x05D6;&#x05D5;&#x05DF;,&#x05E0;&#x05D7;&#x05DE;&#x05D5;"</code>
   */
  private readonly hebrewParshaMap: Record<Parsha, string> = {
    [Parsha.NONE]: '',
    [Parsha.BERESHIS]: '\u05D1\u05E8\u05D0\u05E9\u05D9\u05EA',
    [Parsha.NOACH]: '\u05E0\u05D7',
    [Parsha.LECH_LECHA]: '\u05DC\u05DA \u05DC\u05DA',
    [Parsha.VAYERA]: '\u05D5\u05D9\u05E8\u05D0',
    [Parsha.CHAYEI_SARA]: '\u05D7\u05D9\u05D9 \u05E9\u05E8\u05D4',
    [Parsha.TOLDOS]: '\u05EA\u05D5\u05DC\u05D3\u05D5\u05EA',
    [Parsha.VAYETZEI]: '\u05D5\u05D9\u05E6\u05D0',
    [Parsha.VAYISHLACH]: '\u05D5\u05D9\u05E9\u05DC\u05D7',
    [Parsha.VAYESHEV]: '\u05D5\u05D9\u05E9\u05D1',
    [Parsha.MIKETZ]: '\u05DE\u05E7\u05E5',
    [Parsha.VAYIGASH]: '\u05D5\u05D9\u05D2\u05E9',
    [Parsha.VAYECHI]: '\u05D5\u05D9\u05D7\u05D9',
    [Parsha.SHEMOS]: '\u05E9\u05DE\u05D5\u05EA',
    [Parsha.VAERA]: '\u05D5\u05D0\u05E8\u05D0',
    [Parsha.BO]: '\u05D1\u05D0',
    [Parsha.BESHALACH]: '\u05D1\u05E9\u05DC\u05D7',
    [Parsha.YISRO]: '\u05D9\u05EA\u05E8\u05D5',
    [Parsha.MISHPATIM]: '\u05DE\u05E9\u05E4\u05D8\u05D9\u05DD',
    [Parsha.TERUMAH]: '\u05EA\u05E8\u05D5\u05DE\u05D4',
    [Parsha.TETZAVEH]: '\u05EA\u05E6\u05D5\u05D4',
    [Parsha.KI_SISA]: '\u05DB\u05D9 \u05EA\u05E9\u05D0',
    [Parsha.VAYAKHEL]: '\u05D5\u05D9\u05E7\u05D4\u05DC',
    [Parsha.PEKUDEI]: '\u05E4\u05E7\u05D5\u05D3\u05D9',
    [Parsha.VAYIKRA]: '\u05D5\u05D9\u05E7\u05E8\u05D0',
    [Parsha.TZAV]: '\u05E6\u05D5',
    [Parsha.SHMINI]: '\u05E9\u05DE\u05D9\u05E0\u05D9',
    [Parsha.TAZRIA]: '\u05EA\u05D6\u05E8\u05D9\u05E2',
    [Parsha.METZORA]: '\u05DE\u05E6\u05E8\u05E2',
    [Parsha.ACHREI_MOS]: '\u05D0\u05D7\u05E8\u05D9 \u05DE\u05D5\u05EA',
    [Parsha.KEDOSHIM]: '\u05E7\u05D3\u05D5\u05E9\u05D9\u05DD',
    [Parsha.EMOR]: '\u05D0\u05DE\u05D5\u05E8',
    [Parsha.BEHAR]: '\u05D1\u05D4\u05E8',
    [Parsha.BECHUKOSAI]: '\u05D1\u05D7\u05E7\u05EA\u05D9',
    [Parsha.BAMIDBAR]: '\u05D1\u05DE\u05D3\u05D1\u05E8',
    [Parsha.NASSO]: '\u05E0\u05E9\u05D0',
    [Parsha.BEHAALOSCHA]: '\u05D1\u05D4\u05E2\u05DC\u05EA\u05DA',
    [Parsha.SHLACH]: '\u05E9\u05DC\u05D7 \u05DC\u05DA',
    [Parsha.KORACH]: '\u05E7\u05E8\u05D7',
    [Parsha.CHUKAS]: '\u05D7\u05D5\u05E7\u05EA',
    [Parsha.BALAK]: '\u05D1\u05DC\u05E7',
    [Parsha.PINCHAS]: '\u05E4\u05D9\u05E0\u05D7\u05E1',
    [Parsha.MATOS]: '\u05DE\u05D8\u05D5\u05EA',
    [Parsha.MASEI]: '\u05DE\u05E1\u05E2\u05D9',
    [Parsha.DEVARIM]: '\u05D3\u05D1\u05E8\u05D9\u05DD',
    [Parsha.VAESCHANAN]: '\u05D5\u05D0\u05EA\u05D7\u05E0\u05DF',
    [Parsha.EIKEV]: '\u05E2\u05E7\u05D1',
    [Parsha.REEH]: '\u05E8\u05D0\u05D4',
    [Parsha.SHOFTIM]: '\u05E9\u05D5\u05E4\u05D8\u05D9\u05DD',
    [Parsha.KI_SEITZEI]: '\u05DB\u05D9 \u05EA\u05E6\u05D0',
    [Parsha.KI_SAVO]: '\u05DB\u05D9 \u05EA\u05D1\u05D5\u05D0',
    [Parsha.NITZAVIM]: '\u05E0\u05E6\u05D1\u05D9\u05DD',
    [Parsha.VAYEILECH]: '\u05D5\u05D9\u05DC\u05DA',
    [Parsha.HAAZINU]: '\u05D4\u05D0\u05D6\u05D9\u05E0\u05D5',
    [Parsha.VZOS_HABERACHA]: '\u05D5\u05D6\u05D0\u05EA \u05D4\u05D1\u05E8\u05DB\u05D4 ',
    [Parsha.VAYAKHEL_PEKUDEI]: '\u05D5\u05D9\u05E7\u05D4\u05DC \u05E4\u05E7\u05D5\u05D3\u05D9',
    [Parsha.TAZRIA_METZORA]: '\u05EA\u05D6\u05E8\u05D9\u05E2 \u05DE\u05E6\u05E8\u05E2',
    [Parsha.ACHREI_MOS_KEDOSHIM]: '\u05D0\u05D7\u05E8\u05D9 \u05DE\u05D5\u05EA \u05E7\u05D3\u05D5\u05E9\u05D9\u05DD',
    [Parsha.BEHAR_BECHUKOSAI]: '\u05D1\u05D4\u05E8 \u05D1\u05D7\u05E7\u05EA\u05D9',
    [Parsha.CHUKAS_BALAK]: '\u05D7\u05D5\u05E7\u05EA \u05D1\u05DC\u05E7',
    [Parsha.MATOS_MASEI]: '\u05DE\u05D8\u05D5\u05EA \u05DE\u05E1\u05E2\u05D9',
    [Parsha.NITZAVIM_VAYEILECH]: '\u05E0\u05E6\u05D1\u05D9\u05DD \u05D5\u05D9\u05DC\u05DA',
    [Parsha.SHKALIM]: '\u05E9\u05E7\u05DC\u05D9\u05DD',
    [Parsha.ZACHOR]: '\u05D6\u05DB\u05D5\u05E8',
    [Parsha.PARA]: '\u05E4\u05E8\u05D4',
    [Parsha.HACHODESH]: '\u05D4\u05D7\u05D3\u05E9',
    [Parsha.SHUVA]: '\u05E9\u05D5\u05D1\u05D4',
    [Parsha.SHIRA]: '\u05E9\u05D9\u05E8\u05D4',
    [Parsha.HAGADOL]: '\u05D4\u05D2\u05D3\u05D5\u05DC',
    [Parsha.CHAZON]: '\u05D7\u05D6\u05D5\u05DF',
    [Parsha.NACHAMU]: '\u05E0\u05D7\u05DE\u05D5',
  };

  /**
   * returns if the {@link #formatDayOfWeek(JewishDate)} will use the long format such as
   * &#x05E8;&#x05D0;&#x05E9;&#x05D5;&#x05DF; or short such as &#x05D0; when formatting the day of week in
   * {@link #isHebrewFormat() Hebrew}.
   *
   * @return the longWeekFormat
   * @see #setLongWeekFormat(boolean)
   * @see #formatDayOfWeek(JewishDate)
   */
  public isLongWeekFormat(): boolean {
    return this.longWeekFormat;
  }

  /**
   * Setting to control if the {@link #formatDayOfWeek(JewishDate)} will use the long format such as
   * &#x05E8;&#x05D0;&#x05E9;&#x05D5;&#x05DF; or short such as &#x05D0; when formatting the day of week in
   * {@link #isHebrewFormat() Hebrew}.
   *
   * @param longWeekFormat
   *            the longWeekFormat to set
   */
  public setLongWeekFormat(longWeekFormat: boolean): void {
    this.longWeekFormat = longWeekFormat;

    this.weekFormat = {
      weekday: longWeekFormat ? 'long' : 'short',
    };
  }

  /**
   * The <a href="https://en.wikipedia.org/wiki/Geresh#Punctuation_mark">gersh</a> character is the &#x05F3; char
   * that is similar to a single quote and is used in formatting Hebrew numbers.
   */
  private static readonly GERESH: string = '\u05F3';

  /**
   * The <a href="https://en.wikipedia.org/wiki/Gershayim#Punctuation_mark">gershyim</a> character is the &#x05F4; char
   * that is similar to a double quote and is used in formatting Hebrew numbers.
   */
  private static readonly GERSHAYIM: string = '\u05F4';

  /**
   * Transliterated month names.&nbsp; Defaults to ["Nissan", "Iyar", "Sivan", "Tammuz", "Av", "Elul", "Tishrei", "Cheshvan",
   * "Kislev", "Teves", "Shevat", "Adar", "Adar II", "Adar I" ].
   * @see #getTransliteratedMonthList()
   * @see #setTransliteratedMonthList(String[])
   */
  private transliteratedMonths: string[] = ['Nissan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul', 'Tishrei', 'Cheshvan',
    'Kislev', 'Teves', 'Shevat', 'Adar', 'Adar II', 'Adar I'];

  /**
   * The Hebrew omer prefix charachter. It defaults to &#x05D1; producing &#x05D1;&#x05E2;&#x05D5;&#x05DE;&#x05E8;,
   * but can be set to &#x05DC; to produce &#x05DC;&#x05E2;&#x05D5;&#x05DE;&#x05E8; (or any other prefix).
   * @see #getHebrewOmerPrefix()
   * @see #setHebrewOmerPrefix(String)
   */
  private hebrewOmerPrefix: string = '\u05D1';

  /**
   * The default value for formatting Shabbos (Saturday).&nbsp; Defaults to Shabbos.
   * @see #getTransliteratedShabbosDayOfWeek()
   * @see #setTransliteratedShabbosDayOfWeek(String)
   */
  private transliteratedShabbosDayOfWeek: string = 'Shabbos';

  /**
   * Returns the day of Shabbos transliterated into Latin chars. The default uses Ashkenazi pronunciation "Shabbos".
   * This can be overwritten using the {@link #setTransliteratedShabbosDayOfWeek(String)}
   *
   * @return the transliteratedShabbos. The default list of months uses Ashkenazi pronunciation "Shabbos".
   * @see #setTransliteratedShabbosDayOfWeek(String)
   * @see #formatDayOfWeek(JewishDate)
   */
  public getTransliteratedShabbosDayOfWeek(): string {
    return this.transliteratedShabbosDayOfWeek;
  }

  /**
   * Setter to override the default transliterated name of "Shabbos" to alternate spelling such as "Shabbat" used by
   * the {@link #formatDayOfWeek(JewishDate)}
   *
   * @param transliteratedShabbos
   *            the transliteratedShabbos to set
   *
   * @see #getTransliteratedShabbosDayOfWeek()
   * @see #formatDayOfWeek(JewishDate)
   */
  public setTransliteratedShabbosDayOfWeek(transliteratedShabbos: string): void {
    this.transliteratedShabbosDayOfWeek = transliteratedShabbos;
  }

  /**
   * See {@link #getTransliteratedHolidayList()} and {@link #setTransliteratedHolidayList(String[])}.
   */
  private transliteratedHolidays: string[] = ['Erev Pesach', 'Pesach', 'Chol Hamoed Pesach', 'Pesach Sheni',
    'Erev Shavuos', 'Shavuos', 'Seventeenth of Tammuz', 'Tishah B\'Av', 'Tu B\'Av', 'Erev Rosh Hashana',
    'Rosh Hashana', 'Fast of Gedalyah', 'Erev Yom Kippur', 'Yom Kippur', 'Erev Succos', 'Succos',
    'Chol Hamoed Succos', 'Hoshana Rabbah', 'Shemini Atzeres', 'Simchas Torah', 'Erev Chanukah', 'Chanukah',
    'Tenth of Teves', 'Tu B\'Shvat', 'Fast of Esther', 'Purim', 'Shushan Purim', 'Purim Katan', 'Rosh Chodesh',
    'Yom HaShoah', 'Yom Hazikaron', 'Yom Ha\'atzmaut', 'Yom Yerushalayim', 'Lag B\'Omer', 'Shushan Purim Katan',
    'Isru Chag'];

  /**
   * Returns the array of holidays transliterated into Latin chars. This is used by the
   * {@link #formatYomTov(JewishCalendar)} when formatting the Yom Tov String. The default list of months uses
   * Ashkenazi pronunciation in typical American English spelling.
   *
   * @return the array of transliterated holidays. The default list is currently ["Erev Pesach", "Pesach",
   *         "Chol Hamoed Pesach", "Pesach Sheni", "Erev Shavuos", "Shavuos", "Seventeenth of Tammuz", "Tishah B'Av",
   *         "Tu B'Av", "Erev Rosh Hashana", "Rosh Hashana", "Fast of Gedalyah", "Erev Yom Kippur", "Yom Kippur",
   *         "Erev Succos", "Succos", "Chol Hamoed Succos", "Hoshana Rabbah", "Shemini Atzeres", "Simchas Torah",
   *         "Erev Chanukah", "Chanukah", "Tenth of Teves", "Tu B'Shvat", "Fast of Esther", "Purim", "Shushan Purim",
   *         "Purim Katan", "Rosh Chodesh", "Yom HaShoah", "Yom Hazikaron", "Yom Ha'atzmaut", "Yom Yerushalayim",
   *         "Lag B'Omer","Shushan Purim Katan", "Isru Chag"].
   *
   * @see #setTransliteratedMonthList(String[])
   * @see #formatYomTov(JewishCalendar)
   * @see #isHebrewFormat()
   */
  public getTransliteratedHolidayList(): string[] {
    return this.transliteratedHolidays;
  }

  /**
   * Sets the array of holidays transliterated into Latin chars. This is used by the
   * {@link #formatYomTov(JewishCalendar)} when formatting the Yom Tov String.
   *
   * @param transliteratedHolidays
   *            the transliteratedHolidays to set. Ensure that the sequence exactly matches the list returned by the
   *            default
   */
  public setTransliteratedHolidayList(transliteratedHolidays: string[]): void {
    this.transliteratedHolidays = transliteratedHolidays;
  }

  /**
   * Hebrew holiday array in the following format.<br><code>["&#x05E2;&#x05E8;&#x05D1; &#x05E4;&#x05E1;&#x05D7;",
   * "&#x05E4;&#x05E1;&#x05D7;", "&#x05D7;&#x05D5;&#x05DC; &#x05D4;&#x05DE;&#x05D5;&#x05E2;&#x05D3;
   * &#x05E4;&#x05E1;&#x05D7;", "&#x05E4;&#x05E1;&#x05D7; &#x05E9;&#x05E0;&#x05D9;", "&#x05E2;&#x05E8;&#x05D1;
   * &#x05E9;&#x05D1;&#x05D5;&#x05E2;&#x05D5;&#x05EA;", "&#x05E9;&#x05D1;&#x05D5;&#x05E2;&#x05D5;&#x05EA;",
   * "&#x05E9;&#x05D1;&#x05E2;&#x05D4; &#x05E2;&#x05E9;&#x05E8; &#x05D1;&#x05EA;&#x05DE;&#x05D5;&#x05D6;",
   * "&#x05EA;&#x05E9;&#x05E2;&#x05D4; &#x05D1;&#x05D0;&#x05D1;",
   * "&#x05D8;&#x05F4;&#x05D5; &#x05D1;&#x05D0;&#x05D1;",
   * "&#x05E2;&#x05E8;&#x05D1; &#x05E8;&#x05D0;&#x05E9; &#x05D4;&#x05E9;&#x05E0;&#x05D4;",
   * "&#x05E8;&#x05D0;&#x05E9; &#x05D4;&#x05E9;&#x05E0;&#x05D4;",
   * "&#x05E6;&#x05D5;&#x05DD; &#x05D2;&#x05D3;&#x05DC;&#x05D9;&#x05D4;",
   * "&#x05E2;&#x05E8;&#x05D1; &#x05D9;&#x05D5;&#x05DD; &#x05DB;&#x05D9;&#x05E4;&#x05D5;&#x05E8;",
   * "&#x05D9;&#x05D5;&#x05DD; &#x05DB;&#x05D9;&#x05E4;&#x05D5;&#x05E8;",
   * "&#x05E2;&#x05E8;&#x05D1; &#x05E1;&#x05D5;&#x05DB;&#x05D5;&#x05EA;",
   * "&#x05E1;&#x05D5;&#x05DB;&#x05D5;&#x05EA;",
   * "&#x05D7;&#x05D5;&#x05DC; &#x05D4;&#x05DE;&#x05D5;&#x05E2;&#x05D3; &#x05E1;&#x05D5;&#x05DB;&#x05D5;&#x05EA;",
   * "&#x05D4;&#x05D5;&#x05E9;&#x05E2;&#x05E0;&#x05D0; &#x05E8;&#x05D1;&#x05D4;",
   * "&#x05E9;&#x05DE;&#x05D9;&#x05E0;&#x05D9; &#x05E2;&#x05E6;&#x05E8;&#x05EA;",
   * "&#x05E9;&#x05DE;&#x05D7;&#x05EA; &#x05EA;&#x05D5;&#x05E8;&#x05D4;",
   * "&#x05E2;&#x05E8;&#x05D1; &#x05D7;&#x05E0;&#x05D5;&#x05DB;&#x05D4;",
   * "&#x05D7;&#x05E0;&#x05D5;&#x05DB;&#x05D4;", "&#x05E2;&#x05E9;&#x05E8;&#x05D4; &#x05D1;&#x05D8;&#x05D1;&#x05EA;",
   * "&#x05D8;&#x05F4;&#x05D5; &#x05D1;&#x05E9;&#x05D1;&#x05D8;",
   * "&#x05EA;&#x05E2;&#x05E0;&#x05D9;&#x05EA; &#x05D0;&#x05E1;&#x05EA;&#x05E8;",
   * "&#x05E4;&#x05D5;&#x05E8;&#x05D9;&#x05DD;",
   * "&#x05E9;&#x05D5;&#x05E9;&#x05DF; &#x05E4;&#x05D5;&#x05E8;&#x05D9;&#x05DD;",
   * "&#x05E4;&#x05D5;&#x05E8;&#x05D9;&#x05DD; &#x05E7;&#x05D8;&#x05DF;",
   * "&#x05E8;&#x05D0;&#x05E9; &#x05D7;&#x05D5;&#x05D3;&#x05E9;",
   * "&#x05D9;&#x05D5;&#x05DD; &#x05D4;&#x05E9;&#x05D5;&#x05D0;&#x05D4;",
   * "&#x05D9;&#x05D5;&#x05DD; &#x05D4;&#x05D6;&#x05D9;&#x05DB;&#x05E8;&#x05D5;&#x05DF;",
   * "&#x05D9;&#x05D5;&#x05DD; &#x05D4;&#x05E2;&#x05E6;&#x05DE;&#x05D0;&#x05D5;&#x05EA;",
   * "&#x05D9;&#x05D5;&#x05DD; &#x05D9;&#x05E8;&#x05D5;&#x05E9;&#x05DC;&#x05D9;&#x05DD;",
   * "&#x05DC;&#x05F4;&#x05D2; &#x05D1;&#x05E2;&#x05D5;&#x05DE;&#x05E8;",
   * "&#x05E9;&#x05D5;&#x05E9;&#x05DF; &#x05E4;&#x05D5;&#x05E8;&#x05D9;&#x05DD; &#x05E7;&#x05D8;&#x05DF;"]</code>
   */
  private static readonly hebrewHolidays: string[] = ['\u05E2\u05E8\u05D1 \u05E4\u05E1\u05D7', '\u05E4\u05E1\u05D7',
    '\u05D7\u05D5\u05DC \u05D4\u05DE\u05D5\u05E2\u05D3 \u05E4\u05E1\u05D7',
    '\u05E4\u05E1\u05D7 \u05E9\u05E0\u05D9', '\u05E2\u05E8\u05D1 \u05E9\u05D1\u05D5\u05E2\u05D5\u05EA',
    '\u05E9\u05D1\u05D5\u05E2\u05D5\u05EA',
    '\u05E9\u05D1\u05E2\u05D4 \u05E2\u05E9\u05E8 \u05D1\u05EA\u05DE\u05D5\u05D6',
    '\u05EA\u05E9\u05E2\u05D4 \u05D1\u05D0\u05D1', '\u05D8\u05F4\u05D5 \u05D1\u05D0\u05D1',
    '\u05E2\u05E8\u05D1 \u05E8\u05D0\u05E9 \u05D4\u05E9\u05E0\u05D4',
    '\u05E8\u05D0\u05E9 \u05D4\u05E9\u05E0\u05D4', '\u05E6\u05D5\u05DD \u05D2\u05D3\u05DC\u05D9\u05D4',
    '\u05E2\u05E8\u05D1 \u05D9\u05D5\u05DD \u05DB\u05D9\u05E4\u05D5\u05E8',
    '\u05D9\u05D5\u05DD \u05DB\u05D9\u05E4\u05D5\u05E8', '\u05E2\u05E8\u05D1 \u05E1\u05D5\u05DB\u05D5\u05EA',
    '\u05E1\u05D5\u05DB\u05D5\u05EA',
    '\u05D7\u05D5\u05DC \u05D4\u05DE\u05D5\u05E2\u05D3 \u05E1\u05D5\u05DB\u05D5\u05EA',
    '\u05D4\u05D5\u05E9\u05E2\u05E0\u05D0 \u05E8\u05D1\u05D4',
    '\u05E9\u05DE\u05D9\u05E0\u05D9 \u05E2\u05E6\u05E8\u05EA',
    '\u05E9\u05DE\u05D7\u05EA \u05EA\u05D5\u05E8\u05D4', '\u05E2\u05E8\u05D1 \u05D7\u05E0\u05D5\u05DB\u05D4',
    '\u05D7\u05E0\u05D5\u05DB\u05D4', '\u05E2\u05E9\u05E8\u05D4 \u05D1\u05D8\u05D1\u05EA',
    '\u05D8\u05F4\u05D5 \u05D1\u05E9\u05D1\u05D8', '\u05EA\u05E2\u05E0\u05D9\u05EA \u05D0\u05E1\u05EA\u05E8',
    '\u05E4\u05D5\u05E8\u05D9\u05DD', '\u05E9\u05D5\u05E9\u05DF \u05E4\u05D5\u05E8\u05D9\u05DD',
    '\u05E4\u05D5\u05E8\u05D9\u05DD \u05E7\u05D8\u05DF', '\u05E8\u05D0\u05E9 \u05D7\u05D5\u05D3\u05E9',
    '\u05D9\u05D5\u05DD \u05D4\u05E9\u05D5\u05D0\u05D4',
    '\u05D9\u05D5\u05DD \u05D4\u05D6\u05D9\u05DB\u05E8\u05D5\u05DF',
    '\u05D9\u05D5\u05DD \u05D4\u05E2\u05E6\u05DE\u05D0\u05D5\u05EA',
    '\u05D9\u05D5\u05DD \u05D9\u05E8\u05D5\u05E9\u05DC\u05D9\u05DD',
    '\u05DC\u05F4\u05D2 \u05D1\u05E2\u05D5\u05DE\u05E8',
    '\u05E9\u05D5\u05E9\u05DF \u05E4\u05D5\u05E8\u05D9\u05DD \u05E7\u05D8\u05DF',
    '\u05D0\u05E1\u05E8\u05D5 \u05D7\u05D2'];

  /**
   * Formats the Yom Tov (holiday) in Hebrew or transliterated Latin characters.
   *
   * @param jewishCalendar the JewishCalendar
   * @return the formatted holiday or an empty String if the day is not a holiday.
   * @see #isHebrewFormat()
   */
  public formatYomTov(jewishCalendar: JewishCalendar): string {
    const index: number = jewishCalendar.getYomTovIndex();
    if (index === JewishCalendar.CHANUKAH) {
      const dayOfChanukah: number = jewishCalendar.getDayOfChanukah();
      return this.hebrewFormat
        ? (`${this.formatHebrewNumber(dayOfChanukah)} ${HebrewDateFormatter.hebrewHolidays[index]}`)
        : (`${this.transliteratedHolidays[index]} ${dayOfChanukah}`);
    }
    if (index === -1) return '';
    return this.hebrewFormat ? HebrewDateFormatter.hebrewHolidays[index] : this.transliteratedHolidays[index];
  }

  /**
   * Formats a day as Rosh Chodesh in the format of in the format of &#x05E8;&#x05D0;&#x05E9;
   * &#x05D7;&#x05D5;&#x05D3;&#x05E9; &#x05E9;&#x05D1;&#x05D8; or Rosh Chodesh Shevat. If it
   * is not Rosh Chodesh, an empty <code>String</code> will be returned.
   * @param jewishCalendar the JewishCalendar
   * @return The formatted <code>String</code> in the format of &#x05E8;&#x05D0;&#x05E9;
   * &#x05D7;&#x05D5;&#x05D3;&#x05E9; &#x05E9;&#x05D1;&#x05D8; or Rosh Chodesh Shevat. If it
   * is not Rosh Chodesh, an empty <code>String</code> will be returned.
   */
  public formatRoshChodesh(jewishCalendar: JewishCalendar): string {
    if (!jewishCalendar.isRoshChodesh()) return '';

    let formattedRoshChodesh: string;
    let month: number = jewishCalendar.getJewishMonth();
    if (jewishCalendar.getJewishDayOfMonth() === 30) {
      if (month < JewishCalendar.ADAR || (month === JewishCalendar.ADAR && jewishCalendar.isJewishLeapYear())) {
        month++;
      } else { // roll to Nissan
        month = JewishCalendar.NISSAN;
      }
    }

    // This method is only about formatting, so we shouldn't make any changes to the params passed in...
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _jewishCalendar = jewishCalendar.clone() as JewishCalendar;
    _jewishCalendar.setJewishMonth(month);
    formattedRoshChodesh = this.hebrewFormat ? HebrewDateFormatter.hebrewHolidays[JewishCalendar.ROSH_CHODESH]
      : this.transliteratedHolidays[JewishCalendar.ROSH_CHODESH];
    formattedRoshChodesh += ` ${this.formatMonth(_jewishCalendar)}`;
    return formattedRoshChodesh;
  }

  /**
   * Returns if the formatter is set to use Hebrew formatting in the various formatting methods.
   *
   * @return the hebrewFormat
   * @see #setHebrewFormat(boolean)
   * @see #format(JewishDate)
   * @see #formatDayOfWeek(JewishDate)
   * @see #formatMonth(JewishDate)
   * @see #formatOmer(JewishCalendar)
   * @see #formatParsha(JewishCalendar)
   * @see #formatYomTov(JewishCalendar)
   */
  public isHebrewFormat(): boolean {
    return this.hebrewFormat;
  }

  /**
   * Sets the formatter to format in Hebrew in the various formatting methods.
   *
   * @param hebrewFormat
   *            the hebrewFormat to set
   * @see #isHebrewFormat()
   * @see #format(JewishDate)
   * @see #formatDayOfWeek(JewishDate)
   * @see #formatMonth(JewishDate)
   * @see #formatOmer(JewishCalendar)
   * @see #formatParsha(JewishCalendar)
   * @see #formatYomTov(JewishCalendar)
   */
  public setHebrewFormat(hebrewFormat: boolean): void {
    this.hebrewFormat = hebrewFormat;
  }

  /**
   * Returns the Hebrew Omer prefix.&nbsp; By default it is the letter &#x05D1; producing
   * &#x05D1;&#x05E2;&#x05D5;&#x05DE;&#x05E8;, but it can be set to &#x05DC; to produce
   * &#x05DC;&#x05E2;&#x05D5;&#x05DE;&#x05E8; (or any other prefix) using the {@link #setHebrewOmerPrefix(String)}.
   *
   * @return the hebrewOmerPrefix
   *
   * @see #hebrewOmerPrefix
   * @see #setHebrewOmerPrefix(String)
   * @see #formatOmer(JewishCalendar)
   */
  public getHebrewOmerPrefix(): string {
    return this.hebrewOmerPrefix;
  }

  /**
   * Method to set the Hebrew Omer prefix. By default it is the letter &#x5D1;, but this allows setting it to a
   * &#x5DC; (or any other prefix).
   *
   * @param hebrewOmerPrefix
   *            the hebrewOmerPrefix to set. You can use the Unicode &#92;u05DC to set it to &#x5DC;.
   * @see #getHebrewOmerPrefix()
   * @see #formatOmer(JewishCalendar)
   */
  public setHebrewOmerPrefix(hebrewOmerPrefix: string): void {
    this.hebrewOmerPrefix = hebrewOmerPrefix;
  }

  /**
   * Returns the array of months transliterated into Latin chars. The default list of months uses Ashkenazi
   * pronunciation in typical American English spelling. This list has a length of 14 with 3 variations for Adar -
   * "Adar", "Adar II", "Adar I"
   *
   * @return the array of months beginning in Nissan and ending in "Adar", "Adar II", "Adar I". The default list is
   *         currently ["Nissan", "Iyar", "Sivan", "Tammuz", "Av", "Elul", "Tishrei", "Cheshvan", "Kislev", "Teves",
   *         "Shevat", "Adar", "Adar II", "Adar I"].
   * @see #setTransliteratedMonthList(String[])
   */
  public getTransliteratedMonthList(): string[] {
    return this.transliteratedMonths;
  }

  /**
   * Setter method to allow overriding of the default list of months transliterated into Latin chars. The default
   * uses Ashkenazi American English transliteration.
   *
   * @param transliteratedMonths
   *            an array of 14 month names that defaults to ["Nissan", "Iyar", "Sivan", "Tamuz", "Av", "Elul", "Tishrei",
   *            "Heshvan", "Kislev", "Tevet", "Shevat", "Adar", "Adar II", "Adar I"].
   * @see #getTransliteratedMonthList()
   */
  public setTransliteratedMonthList(transliteratedMonths: string[]): void {
    this.transliteratedMonths = transliteratedMonths;
  }

  /**
   * Unicode list of Hebrew months in the following format <code>["\u05E0\u05D9\u05E1\u05DF","\u05D0\u05D9\u05D9\u05E8",
   * "\u05E1\u05D9\u05D5\u05DF","\u05EA\u05DE\u05D5\u05D6","\u05D0\u05D1","\u05D0\u05DC\u05D5\u05DC",
   * "\u05EA\u05E9\u05E8\u05D9","\u05D7\u05E9\u05D5\u05DF","\u05DB\u05E1\u05DC\u05D5","\u05D8\u05D1\u05EA",
   * "\u05E9\u05D1\u05D8","\u05D0\u05D3\u05E8","\u05D0\u05D3\u05E8 \u05D1","\u05D0\u05D3\u05E8 \u05D0"]</code>
   *
   * @see #formatMonth(JewishDate)
   */
  private hebrewMonths: string[] = ['\u05E0\u05D9\u05E1\u05DF', '\u05D0\u05D9\u05D9\u05E8',
    '\u05E1\u05D9\u05D5\u05DF', '\u05EA\u05DE\u05D5\u05D6', '\u05D0\u05D1', '\u05D0\u05DC\u05D5\u05DC',
    '\u05EA\u05E9\u05E8\u05D9', '\u05D7\u05E9\u05D5\u05DF', '\u05DB\u05E1\u05DC\u05D5',
    '\u05D8\u05D1\u05EA', '\u05E9\u05D1\u05D8', '\u05D0\u05D3\u05E8', '\u05D0\u05D3\u05E8 \u05D1',
    '\u05D0\u05D3\u05E8 \u05D0'];

  /**
   * Unicode list of Hebrew days of week in the format of <code>["&#x05E8;&#x05D0;&#x05E9;&#x05D5;&#x05DF;",
   * "&#x05E9;&#x05E0;&#x05D9;","&#x05E9;&#x05DC;&#x05D9;&#x05E9;&#x05D9;","&#x05E8;&#x05D1;&#x05D9;&#x05E2;&#x05D9;",
   * "&#x05D7;&#x05DE;&#x05D9;&#x05E9;&#x05D9;","&#x05E9;&#x05E9;&#x05D9;","&#x05E9;&#x05D1;&#x05EA;"]</code>
   */
  private static readonly hebrewDaysOfWeek: string[] = ['\u05E8\u05D0\u05E9\u05D5\u05DF', '\u05E9\u05E0\u05D9',
    '\u05E9\u05DC\u05D9\u05E9\u05D9', '\u05E8\u05D1\u05D9\u05E2\u05D9', '\u05D7\u05DE\u05D9\u05E9\u05D9',
    '\u05E9\u05E9\u05D9', '\u05E9\u05D1\u05EA'];

  /**
   * Formats the day of week. If {@link #isHebrewFormat() Hebrew formatting} is set, it will display in the format
   * &#x05E8;&#x05D0;&#x05E9;&#x05D5;&#x05DF; etc. If Hebrew formatting is not in use it will return it in the format
   * of Sunday etc. There are various formatting options that will affect the output.
   *
   * @param jewishDate the JewishDate Object
   * @return the formatted day of week
   * @see #isHebrewFormat()
   * @see #isLongWeekFormat()
   */
  public formatDayOfWeek(jewishDate: JewishDate): string {
    if (this.hebrewFormat) {
      if (this.isLongWeekFormat()) {
        return HebrewDateFormatter.hebrewDaysOfWeek[jewishDate.getDayOfWeek() - 1];
      }

      if (jewishDate.getDayOfWeek() === 7) {
        return this.formatHebrewNumber(300);
      }

      return this.formatHebrewNumber(jewishDate.getDayOfWeek());
    }

    if (jewishDate.getDayOfWeek() === 7) {
      if (this.isLongWeekFormat()) {
        return this.getTransliteratedShabbosDayOfWeek();
      }

      return this.getTransliteratedShabbosDayOfWeek().substring(0, 3);
    }

    const dateTime = jewishDate.getDate();
    return this.weekFormat
      ? dateTime.toLocaleString('en-US', this.weekFormat)
      : dateTime.toString();
  }

  /**
   * Returns whether the class is set to use the Geresh &#x5F3; and Gershayim &#x5F4; in formatting Hebrew dates and
   * numbers. When true and output would look like &#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5F4;&#x5DB;
   * (or &#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5F4;&#x5DA;). When set to false, this output
   * would display as &#x5DB;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5DB;.
   *
   * @return true if set to use the Geresh &#x5F3; and Gershayim &#x5F4; in formatting Hebrew dates and numbers.
   */
  public isUseGershGershayim(): boolean {
    return this.useGershGershayim;
  }

  /**
   * Sets whether to use the Geresh &#x5F3; and Gershayim &#x5F4; in formatting Hebrew dates and numbers. The default
   * value is true and output would look like &#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5F4;&#x5DB;
   * (or &#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5F4;&#x5DA;). When set to false, this output would
   * display as &#x5DB;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5DB; (or
   * &#x5DB;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5DA;). Single digit days or month or years such as &#x05DB;&#x05F3;
   * &#x05E9;&#x05D1;&#x05D8; &#x05D5;&#x05F3; &#x05D0;&#x05DC;&#x05E4;&#x05D9;&#x05DD; show the use of the Geresh.
   *
   * @param useGershGershayim
   *            set this to false to omit the Geresh &#x5F3; and Gershayim &#x5F4; in formatting
   */
  public setUseGershGershayim(useGershGershayim: boolean): void {
    this.useGershGershayim = useGershGershayim;
  }

  /**
   * Returns whether the class is set to use the &#x05DE;&#x05E0;&#x05E6;&#x05E4;&#x05F4;&#x05DA; letters when
   * formatting years ending in 20, 40, 50, 80 and 90 to produce &#x05EA;&#x05E9;&#x05F4;&#x05E4; if false or
   * &#x05EA;&#x05E9;&#x05F4;&#x05E3; if true. Traditionally non-final form letters are used, so the year
   * 5780 would be formatted as &#x05EA;&#x05E9;&#x05F4;&#x05E4; if the default false is used here. If this returns
   * true, the format &#x05EA;&#x05E9;&#x05F4;&#x05E3; would be used.
   *
   * @return true if set to use final form letters when formatting Hebrew years. The default value is false.
   */
  public isUseFinalFormLetters(): boolean {
    return this.useFinalFormLetters;
  }

  /**
   * When formatting a Hebrew Year, traditionally years ending in 20, 40, 50, 80 and 90 are formatted using non-final
   * form letters for example &#x05EA;&#x05E9;&#x05F4;&#x05E4; for the year 5780. Setting this to true (the default
   * is false) will use the final form letters for &#x05DE;&#x05E0;&#x05E6;&#x05E4;&#x05F4;&#x05DA; and will format
   * the year 5780 as &#x05EA;&#x05E9;&#x05F4;&#x05E3;.
   *
   * @param useFinalFormLetters
   *            Set this to true to use final form letters when formatting Hebrew years.
   */
  public setUseFinalFormLetters(useFinalFormLetters: boolean): void {
    this.useFinalFormLetters = useFinalFormLetters;
  }

  /**
   * Returns whether the class is set to use the thousands digit when formatting. When formatting a Hebrew Year,
   * traditionally the thousands digit is omitted and output for a year such as 5729 (1969 Gregorian) would be
   * calculated for 729 and format as &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8;. When set to true the long format year such
   * as &#x5D4;&#x5F3; &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8; for 5729/1969 is returned.
   *
   * @return true if set to use the thousands digit when formatting Hebrew dates and numbers.
   */
  public isUseLongHebrewYears(): boolean {
    return this.useLonghebrewYears;
  }

  /**
   * When formatting a Hebrew Year, traditionally the thousands digit is omitted and output for a year such as 5729
   * (1969 Gregorian) would be calculated for 729 and format as &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8;. This method
   * allows setting this to true to return the long format year such as &#x5D4;&#x5F3;
   * &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8; for 5729/1969.
   *
   * @param useLongHebrewYears
   *            Set this to true to use the long formatting
   */
  public setUseLongHebrewYears(useLongHebrewYears: boolean): void {
    this.useLonghebrewYears = useLongHebrewYears;
  }

  /**
   * Formats the Jewish date. If the formatter is set to Hebrew, it will format in the form, "day Month year" for
   * example &#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8;, and the format
   * "21 Shevat, 5729" if not.
   *
   * @param jewishDate
   *            the JewishDate to be formatted
   * @return the formatted date. If the formatter is set to Hebrew, it will format in the form, "day Month year" for
   *         example &#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8;, and the format
   *         "21 Shevat, 5729" if not.
   */
  public format(jewishDate: JewishDate): string {
    if (this.isHebrewFormat()) {
      return `${this.formatHebrewNumber(jewishDate.getJewishDayOfMonth())} ${this.formatMonth(jewishDate)} ${this.formatHebrewNumber(jewishDate.getJewishYear())}`;
    }
    return `${jewishDate.getJewishDayOfMonth()} ${this.formatMonth(jewishDate)}, ${jewishDate.getJewishYear()}`;
  }

  /**
   * Returns a string of the current Hebrew month such as "Tishrei". Returns a string of the current Hebrew month such
   * as "&#x5D0;&#x5D3;&#x5E8; &#x5D1;&#x5F3;".
   *
   * @param jewishDate
   *            the JewishDate to format
   * @return the formatted month name
   * @see #isHebrewFormat()
   * @see #setHebrewFormat(boolean)
   * @see #getTransliteratedMonthList()
   * @see #setTransliteratedMonthList(String[])
   */
  public formatMonth(jewishDate: JewishDate): string {
    const month: number = jewishDate.getJewishMonth();
    if (this.isHebrewFormat()) {
      if (jewishDate.isJewishLeapYear() && month === JewishDate.ADAR) {
        return this.hebrewMonths[13] + (this.useGershGershayim ? HebrewDateFormatter.GERESH : ''); // return Adar I, not Adar in a leap year
      } else if (jewishDate.isJewishLeapYear() && month === JewishDate.ADAR_II) {
        return this.hebrewMonths[12] + (this.useGershGershayim ? HebrewDateFormatter.GERESH : '');
      }
      return this.hebrewMonths[month - 1];
    }

    if (jewishDate.isJewishLeapYear() && month === JewishDate.ADAR) {
      return this.transliteratedMonths[13]; // return Adar I, not Adar in a leap year
    }

    return this.transliteratedMonths[month - 1];
  }

  /**
   * Returns a String of the Omer day in the form &#x5DC;&#x5F4;&#x5D2; &#x5D1;&#x05E2;&#x05D5;&#x05DE;&#x5E8; if
   * Hebrew Format is set, or "Omer X" or "Lag B'Omer" if not. An empty string if there is no Omer this day.
   *
   * @param jewishCalendar
   *            the JewishCalendar to be formatted
   *
   * @return a String of the Omer day in the form or an empty string if there is no Omer this day. The default
   *         formatting has a &#x5D1;&#x5F3; prefix that would output &#x5D1;&#x05E2;&#x05D5;&#x05DE;&#x5E8;, but this
   *         can be set via the {@link #setHebrewOmerPrefix(String)} method to use a &#x5DC; and output
   *         &#x5DC;&#x5F4;&#x5D2; &#x5DC;&#x05E2;&#x05D5;&#x05DE;&#x5E8;.
   * @see #isHebrewFormat()
   * @see #getHebrewOmerPrefix()
   * @see #setHebrewOmerPrefix(String)
   */
  public formatOmer(jewishCalendar: JewishCalendar): string {
    const omer: number = jewishCalendar.getDayOfOmer();
    if (omer === -1) {
      return '';
    }

    if (this.hebrewFormat) {
      return `${this.formatHebrewNumber(omer)} ${this.hebrewOmerPrefix}עומר`;
    }

    if (omer === 33) { // if Lag B'Omer
      return this.transliteratedHolidays[33];
    }

    return `Omer ${omer}`;
  }

  /**
   * Formats a molad.
   * TODO: Experimental and incomplete
   *
   * @param moladChalakim - the chalakim of the molad
   * @return the formatted molad. FIXME: define proper format in English and Hebrew.
   */
  private static formatMolad(moladChalakim: number): string {
    let adjustedChalakim: number = moladChalakim;
    const MINUTE_CHALAKIM: number = 18;
    const HOUR_CHALAKIM: number = 1080;
    const DAY_CHALAKIM: number = 24 * HOUR_CHALAKIM;

    let days: number = adjustedChalakim / DAY_CHALAKIM;
    adjustedChalakim -= (days * DAY_CHALAKIM);
    const hours: number = Math.trunc(adjustedChalakim / HOUR_CHALAKIM);
    if (hours >= 6) {
      days += 1;
    }
    adjustedChalakim -= (hours * HOUR_CHALAKIM);
    const minutes: number = Math.trunc(adjustedChalakim / MINUTE_CHALAKIM);
    adjustedChalakim -= minutes * MINUTE_CHALAKIM;
    return `Day: ${days % 7} hours: ${hours}, minutes: ${minutes}, chalakim: ${adjustedChalakim}`;
  }

  /**
   * Returns the kviah in the traditional 3 letter Hebrew format where the first letter represents the day of week of
   * Rosh Hashana, the second letter represents the lengths of Cheshvan and Kislev ({@link JewishDate#SHELAIMIM
   * Shelaimim} , {@link JewishDate#KESIDRAN Kesidran} or {@link JewishDate#CHASERIM Chaserim}) and the 3rd letter
   * represents the day of week of Pesach. For example 5729 (1969) would return &#x5D1;&#x5E9;&#x5D4; (Rosh Hashana on
   * Monday, Shelaimim, and Pesach on Thursday), while 5771 (2011) would return &#x5D4;&#x5E9;&#x5D2; (Rosh Hashana on
   * Thursday, Shelaimim, and Pesach on Tuesday).
   *
   * @param jewishYear
   *            the Jewish year
   * @return the Hebrew String such as &#x5D1;&#x5E9;&#x5D4; for 5729 (1969) and &#x5D4;&#x5E9;&#x5D2; for 5771
   *         (2011).
   */
  public getFormattedKviah(jewishYear: number): string {
    const jewishDate: JewishDate = new JewishDate(jewishYear, JewishDate.TISHREI, 1); // set date to Rosh Hashana
    const kviah: number = jewishDate.getCheshvanKislevKviah();
    const roshHashanaDayOfweek: number = jewishDate.getDayOfWeek();
    let returnValue: string = this.formatHebrewNumber(roshHashanaDayOfweek);
    returnValue += (kviah === JewishDate.CHASERIM ? '\u05D7' : kviah === JewishDate.SHELAIMIM ? '\u05E9' : '\u05DB');
    jewishDate.setJewishDate(jewishYear, JewishDate.NISSAN, 15); // set to Pesach of the given year
    const pesachDayOfweek: number = jewishDate.getDayOfWeek();
    returnValue += this.formatHebrewNumber(pesachDayOfweek);
    returnValue = returnValue.replace(new RegExp(HebrewDateFormatter.GERESH, 'g'), ''); // geresh is never used in the kviah format
    // boolean isLeapYear = JewishDate.isJewishLeapYear(jewishYear);
    // for efficiency we can avoid the expensive recalculation of the pesach day of week by adding 1 day to Rosh
    // Hashana for a 353-day year, 2 for a 354-day year, 3 for a 355 or 383-day year, 4 for a 384-day year and 5 for
    // a 385-day year
    return returnValue;
  }

  /**
   * Formats the <a href="https://en.wikipedia.org/wiki/Daf_Yomi">Daf Yomi</a> Bavli in the format of
   * "&#x05E2;&#x05D9;&#x05E8;&#x05D5;&#x05D1;&#x05D9;&#x05DF; &#x05E0;&#x05F4;&#x05D1;" in {@link #isHebrewFormat() Hebrew},
   * or the transliterated format of "Eruvin 52".
   * @param daf the Daf to be formatted.
   * @return the formatted daf.
   */
  public formatDafYomiBavli(daf: Daf): string {
    if (this.hebrewFormat) {
      return `${daf.getMasechta()} ${this.formatHebrewNumber(daf.getDaf())}`;
    }
    return `${daf.getMasechtaTransliterated()} ${daf.getDaf()}`;
  }

  /**
   * Formats the <a href="https://en.wikipedia.org/wiki/Jerusalem_Talmud#Daf_Yomi_Yerushalmi">Daf Yomi Yerushalmi</a> in the format
   * of "&#x05E2;&#x05D9;&#x05E8;&#x05D5;&#x05D1;&#x05D9;&#x05DF; &#x05E0;&#x05F4;&#x05D1;" in {@link #isHebrewFormat() Hebrew}, or
   * the transliterated format of "Eruvin 52".
   *
   * @param daf the Daf to be formatted.
   * @return the formatted daf.
   */
  public formatDafYomiYerushalmi(daf: Daf | null): string {
    if (daf === null) {
      return this.hebrewFormat ? Daf.getYerushalmiMasechtos()[39] : Daf.getYerushalmiMasechtosTransliterated()[39];
    }

    return this.hebrewFormat
        ? `${daf.getYerushalmiMasechta()} ${this.formatHebrewNumber(daf.getDaf())}`
        : `${daf.getYerushalmiMasechtaTransliterated()} ${daf.getDaf()}`;
  }

  /**
   * Returns a Hebrew formatted string of a number. The method can calculate from 0 to 9999.
   * <ul>
   * <li>Single digit numbers such as 3, 30 and 100 will be returned with a &#x5F3; (<a
   * href="https://en.wikipedia.org/wiki/Geresh">Geresh</a>) appended as at the end. For example &#x5D2;&#x5F3;,
   * &#x5DC;&#x5F3; and &#x5E7;&#x5F3;</li>
   * <li>multi digit numbers such as 21 and 769 will be returned with a &#x5F4; (<a
   * href="https://en.wikipedia.org/wiki/Gershayim">Gershayim</a>) between the second to last and last letters. For
   * example &#x5DB;&#x5F4;&#x5D0;, &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8;</li>
   * <li>15 and 16 will be returned as &#x5D8;&#x5F4;&#x5D5; and &#x5D8;&#x5F4;&#x5D6;</li>
   * <li>Single digit numbers (years assumed) such as 6000 (%1000=0) will be returned as &#x5D5;&#x5F3;
   * &#x5D0;&#x5DC;&#x5E4;&#x5D9;&#x5DD;</li>
   * <li>0 will return &#x5D0;&#x5E4;&#x05E1;</li>
   * </ul>
   *
   * @param num
   *            the number to be formatted. It will trow an IllegalArgumentException if the number is &lt; 0 or &gt; 9999.
   * @return the Hebrew formatted number such as &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8;
   * @see #isUseFinalFormLetters()
   * @see #isUseGershGershayim()
   * @see #isHebrewFormat()
   *
   */
  public formatHebrewNumber(num0: number): string {
    let num: number = num0;
    if (num !== Math.trunc(num)) throw new IllegalArgumentException('number must be an integer.');

    if (num < 0) {
      throw new IllegalArgumentException('negative numbers can\'t be formatted');
    } else if (num > 9999) {
      throw new IllegalArgumentException('numbers > 9999 can\'t be formatted');
    }

    const ALAFIM: string = '\u05D0\u05DC\u05E4\u05D9\u05DD';
    const EFES: string = '\u05D0\u05E4\u05E1';

    const jHundreds: string[] = ['', '\u05E7', '\u05E8', '\u05E9', '\u05EA', '\u05EA\u05E7', '\u05EA\u05E8',
      '\u05EA\u05E9', '\u05EA\u05EA', '\u05EA\u05EA\u05E7'];
    const jTens: string[] = ['', '\u05D9', '\u05DB', '\u05DC', '\u05DE', '\u05E0', '\u05E1', '\u05E2',
      '\u05E4', '\u05E6'];
    const jTenEnds: string[] = ['', '\u05D9', '\u05DA', '\u05DC', '\u05DD', '\u05DF', '\u05E1', '\u05E2',
      '\u05E3', '\u05E5'];
    const tavTaz: string[] = ['\u05D8\u05D5', '\u05D8\u05D6'];
    const jOnes: string[] = ['', '\u05D0', '\u05D1', '\u05D2', '\u05D3', '\u05D4', '\u05D5', '\u05D6',
      '\u05D7', '\u05D8'];

    if (num === 0) { // do we really need this? Should it be applicable to a date?
      return EFES;
    }
    const shortNumber: number = num % 1000; // discard thousands
    // next check for all possible single Hebrew digit years
    const singleDigitNumber: boolean = (shortNumber < 11 || (shortNumber < 100 && shortNumber % 10 === 0) || (shortNumber <= 400 && shortNumber % 100 === 0));
    const thousands: number = Math.trunc(num / 1000); // get # thousands
    let sb: string = '';
    // append thousands to String
    if (num % 1000 === 0) { // in year is 5000, 4000 etc
      sb = sb.concat(jOnes[thousands]);
      if (this.isUseGershGershayim()) {
        sb = sb.concat(HebrewDateFormatter.GERESH);
      }
      sb = sb.concat(' ');
      sb = sb.concat(ALAFIM); // add # of thousands plus the word "thousand" (overide alafim boolean)
      return sb;
    } else if (this.useLonghebrewYears && num >= 1000) { // if alafim boolean display thousands
      sb = sb.concat(jOnes[thousands]);
      if (this.isUseGershGershayim()) {
        sb = sb.concat(HebrewDateFormatter.GERESH); // append thousands quote
      }
      sb = sb.concat(' ');
    }
    num = num % 1000; // remove 1000s
    const hundreds: number = Math.trunc(num / 100); // # of hundreds
    sb = sb.concat(jHundreds[hundreds]); // add hundreds to String
    num = num % 100; // remove 100s
    if (num === 15) { // special case 15
      sb = sb.concat(tavTaz[0]);
    } else if (num === 16) { // special case 16
      sb = sb.concat(tavTaz[1]);
    } else {
      const tens: number = Math.trunc(num / 10);
      if (num % 10 === 0) { // if evenly divisible by 10
        if (!singleDigitNumber) {
          if (this.isUseFinalFormLetters()) {
            sb = sb.concat(jTenEnds[tens]); // years like 5780 will end with a final form &#x05E3;
          } else {
            sb = sb.concat(jTens[tens]); // years like 5780 will end with a regular &#x05E4;
          }
        } else {
          sb = sb.concat(jTens[tens]); // standard letters so years like 5050 will end with a regular nun
        }
      } else {
        sb = sb.concat(jTens[tens]);
        num = num % 10;
        sb = sb.concat(jOnes[num]);
      }
    }
    if (this.isUseGershGershayim()) {
      if (singleDigitNumber) {
        sb = sb.concat(HebrewDateFormatter.GERESH); // append single quote
      } else { // append double quote before last digit
        sb = sb.substr(0, sb.length - 1)
          .concat(HebrewDateFormatter.GERSHAYIM)
          .concat(sb.substr(sb.length - 1, 1));
      }
    }
    return sb;
  }

  /**
   * Returns the map of transliterated parshiyos used by this formatter.
   *
   * @return the map of transliterated Parshios
   */
  public getTransliteratedParshiosList(): Record<Parsha, string> {
    return this.transliteratedParshaMap;
  }

  /**
   * Setter method to allow overriding of the default list of parshiyos transliterated into Latin chars. The
   * default uses Ashkenazi American English transliteration.
   *
   * @param transliteratedParshaMap
   *            the transliterated Parshios as an EnumMap to set
   * @see #getTransliteratedParshiosList()
   */
  public setTransliteratedParshiosList(transliteratedParshaMap: Record<Parsha, string>): void {
    this.transliteratedParshaMap = transliteratedParshaMap;
  }

  /**
   * Returns a String with the name of the current parsha(ios). This method gets the current <em>parsha</em> by
   * calling {@link JewishCalendar#getParshah()} that does not return a <em>parsha</em> for any non-<em>Shabbos</em>
   * or a <em>Shabbos</em> that occurs on a <em>Yom Tov</em>, and will return an empty <code>String</code> in those
   * cases. If the class {@link #isHebrewFormat() is set to format in Hebrew} it will return a <code>String</code>
   * of the current parsha(ios) in Hebrew for example &#x05D1;&#x05E8;&#x05D0;&#x05E9;&#x05D9;&#x05EA; or
   * &#x05E0;&#x05E6;&#x05D1;&#x05D9;&#x05DD; &#x05D5;&#x05D9;&#x05DC;&#x05DA; or an empty string if there
   * are none. If not set to Hebrew, it returns a string of the parsha(ios) transliterated into Latin chars. The
   * default uses Ashkenazi pronunciation in typical American English spelling, for example Bereshis or
   * Nitzavim Vayeilech or an empty string if there are none.
   *
   * @param jewishCalendar the JewishCalendar Object
   * @return today's parsha(ios) in Hebrew for example, if the formatter is set to format in Hebrew, returns a string
   *         of the current parsha(ios) in Hebrew for example &#x05D1;&#x05E8;&#x05D0;&#x05E9;&#x05D9;&#x05EA; or
   *         &#x05E0;&#x05E6;&#x05D1;&#x05D9;&#x05DD; &#x05D5;&#x05D9;&#x05DC;&#x05DA; or an empty string if
   *         there are none. If not set to Hebrew, it returns a string of the parsha(ios) transliterated into Latin
   *         chars. The default uses Ashkenazi pronunciation in typical American English spelling, for example
   *         Bereshis or Nitzavim Vayeilech or an empty string if there are none.
   * @see #formatParsha(JewishCalendar)
   * @see #isHebrewFormat()
   * @see JewishCalendar#getParshah()
   */
  public formatParsha(jewishCalendar: JewishCalendar): string;
  /**
   * Returns a String with the name of the current parsha(ios). This method overloads {@link
   * HebrewDateFormatter#formatParsha(JewishCalendar)} and unlike that method, it will format the <em>parsha</em> passed
   * to this method regardless of the day of week. This is the way to format a <em>parsha</em> retrieved from calling
   * {@link JewishCalendar#getUpcomingParshah()}.
   *
   * @param parsha a JewishCalendar.Parsha object
   * @return today's parsha(ios) in Hebrew for example, if the formatter is set to format in Hebrew, returns a string
   *         of the current parsha(ios) in Hebrew for example &#x05D1;&#x05E8;&#x05D0;&#x05E9;&#x05D9;&#x05EA; or
   *         &#x05E0;&#x05E6;&#x05D1;&#x05D9;&#x05DD; &#x05D5;&#x05D9;&#x05DC;&#x05DA; or an empty string if
   *         there are none. If not set to Hebrew, it returns a string of the parsha(ios) transliterated into Latin
   *         chars. The default uses Ashkenazi pronunciation in typical American English spelling, for example
   *         Bereshis or Nitzavim Vayeilech or an empty string if there are none.
   * @see #formatParsha(JewishCalendar)
   * @see JewishCalendar#getUpcomingParshah()
   */
  public formatParsha(parsha: Parsha): string
  public formatParsha(jewishCalendarOrParsha: JewishCalendar | Parsha): string {
    if (jewishCalendarOrParsha instanceof JewishCalendar) {
      const parsha: Parsha = jewishCalendarOrParsha.getParsha();
      return this.formatParsha(parsha);
    }

    return this.hebrewFormat
      ? this.hebrewParshaMap[jewishCalendarOrParsha] || ''
      : this.transliteratedParshaMap[jewishCalendarOrParsha] || '';
  }

  /**
   * Returns a String with the name of the current special parsha of Shekalim, Zachor, Parah or Hachodesh or an
   * empty String for a non-special parsha. If the formatter is set to format in Hebrew, it returns a string of
   * the current special parsha in Hebrew, for example &#x05E9;&#x05E7;&#x05DC;&#x05D9;&#x05DD;,
   * &#x05D6;&#x05DB;&#x05D5;&#x05E8;, &#x05E4;&#x05E8;&#x05D4; or &#x05D4;&#x05D7;&#x05D3;&#x05E9;. An empty
   * string if the date is not a special parsha. If not set to Hebrew, it returns a string of the special parsha
   * transliterated into Latin chars. The default uses Ashkenazi pronunciation in typical American English spelling
   * Shekalim, Zachor, Parah or Hachodesh.
   *
   * @param jewishCalendar the JewishCalendar Object
   * @return today's special parsha. If the formatter is set to format in Hebrew, returns a string
   *         of the current special parsha  in Hebrew for in the format of &#x05E9;&#x05E7;&#x05DC;&#x05D9;&#x05DD;,
   *         &#x05D6;&#x05DB;&#x05D5;&#x05E8;, &#x05E4;&#x05E8;&#x05D4; or &#x05D4;&#x05D7;&#x05D3;&#x05E9; or an empty
   *         string if there are none. If not set to Hebrew, it returns a string of the special parsha transliterated
   *         into Latin chars. The default uses Ashkenazi pronunciation in typical American English spelling of Shekalim,
   *         Zachor, Parah or Hachodesh. An empty string if there are none.
   */
  public formatSpecialParsha(jewishCalendar: JewishCalendar): string {
    const specialParsha: Parsha = jewishCalendar.getSpecialShabbos();
    return this.hebrewFormat
      ? this.hebrewParshaMap[specialParsha] || ''
      : this.transliteratedParshaMap[specialParsha] || '';
  }
}
