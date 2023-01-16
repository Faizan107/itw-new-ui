const objectToArray = (array) => {
    return Object.keys(array).map((r) => {
        return array[r];
    });
};

export { objectToArray };
