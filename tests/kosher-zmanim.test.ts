import { describe, it } from 'mocha';
import { assert } from 'chai';

import { Temporal } from 'temporal-polyfill';

import * as KosherZmanim from '../src/kosher-zmanim';

import { omit } from './utils';

describe('Test kosher-zmanim', function () {
  it('It returns the correct metadata for Basic Zmanim', function () {
    const date = Temporal.Now.plainDateISO();
    const locationName: string = 'Lakewood';
    const latitude: number = 40.0821;
    const longitude: number = -74.2097;
    const timeZoneId: string = 'America/New_York';

    const options: KosherZmanim.Options = {
      date,
      timeZoneId,
      locationName,
      latitude,
      longitude,
      elevation: 10,
    };
    const zmanimJson = KosherZmanim.getZmanimJson(options);

    const expected = {
      algorithm: 'US National Oceanic and Atmospheric Administration Algorithm',
      date: date.toString(),
      elevation: '10.0',
      latitude: latitude.toString(),
      location: locationName,
      longitude: longitude.toString(),
      timeZoneID: timeZoneId,
      type: 'com.kosherjava.zmanim.ZmanimCalendar',
    };

    assert.deepStrictEqual(omit(zmanimJson.metadata, ['timeZoneOffset']), expected);
    assert.oneOf(zmanimJson.metadata.timeZoneOffset, ['-4.0', '-5.0']);
  });

  it('It returns the correct metadata for Complex Zmanim', function () {
    const date = Temporal.Now.plainDateISO();
    const latitude: number = 40.0821;
    const longitude: number = -74.2097;
    const timeZoneId: string = 'America/New_York';

    const options: KosherZmanim.Options = {
      date,
      timeZoneId,
      latitude,
      longitude,
      elevation: 10,
      complexZmanim: true,
    };
    const zmanimJson = KosherZmanim.getZmanimJson(options);

    const expected = {
      algorithm: 'US National Oceanic and Atmospheric Administration Algorithm',
      date: date.toString(),
      elevation: '10.0',
      latitude: latitude.toString(),
      location: null,
      longitude: longitude.toString(),
      timeZoneID: timeZoneId,
      type: 'com.kosherjava.zmanim.ComplexZmanimCalendar',
    };

    assert.deepStrictEqual(omit(zmanimJson.metadata, ['timeZoneOffset']), expected);
    assert.oneOf(zmanimJson.metadata.timeZoneOffset, ['-4.0', '-5.0']);
  });
});
