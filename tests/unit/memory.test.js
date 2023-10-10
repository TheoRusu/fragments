// Fix this path to point to your project's `memory-db.js` source file
// const logger = require('../../src/logger');
const logger = require('../../src/logger');
const {
  writeFragment,
  writeFragmentData,
  readFragment,
  readFragmentData,
} = require('../../src/model/data/memory/index');

describe('memory', () => {
  const fragment = {
    ownerId: '1',
    id: '2',
    buffer: 'some data',
  };

  const badFragment1 = {
    ownerId: 1,
    id: '2',
    buffer: 'some data',
  };

  const badFragment2 = {
    ownerId: '1',
    id: 2,
    buffer: 'some data',
  };

  test('writeFragment - successful write', async () => {
    const result = await writeFragment(fragment);
    expect(result).resolves;
  });

  test('writeFragment - incorrect ownerId', async () => {
    try {
      await writeFragment(badFragment1);
    } catch (err) {
      expect(err).toEqual(
        new Error(
          `primaryKey and secondaryKey strings are required, got primaryKey=${badFragment1.ownerId}, secondaryKey=${badFragment1.id}`
        )
      );
    }
  });

  test('writeFragment - incorrect id', async () => {
    try {
      await writeFragment(badFragment2);
    } catch (err) {
      expect(err).toEqual(
        new Error(
          `primaryKey and secondaryKey strings are required, got primaryKey=${badFragment2.ownerId}, secondaryKey=${badFragment2.id}`
        )
      );
    }
  });

  test('readFragment - successful read', async () => {
    const result = await readFragment(fragment.ownerId, fragment.id);
    expect(result).toEqual(fragment);
  });

  test('readFragment - incorrect ownerId', async () => {
    try {
      await readFragment(badFragment1.ownerId, badFragment1.id);
    } catch (err) {
      expect(err).toEqual(
        new Error(
          `primaryKey and secondaryKey strings are required, got primaryKey=${badFragment1.ownerId}, secondaryKey=${badFragment1.id}`
        )
      );
    }
  });

  test('readFragment - incorrect id', async () => {
    try {
      await readFragment(badFragment2.ownerId, badFragment2.id);
    } catch (err) {
      expect(err).toEqual(
        new Error(
          `primaryKey and secondaryKey strings are required, got primaryKey=${badFragment2.ownerId}, secondaryKey=${badFragment2.id}`
        )
      );
    }
  });

  test('writeFragmentData - successful write', async () => {
    const result = await writeFragmentData(fragment.ownerId, fragment.id, fragment.buffer);
    expect(result).resolves;
  });

  test('writeFragmentData - incorrect ownerId', async () => {
    try {
      await writeFragmentData(fragment.ownerId, fragment.id, fragment.buffer);
    } catch (err) {
      expect(err).toEqual(
        new Error(
          `primaryKey and secondaryKey strings are required, got primaryKey=${badFragment1.ownerId}, secondaryKey=${badFragment1.id}`
        )
      );
    }
  });

  test('writeFragmentData - incorrect id', async () => {
    try {
      await writeFragmentData(fragment.ownerId, fragment.id, fragment.buffer);
    } catch (err) {
      expect(err).toEqual(
        new Error(
          `primaryKey and secondaryKey strings are required, got primaryKey=${badFragment2.ownerId}, secondaryKey=${badFragment2.id}`
        )
      );
    }
  });

  test('readFragmentData - successful read', async () => {
    const result = await readFragmentData(fragment.ownerId, fragment.id);
    expect(result).toEqual(fragment.buffer);
  });

  test('readFragmentData - incorrect ownerId', async () => {
    try {
      await readFragmentData(badFragment1.ownerId, badFragment1.id);
    } catch (err) {
      expect(err).toEqual(
        new Error(
          `primaryKey and secondaryKey strings are required, got primaryKey=${badFragment1.ownerId}, secondaryKey=${badFragment1.id}`
        )
      );
    }
  });

  test('readFragmentData - incorrect id', async () => {
    try {
      await readFragmentData(badFragment2.ownerId, badFragment2.id);
    } catch (err) {
      expect(err).toEqual(
        new Error(
          `primaryKey and secondaryKey strings are required, got primaryKey=${badFragment2.ownerId}, secondaryKey=${badFragment2.id}`
        )
      );
    }
  });
});
