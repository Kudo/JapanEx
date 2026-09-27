export function createSaveQueue<T>(save: (value: T) => Promise<void>): (value: T) => Promise<void> {
  let lastSave: Promise<void> = Promise.resolve();

  return (value) => {
    const nextSave = lastSave.catch(() => undefined).then(() => save(value));
    lastSave = nextSave;
    return nextSave;
  };
}
