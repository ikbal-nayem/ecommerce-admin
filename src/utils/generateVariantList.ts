const generateVariants = (optionList: any[]) => {
  const optionListCopy = [...optionList]
  var variants = [];
  if(optionListCopy.length && !optionListCopy[optionListCopy.length-1]?.values?.length)
    optionListCopy.pop()
  
  optionListCopy.forEach((option, idx) => {
    let tree_length = 1;
    for (let i = idx + 1; i < optionListCopy.length; i++) {
      tree_length *= optionListCopy[i]?.values?.length;
    }
    if (idx === 0) {
      option?.values?.forEach((val) => {
        for (let j = 0; j < tree_length; j++) {
          if (val?.name)
            variants.push([{ key: option.name, value: val?.name }]);
        }
      });
    } else {
      option?.values?.forEach((val, val_idx) => {
        if(val?.name){
          let start = tree_length * val_idx;
          let end = start + tree_length;
          for (let j = 0; j < variants.length; j++) {
            if ((j >= start && j < end) || option?.values.length===1) {
              variants[j].push({ key: option.name, value: val?.name });
            }
            if (j === end) {
              start = end + (tree_length * option?.values?.length - tree_length);
              end = start + tree_length;
            }
          }
        }
      });
    }
  });
  return variants;
};

export default generateVariants;
