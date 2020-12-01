const U = {};

U.multipleArrayForeach = (arrays, callback) => {
    arrays.forEach(array => array.forEach((element, index) => callback(array, element, index)))
};
U.hasRemainder = (number, divisionNumber) => {
    return number % divisionNumber != 0;
};
U.editArrayIndexElement = (arr, idx, ...value) => {
    arr.splice(idx, 1, ...value)
};
U.repeatValue = (value, repeatNumber) => {
    let res = [];
    for(let i=0; i<repeatNumber; i++){
        res.push(value)
    }
    return res;
}