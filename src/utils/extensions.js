String.prototype.spliceSplit = function (index, count, add) {
  const ar = this.split('');
  ar.splice(index, count, add);
  return ar.join('');
};
