import Checkbox from "@components/Checkbox";

type SelectTreeProps = {
  data?: any[];
  isChild?: boolean;
  selectedCategory?: any;
  setCategory?: Function;
};

const SelectTree = ({
  data=[],
  isChild = false,
  setCategory,
  selectedCategory,
}: SelectTreeProps) => {

  return (
    <ul className={`${isChild ? "child" : "parent"}`}>
      {data.map((sub) => {
        if (!sub?.isActive) return;
        if (sub.subcategories?.length) {
          return (
            <li key={sub._id}>
              <Checkbox
                id={sub._id}
                label={sub.name}
                onChange={() => setCategory(sub)}
                checked={selectedCategory?._id === sub._id}
              />
              <SelectTree
                data={sub.subcategories}
                selectedCategory={selectedCategory}
                setCategory={setCategory}
                isChild
              />
            </li>
          );
        }
        return (
          <li key={sub._id}>
            <Checkbox
              id={sub._id}
              label={sub.name}
              onChange={() => setCategory(sub)}
              checked={selectedCategory?._id === sub._id}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default SelectTree;
