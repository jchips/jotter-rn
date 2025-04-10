const sortMethods = {

  // Most recently created note/folder
  sortByCreatedAsc: (data) => {
    let dataCopy = [...data];
    dataCopy.sort((a, b) => {
      const date1 = new Date(a.createdAt);
      const date2 = new Date(b.createdAt);
      return date2 - date1;
    });
    return dataCopy;
  },

  // Oldest note/folder at top
  sortByCreatedDesc: (data) => {
    let dataCopy = [...data];
    dataCopy.sort((a, b) => {
      const date1 = new Date(a.createdAt);
      const date2 = new Date(b.createdAt);
      return date1 - date2;
    });
    return dataCopy;
  },

  // Most recently edited note/folder
  sortByUpdatedAsc: (data) => {
    let dataCopy = [...data];
    dataCopy.sort((a, b) => {
      const date1 = new Date(a.updatedAt);
      const date2 = new Date(b.updatedAt);
      return date2 - date1;
    });
    return dataCopy;
  },

  // Oldest updates at top
  sortByUpdatedDesc: (data) => {
    let dataCopy = [...data];
    dataCopy.sort((a, b) => {
      const date1 = new Date(a.updatedAt);
      const date2 = new Date(b.updatedAt);
      return date1 - date2;
    });
    return dataCopy;
  },

  /**
   * Sort by title AZ
   * Sorts numbers and letters
   * If there are 2 numbers, compare numerically
   * If there is 1 number, numbers come before letters
   * If there is 1 letter, letters come after numbers
   * If there are no numbers, compare alphabetically
   * (ex: 12, 2a, a1, a2, a12, abc, b, b4)
   */
  sortByTitleDesc: (data) => {
    let dataCopy = [...data];
    dataCopy.sort((a, b) => {
      const regex = /(\d+|\D+)/g;

      // Split into alphanumeric parts
      const partsA = a.title.match(regex) || [];
      const partsB = b.title.match(regex) || [];

      // Compare each part (letters or numbers)
      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const partA = partsA[i] || '';
        const partB = partsB[i] || '';

        const isNumA = /^\d+$/.test(partA);
        const isNumB = /^\d+$/.test(partB);

        if (isNumA && isNumB) { // Compare numerically
          const numA = parseInt(partA, 10);
          const numB = parseInt(partB, 10);
          if (numA !== numB) return numA - numB;
        } else if (isNumA) { // Numbers come before letters
          return -1;
        } else if (isNumB) { // Letters come after numbers
          return 1;
        } else { // Compare alphabetically
          if (partA !== partB) return partA.localeCompare(partB);
        }
      }

      // Equal strings
      return 0;
    });
    return dataCopy;
  },

  /**
   * Sort by title ZA
   * Sorts numbers and letters
   */
  sortByTitleAsc: (data) => {
    let dataCopy = [...data];
    dataCopy.sort((a, b) => {
      const regex = /(\d+|\D+)/g;

      // Split into alphanumeric parts
      const partsA = a.title.match(regex) || [];
      const partsB = b.title.match(regex) || [];

      // Compare each part (letters or numbers)
      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const partA = partsA[i] || '';
        const partB = partsB[i] || '';

        const isNumA = /^\d+$/.test(partA);
        const isNumB = /^\d+$/.test(partB);

        if (isNumA && isNumB) { // Compare numerically (largest to smallest)
          const numA = parseInt(partA, 10);
          const numB = parseInt(partB, 10);
          if (numA !== numB) return numB - numA;
        } else if (isNumA) { // Letters come before numbers
          return 1;
        } else if (isNumB) { // Numbers come after letters
          return -1;
        } else { // Compare alphabetically Z-A
          if (partA !== partB) return partB.localeCompare(partA);
        }
      }

      // Equal title strings
      return 0;
    })
    return dataCopy;
  }
}

export default sortMethods;