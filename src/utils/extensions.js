String.prototype.spliceSplit = function(index, count, add) {
    var ar = this.split('');
    ar.splice(index, count, add);
    return ar.join('');
  }